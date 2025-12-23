import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ApplicationEmailPayload {
  applicant_email: string;
  applicant_phone: string;
  applicant_relationship: string;
  beneficiary_age: number;
  beneficiary_location: string;
  beneficiary_phone?: string;
  assistance_type: string;
  situation_description: string;
  financial_status: string;
  urgent: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: ApplicationEmailPayload = await req.json();

    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const smtpFrom = Deno.env.get("SMTP_FROM_EMAIL") || "info@tigmaminds.org";
    const smtpTo = Deno.env.get("SMTP_TO_EMAIL") || "info@tigmaminds.org";

    if (!smtpUser || !smtpPassword) {
      console.error("SMTP credentials not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const urgentFlag = payload.urgent ? "[URGENT] " : "";
    const emailContent = `
${urgentFlag}New Beneficiary Application
============================

APPLICANT INFORMATION:
Email: ${payload.applicant_email}
Phone: ${payload.applicant_phone}
Relationship to Beneficiary: ${payload.applicant_relationship}

BENEFICIARY INFORMATION:
Age: ${payload.beneficiary_age}
Location: ${payload.beneficiary_location}
Phone: ${payload.beneficiary_phone || "Not provided"}

ASSISTANCE DETAILS:
Type: ${payload.assistance_type}
Urgent: ${payload.urgent ? "YES" : "No"}

Situation Description:
${payload.situation_description}

Financial Status:
${payload.financial_status}

---
Submitted via TigmaMinds Foundation website
    `.trim();

    const conn = await Deno.connect({
      hostname: smtpHost,
      port: smtpPort,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const buffer = new Uint8Array(1024);

    await conn.read(buffer);

    await conn.write(encoder.encode(`EHLO ${smtpHost}\r\n`));
    await conn.read(buffer);

    await conn.write(encoder.encode("STARTTLS\r\n"));
    await conn.read(buffer);

    const tlsConn = await Deno.startTls(conn, { hostname: smtpHost });

    await tlsConn.write(encoder.encode(`EHLO ${smtpHost}\r\n`));
    await tlsConn.read(buffer);

    await tlsConn.write(encoder.encode("AUTH LOGIN\r\n"));
    await tlsConn.read(buffer);

    await tlsConn.write(
      encoder.encode(btoa(smtpUser) + "\r\n")
    );
    await tlsConn.read(buffer);

    await tlsConn.write(
      encoder.encode(btoa(smtpPassword) + "\r\n")
    );
    await tlsConn.read(buffer);

    await tlsConn.write(encoder.encode(`MAIL FROM:<${smtpFrom}>\r\n`));
    await tlsConn.read(buffer);

    await tlsConn.write(encoder.encode(`RCPT TO:<${smtpTo}>\r\n`));
    await tlsConn.read(buffer);

    await tlsConn.write(encoder.encode("DATA\r\n"));
    await tlsConn.read(buffer);

    const subject = `${urgentFlag}Beneficiary Application - ${payload.assistance_type}`;
    const emailMessage = [
      `From: ${smtpFrom}`,
      `To: ${smtpTo}`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset=utf-8`,
      "",
      emailContent,
      ".",
    ].join("\r\n");

    await tlsConn.write(encoder.encode(emailMessage + "\r\n"));
    await tlsConn.read(buffer);

    await tlsConn.write(encoder.encode("QUIT\r\n"));
    await tlsConn.read(buffer);

    tlsConn.close();

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});