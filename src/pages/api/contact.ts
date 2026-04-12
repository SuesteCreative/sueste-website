export const prerender = false; // SSR endpoint

export async function POST({ request }) {
    try {
        const data = await request.json();

        // Honeypot anti-spam check
        if (data.honey) {
            return new Response(JSON.stringify({ success: false, error: 'Spam detected.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            return new Response(JSON.stringify({ success: false, error: 'Campos obrigatórios em falta.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const targetEmail = import.meta.env.CONTACT_EMAIL || 'info@sueste-creative.pt';
        const resendApiKey = import.meta.env.RESEND_API_KEY;

        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #0f172a;">Nova Mensagem de Contacto</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Mensagem:</strong></p>
        <p style="background: #f5f5f5; padding: 1rem; border-radius: 8px; line-height: 1.6;">${data.message}</p>
        <hr />
        <p style="font-size: 12px; color: #666;">Enviado através do formulário de contacto em sueste-creative.pt</p>
      </div>
    `;

        if (resendApiKey) {
            const res = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`
                },
                body: JSON.stringify({
                    from: 'Sueste Website <website@sueste-creative.pt>',
                    to: [targetEmail],
                    reply_to: data.email,
                    subject: `Nova mensagem de ${data.name}`,
                    html: htmlContent
                })
            });

            if (!res.ok) {
                console.error('Resend Error:', await res.text());
                return new Response(JSON.stringify({ success: false, error: 'Erro ao enviar mensagem. Tente novamente.' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else {
            console.log('Contact form submission (no API key):', { name: data.name, email: data.email, message: data.message });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Contact API Error:', error);
        return new Response(JSON.stringify({ success: false, error: 'Erro interno do servidor.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
