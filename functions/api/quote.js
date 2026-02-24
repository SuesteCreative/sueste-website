export async function onRequestPost({ request, env }) {
    try {
        const data = await request.json();

        // Honeypot check
        if (data.honey) {
            return new Response(JSON.stringify({ success: true, message: "Spam detected" }), { status: 200 });
        }

        // Basic validation
        if (!data.email || !data.name) {
            return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), { status: 400 });
        }

        // In a real scenario, we would use a service like Resend, Mailgun, or SendGrid
        // and use env variables for API keys.
        // For now, we simulate the email sending logic.

        console.log("Form submission received:", data);

        // Dynamic email content based on data
        const emailBody = `
      New Quote Request from ${data.name} (${data.email})
      
      Services: ${JSON.stringify(data.selections, null, 2)}
      Total Estimated: ${data.total}€
      
      Message: ${data.message || 'No message'}
    `;

        // Example of using an env variable for the target email
        const recipient = env.CONTACT_EMAIL || "pedro@sueste.creative";

        // If there was an email provider:
        // await sendEmail(recipient, "New Quote Request", emailBody, env.EMAIL_API_KEY);

        return new Response(JSON.stringify({
            success: true,
            message: "Orçamento enviado com sucesso! Entraremos em contacto em breve."
        }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
    }
}
