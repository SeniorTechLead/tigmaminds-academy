import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: ContactEmailPayload = await req.json();

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

    const emailContent = `
New Contact Form Submission
============================

Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone || "Not provided"}
Subject: ${payload.subject}

Message:
${payload.message}

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

    const emailMessage = [
      `From: ${smtpFrom}`,
      `To: ${smtpTo}`,
      `Subject: ${payload.subject}`,
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