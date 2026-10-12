// Boundless outbound Gmail SENT -> Notion CRM reconciler.
// Separate Cloudflare Worker: NEVER calls Gmail send/modify, nor changes founder QA.
// Deploy is deliberately read-only until WRITES_ENABLED=true. No secrets in source.
const VERSION = "2025-09-03";
const MAX_PAGES = 5, PAGE_SIZE = 100, MAX_JOBS = 12;
const ADVANCED = new Set(["Follow-Up","Responded","Qualified","Discovery Booked","No Response","Not Interested","Not a Fit","Do Not Contact","Future Opportunity"]);
const SECOND = 1000;
export function normalizeEmail(s) {
  const match = String(s || "").match(/<([^<>@\s]+@[^<>@\s]+)>/);
  return (match ? match[1] : String(s || "").trim()).toLowerCase();
}
export function header(headers, name) {
  return headers?.find(x => x.name?.toLowerCase() === name.toLowerCase())?.value || "";
}
export function statusForSend(existing, followup) {
  return ADVANCED.has(existing) ? existing : (followup ? "Follow-Up" : "Contacted");
}
export function shouldClearDraft(companyProps) {
  const val = k => (companyProps[k]?.rich_text || []).map(x => x.plain_text || x.text?.content || "").join("");
  const draft = val("Canonical Draft ID"), approval = val("Founder Approved Draft ID");
  const qa = val("QA Passed Message ID"), approvedMsg = val("Founder Approved Message ID");
  return !!draft && draft === approval && !!qa && qa === approvedMsg &&
    companyProps["Draft Release Status"]?.select?.name === "APPROVED";
}
function textOf(props, name) {
  return (props[name]?.rich_text || []).map(x => x.plain_text || x.text?.content || "").join("");
}
function required(env) {
  for (const k of ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN",
    "NOTION_TOKEN", "GMAIL_ADDRESS", "NOTION_COMPANIES_SOURCE", "NOTION_EVENTS_SOURCE", "START_AFTER_UNIX"]) {
    if (!env[k]) throw new Error("Missing required Worker secret/config: " + k);
  }
  if (!Number.isFinite(Number(env.START_AFTER_UNIX)) || Number(env.START_AFTER_UNIX) < 1_600_000_000)
    throw new Error("START_AFTER_UNIX must be a valid Unix timestamp; no retrospective bulk backfill.");
}
async function jsonRequest(url, init = {}, label = "API") {
  const response = await fetch(url, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(label + " HTTP " + response.status + ": " +
      String(data?.error?.message || data?.message || response.statusText).slice(0,300));
    err.status = response.status;
    throw err;
  }
  return data;
}
async function gmailToken(env) {
  const body = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: env.GOOGLE_REFRESH_TOKEN, grant_type: "refresh_token"
  });
  const r = await jsonRequest("https://oauth2.googleapis.com/token",{
    method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body
  },"Google OAuth");
  if (!r.access_token) throw new Error("OAuth response lacks access_token");
  return r.access_token;
}
async function gmail(token, path) {
  return jsonRequest("https://gmail.googleapis.com/gmail/v1/users/me/" + path, {
    headers: { Authorization: "Bearer " + token }
  },"Gmail");
}
async function gmailDraftMissing(token, draftId) {
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/drafts/" +
    encodeURIComponent(draftId) + "?format=metadata",{
    headers: { Authorization: "Bearer " + token }
  });
  if (res.status === 404) return true;
  if (!res.ok) throw new Error("Gmail draft lookup HTTP " + res.status);
  return false;
}
async function notion(env, method, path, body) {
  return jsonRequest("https://api.notion.com/v1/" + path,{
    method,
    headers: {
      Authorization:"Bearer " + env.NOTION_TOKEN,
      "Notion-Version": VERSION, "Content-Type":"application/json"
    },
    ...(body === undefined ? {} : {body:JSON.stringify(body)})
  },"Notion");
}
async function queryAll(env, dataSource, filter) {
  const results = [];
  let cursor;
  do {
    const body = {filter,page_size:100,...(cursor ? {start_cursor:cursor}:{})};
    const page = await notion(env,"POST","data_sources/"+dataSource+"/query",body);
    results.push(...(page.results || []));
    if (results.length > 1000) throw new Error("Ambiguous Notion query: >1000 matches");
    cursor = page.has_more ? page.next_cursor : undefined;
    if (page.has_more && !cursor) throw new Error("Notion pagination missing next_cursor");
  } while(cursor);
  return results;
}
async function matchCompany(env, email) {
  const matches = await queryAll(env,env.NOTION_COMPANIES_SOURCE,
    {property:"Primary Contact Email",email:{equals:email}});
  if (!matches.length) return null; // e.g. unrelated mail in business Gmail
  if (matches.length !== 1) throw new Error("Ambiguous company email (multiple Notion rows)");
  return matches[0];
}
async function lookupEvent(env, providerId) {
  return queryAll(env,env.NOTION_EVENTS_SOURCE,
    {property:"Provider Message ID",rich_text:{equals:providerId}});
}
async function recordEvent(env,msg,company,followup) {
  const id = msg.id;
  let rows = await lookupEvent(env,id);
  if (rows.length > 1) throw new Error("DUPLICATE Provider Message ID in Notion: "+id);
  if (!rows.length) {
    if (env.WRITES_ENABLED !== "true") return {state:"dry_run"};
    const at = new Date(Number(msg.internalDate)).toISOString();
    const title = (followup ? "Follow-Up" : "First Touch")+" — "+titleOf(company)+" — "+at.slice(0,10);
    const created = await notion(env,"POST","pages",{
      parent:{type:"data_source_id",data_source_id:env.NOTION_EVENTS_SOURCE},
      properties:{
        "Event":{title:[{text:{content:title.slice(0,1900)}}]},
        "Event Type":{select:{name:followup ? "Follow-Up":"First Touch"}},
        "Channel":{select:{name:"Email"}},
        "Direction":{select:{name:"Outbound"}},
        "Company":{relation:[{id:company.id}]},
        "Event Date":{date:{start:at}},
        "Provider Message ID":{rich_text:[{text:{content:id}}]},
        "Provider Thread ID":{rich_text:[{text:{content:msg.threadId}}]},
        "Provider URL":{url:"https://mail.google.com/mail/u/0/#all/"+id},
        "Notes":{rich_text:[{text:{content:"AUTONOMOUS WORKER CREATE | Gmail provider SENT "+id+
          " | timestamp "+at+" | no sending performed by this Worker."}}]}
      }
    });
    if(!created.id) throw new Error("Notion create response missing event id");
    rows = await lookupEvent(env,id);
  }
  if (rows.length !== 1) throw new Error("Event creation/readback not unique");
  const e = rows[0],p=e.properties||{};
  if (!p.Company?.relation?.some(r=>r.id===company.id))
    throw new Error("Event provider ID points to wrong Company");
  if (textOf(p,"Provider Thread ID") !== msg.threadId)
    throw new Error("Event thread mismatch for provider id");
  if (p.Direction?.select?.name!=="Outbound" ||
      p["Event Type"]?.select?.name!==(followup?"Follow-Up":"First Touch"))
    throw new Error("Event type/direction mismatch");
  const eventMs = Date.parse(p["Event Date"]?.date?.start||"");
  if (!Number.isFinite(eventMs) || Math.abs(eventMs-Number(msg.internalDate))>61_000)
    throw new Error("Event timestamp mismatch");
  return {state:"verified",event:e};
}
function titleOf(page) {
  const field = page.properties?.["Company Name"];
  return field?.title?.map(x=>x.plain_text||x.text?.content||"").join("")||"Company";
}
async function followupInThread(token,msg) {
  const thr = await gmail(token,"threads/"+encodeURIComponent(msg.threadId)+"?format=metadata");
  return (thr.messages||[]).some(x=>x.id!==msg.id &&
    x.labelIds?.includes("SENT") && Number(x.internalDate)<Number(msg.internalDate));
}
async function updateCompany(env,token,msg,company,followup) {
  const p=company.properties||{},old=p["Prospect Status"]?.select?.name||"";
  const last=Date.parse(p["Last Contact"]?.date?.start||"")||0,ts=Number(msg.internalDate);
  const patch={};
  const next=statusForSend(old,followup);
  if(next!==old) patch["Prospect Status"]={select:{name:next}};
  if(last+1000 < ts) patch["Last Contact"]={date:{start:new Date(ts).toISOString()}};
  const rel=p["Draft Release Status"]?.select?.name;
  const canonical=textOf(p,"Canonical Draft ID");
  if(rel==="APPROVED"&&canonical) {
    if(!shouldClearDraft(p)) throw new Error("Sent but canonical draft QA/approval IDs disagree. Needs manual review.");
    // 404 alone is NOT proof of the correct draft; prior approval + matching recipient,
    // vanished canonical draft, and a real SENT message are additional safeguards.
    if(!await gmailDraftMissing(token,canonical))
      throw new Error("Canonical Gmail draft still exists; hold Company release state for manual review.");
    patch["Draft Release Status"]={select:{name:"SENT"}};
    patch["Canonical Draft ID"]={rich_text:[]};
  } else if(rel==="HOLD" && canonical) {
    // A different HOLD draft can exist for a contacted Company; do not clear it.
  }
  // No fallback to SENT: provider evidence alone never lifts STOP, HOLD,
  // missing founder approval, or any other release restriction.
  if(env.WRITES_ENABLED!=="true") return {state:"dry_run"};
  const audit={
    qa:textOf(p,"QA Passed Message ID"),
    founder:textOf(p,"Founder Approved Message ID"),
    founderDraft:textOf(p,"Founder Approved Draft ID")
  };
  if(Object.keys(patch).length) await notion(env,"PATCH","pages/"+company.id,{properties:patch});
  const fresh=await notion(env,"GET","pages/"+company.id);
  const n=fresh.properties||{};
  if(textOf(n,"QA Passed Message ID")!==audit.qa||
    textOf(n,"Founder Approved Message ID")!==audit.founder||
    textOf(n,"Founder Approved Draft ID")!==audit.founderDraft)
    throw new Error("IMMUTABLE APPROVAL AUDIT CHANGED; investigate immediately");
  if(Date.parse(n["Last Contact"]?.date?.start||"") + 1000 < ts)
    throw new Error("Company Last Contact still older than Gmail SENT");
  if(!ADVANCED.has(n["Prospect Status"]?.select?.name) &&
    n["Prospect Status"]?.select?.name!==(followup?"Follow-Up":"Contacted"))
    throw new Error("Company Prospect Status not reconciled");
  if(patch["Canonical Draft ID"] &&
    (textOf(n,"Canonical Draft ID")||n["Draft Release Status"]?.select?.name!=="SENT"))
    throw new Error("Company canonical-draft/release readback failed");
  return {state:"verified",company:fresh};
}
async function discover(env,token) {
  let cursor,items=[],pages=0;
  do {
    const q="in:sent after:"+env.START_AFTER_UNIX;
    const u=new URLSearchParams({q,maxResults:String(PAGE_SIZE)});
    if(cursor) u.set("pageToken",cursor);
    const page=await gmail(token,"messages?"+u);
    items.push(...(page.messages||[]));
    cursor=page.nextPageToken;
    pages++;
    if(cursor && pages>=MAX_PAGES)
      throw new Error("Gmail SENT backlog exceeds "+(MAX_PAGES*PAGE_SIZE)+" messages; increase scan window/capacity before continuing.");
  }while(cursor);
  let inserted=0;
  for(const item of items) {
    const r=await env.DB.prepare("INSERT OR IGNORE INTO sync_messages (message_id,status,next_attempt_ms,created_ms,updated_ms) VALUES (?,'pending',0,?,?)")
      .bind(item.id,Date.now(),Date.now()).run();
    inserted+=r.meta?.changes||0;
  }
  return {discovered:items.length,newItems:inserted};
}
async function reconcile(env,token,row) {
  const msg=await gmail(token,"messages/"+encodeURIComponent(row.message_id)+"?format=metadata");
  if(!msg.labelIds?.includes("SENT") || Number(msg.internalDate)<Number(env.START_AFTER_UNIX)*SECOND)
    return {state:"ignored"};
  const headers=msg.payload?.headers||[];
  const from=normalizeEmail(header(headers,"From"));
  const toRaw=header(headers,"To");
  if(from!==normalizeEmail(env.GMAIL_ADDRESS) || !toRaw ||
      /[,;]/.test(toRaw.replace(/"[^"]*"/g,""))) return {state:"ignored"};
  const to=normalizeEmail(toRaw);
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return {state:"ignored"};
  const company=await matchCompany(env,to);
  if(!company) return {state:"ignored"};
  if(company.properties?.["Prospect Status"]?.select?.name==="Do Not Contact") {
    // Preserve DNC stage. Record provider truth, do not contact prospect again.
  }
  const followup=await followupInThread(token,msg);
  const event=await recordEvent(env,msg,company,followup);
  if(event.state==="dry_run") return {state:"dry_run",company:company.id};
  const change=await updateCompany(env,token,msg,company,followup);
  return {state:change.state,company:company.id,event:event.event.id};
}
async function mark(env,id,outcome,error) {
  if(error){
    const old=await env.DB.prepare("SELECT attempts FROM sync_messages WHERE message_id=?").bind(id).first();
    const attempts=(old?.attempts||0)+1;
    const delay=Math.min(6*3600,Math.pow(2,Math.min(attempts,8))*60)*SECOND;
    await env.DB.prepare("UPDATE sync_messages SET status='retry',attempts=?,next_attempt_ms=?,last_error=?,updated_ms=? WHERE message_id=?")
      .bind(attempts,Date.now()+delay,String(error.message||error).slice(0,650),Date.now(),id).run();
    return;
  }
  await env.DB.prepare("UPDATE sync_messages SET status=?,last_error=NULL,updated_ms=? WHERE message_id=?")
    .bind(outcome.state,Date.now(),id).run();
}
async function alert(env,message) {
  console.error(message);
  if(!env.ALERT_WEBHOOK_URL) return;
  try {
    await fetch(env.ALERT_WEBHOOK_URL,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({text:"Boundless CRM Sync: "+message})
    });
  }catch(e){console.error("Alert delivery failed (check webhook)");}
}
async function run(env) {
  required(env);
  const now=Date.now();
  // Atomic D1 lease prevents overlapping cron executions from racing Notion CREATE.
  await env.DB.prepare("INSERT OR IGNORE INTO sync_lock (id,lease_until) VALUES (1,0)").run();
  const lease=await env.DB.prepare("UPDATE sync_lock SET lease_until=? WHERE id=1 AND lease_until<?")
    .bind(now+4*60*SECOND,now).run();
  if(lease.meta?.changes!==1) return;
  try {
    const token=await gmailToken(env);
    const scan=await discover(env,token);
    const jobs=await env.DB.prepare("SELECT * FROM sync_messages WHERE status IN ('pending','retry','dry_run') AND next_attempt_ms<=? ORDER BY created_ms ASC LIMIT ?")
      .bind(Date.now(),MAX_JOBS).all();
    let done=0,ignored=0,failed=0,dry=0;
    for(const job of jobs.results||[]) {
      try {
        const result=await reconcile(env,token,job);
        await mark(env,job.message_id,result);
        if(result.state==="verified") done++;
        else if(result.state==="ignored") ignored++;
        else dry++;
      }catch(err){
        failed++;
        await mark(env,job.message_id,null,err);
        await alert(env,"provider "+job.message_id+": "+String(err.message||err).slice(0,250));
      }
    }
    console.log(JSON.stringify({system:"outbound-only",scanned:scan.discovered,new:scan.newItems,
      verified:done,ignored,dry_run:dry,failed,writes_enabled:env.WRITES_ENABLED==="true"}));
  }finally{
    await env.DB.prepare("UPDATE sync_lock SET lease_until=0 WHERE id=1").run();
  }
}
export default {
  async scheduled(_event,env,ctx) {
    ctx.waitUntil(run(env).catch(err=>alert(env,"scheduled fatal: "+String(err.message||err).slice(0,350))));
  }
};
