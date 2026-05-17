import type { APIRoute } from 'astro';
import { Resend } from 'resend';

interface EmailRequestBody {
  name: string;
  email: string;
  phone?: string;
  business?: string;
  message?: string;
  source?: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Get API key from environment
    const apiKey = locals?.runtime?.env?.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    
    console.log('API Key present:', !!apiKey);
    
    if (!apiKey) {
      console.error('Missing RESEND_API_KEY');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service not configured' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(apiKey);
    
    // Parse request body
    const body = await request.json() as EmailRequestBody;
    const { name, email, phone, business, message, source } = body;

    console.log('Received form data:', { name, email, phone, business, source });

    // Validate required fields
    if (!name || !email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Name and email are required' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send email to business owner
    console.log('Attempting to send email via Resend...');
    const { data, error } = await resend.emails.send({
      from: 'Boundless Leads <noreply@boundlesscorp.ca>',
      to: ['jason@boundlesscorp.ca'],
      replyTo: email,
      subject: `New Lead from ${name} - ${source || 'Website'}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: 'Inter', -apple-system, sans-serif; line-height: 1.6; color: #35271c; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #a28b6d 0%, #c4935a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .header h1 { color: #f5ede0; margin: 0; font-size: 24px; font-weight: 800; }
              .content { background: #f5ede0; padding: 30px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: 600; color: #7a6552; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; margin-bottom: 5px; }
              .value { font-size: 16px; color: #35271c; }
              .cta { 
                display: inline-block; 
                background: #a28b6d; 
                color: #f5ede0; 
                padding: 12px 24px; 
                text-decoration: none; 
                border-radius: 6px; 
                margin-top: 20px;
                font-weight: 600;
              }
              .footer { text-align: center; margin-top: 20px; color: #7a6552; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎯 New Lead Alert</h1>
              </div>
              <div class="content">
                <p style="font-size: 18px; margin-top: 0;">You have a new lead from <strong>${source || 'your website'}</strong>!</p>
                
                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${name}</div>
                </div>
                
                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${email}" style="color: #a28b6d;">${email}</a></div>
                </div>
                
                ${phone ? `
                  <div class="field">
                    <div class="label">Phone</div>
                    <div class="value"><a href="tel:${phone}" style="color: #a28b6d;">${phone}</a></div>
                  </div>
                ` : ''}
                
                ${business ? `
                  <div class="field">
                    <div class="label">Business</div>
                    <div class="value">${business}</div>
                  </div>
                ` : ''}
                
                ${message ? `
                  <div class="field">
                    <div class="label">Message</div>
                    <div class="value">${message}</div>
                  </div>
                ` : ''}
                
                <a href="mailto:${email}" class="cta">Reply to ${name} →</a>
                
                <div class="footer">
                  <p>This lead was submitted from your Boundless website.<br>
                  Reply within 5 minutes for best conversion rates!</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send email',
          details: error.message || 'Unknown error'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email sent successfully:', data);

    // Optionally send auto-responder to lead
    if (email) {
      console.log('Sending auto-responder to:', email);
      await resend.emails.send({
        from: 'Boundless <noreply@boundlesscorp.ca>',
        to: [email],
        subject: "Thanks for reaching out! We'll be in touch soon.",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Inter', -apple-system, sans-serif; line-height: 1.6; color: #35271c; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #a28b6d 0%, #c4935a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .header h1 { color: #f5ede0; margin: 0; font-size: 24px; font-weight: 800; }
                .content { background: #f5ede0; padding: 30px; border-radius: 0 0 8px 8px; }
                .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #7a6552; color: #7a6552; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thanks for Reaching Out!</h1>
                </div>
                <div class="content">
                  <p>Hi ${name},</p>
                  
                  <p>Thanks for your interest in Boundless! We're excited to help you transform your business with our proven lead generation and automation systems.</p>
                  
                  <p><strong>What happens next?</strong></p>
                  <ul>
                    <li>We'll review your information and respond within 2 hours (usually faster!)</li>
                    <li>We'll schedule a free 15-minute strategy call to discuss your goals</li>
                    <li>We'll show you exactly how we can help you get more qualified leads</li>
                  </ul>
                  
                  <p>In the meantime, feel free to reach out if you have any questions:</p>
                  <p>📧 <a href="mailto:jason@boundlesscorp.ca" style="color: #a28b6d;">jason@boundlesscorp.ca</a><br>
                  📍 #807, 789 Drake Street, Vancouver, BC V6Z 2N7</p>
                  
                  <div class="footer">
                    <p><strong>Boundless</strong> — Where Ideas Create Impact<br>
                    Performance-driven client acquisition systems for local service businesses.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: data?.id 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Email API error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};




