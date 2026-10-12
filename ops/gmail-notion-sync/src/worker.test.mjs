import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEmail, header, statusForSend, shouldClearDraft } from "./worker.mjs";

const rt=x=>({rich_text:[{plain_text:x}]}), sel=x=>({select:{name:x}});
test("recipient address is normalized without dropping email",()=>{
  assert.equal(normalizeEmail("Jason Valchar <JASON@BoundlessCorp.ca>"),"jason@boundlesscorp.ca");
  assert.equal(normalizeEmail("Info@CombinedPainting.com"),"info@combinedpainting.com");
});
test("Gmail RFC headers are looked up case insensitively",()=>{
  assert.equal(header([{name:"tO",value:"person@example.com"}],"To"),"person@example.com");
});
test("preserves DNC and advanced Company states",()=>{
  assert.equal(statusForSend("Do Not Contact",false),"Do Not Contact");
  assert.equal(statusForSend("Responded",true),"Responded");
  assert.equal(statusForSend("Researched",false),"Contacted");
  assert.equal(statusForSend("Contacted",true),"Follow-Up");
});
test("only eligible approved live-version drafts can be cleared",()=>{
  const p={
    "Canonical Draft ID":rt("r123"),"Founder Approved Draft ID":rt("r123"),
    "Founder Approved Message ID":rt("m123"),"QA Passed Message ID":rt("m123"),
    "Draft Release Status":sel("APPROVED")
  };
  assert.equal(shouldClearDraft(p),true);
  assert.equal(shouldClearDraft({...p,"Founder Approved Message ID":rt("changed")}),false);
  assert.equal(shouldClearDraft({...p,"Draft Release Status":sel("HOLD")}),false);
});
