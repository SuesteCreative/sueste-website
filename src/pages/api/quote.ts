export const prerender = false; // SSR endpoint

export async function POST({ request, clientAddress }) {
    try {
        const data = await request.json();

        // 1. Validate Honeypot
        if (data.honey) {
            return new Response(JSON.stringify({ success: false, error: 'Spam detected.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Validate Required Fields
        if (!data.name || !data.email) {
            return new Response(JSON.stringify({ success: false, error: 'Missing required fields.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 3. Rate limiting (Basic implementation using IP, in a real CF Worker we would use Rate Limiting or KV)
        // Here we skip strict KV rate limiting for brevity, but assume clientAddress check.

        // 4. Build Email
        const targetEmail = import.meta.env.CONTACT_EMAIL || 'geral@suestecreative.com';
        const resendApiKey = import.meta.env.RESEND_API_KEY;

        let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #0f172a;">Novo Pedido de Orçamento</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Empresa:</strong> ${data.company || 'N/A'}</p>
        <p><strong>Prazo:</strong> ${data.deadline || 'N/A'}</p>
        <p><strong>Mensagem:</strong> ${data.message || 'N/A'}</p>
        <hr />
        <h3>Resumo do Pedido</h3>
        <ul>
    `;

        if (data.selections) {
            htmlContent += `<li><strong>Serviços Principais:</strong> (Veja JSON no anexo/logs para detalhes: ${JSON.stringify(data.selections)})</li>`;
        }
        if (data.addons) {
            htmlContent += `<li><strong>Add-ons:</strong> ${JSON.stringify(data.addons)}</li>`;
        }

        htmlContent += `
        </ul>
        <h3>Estimativa</h3>
        <p style="font-size: 24px; font-weight: bold; color: #38bdf8;">
          ${data.hasStartingAt ? 'A partir de ' : ''}${data.totalEstimated}€
        </p>
        <p style="font-size: 12px; color: #666;">
          <em>Nota Legal: Os valores apresentados são estimativas baseadas na informação fornecida. O valor final pode variar.</em>
        </p>
      </div>
    `;

        // 5. Send Email
        if (resendApiKey) {
            const resList = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${resendApiKey}`
                },
                body: JSON.stringify({
                    from: 'Sueste Website <website@suestecreative.com>',
                    to: [targetEmail],
                    subject: `Novo pedido de orçamento: ${data.name}`,
                    html: htmlContent
                })
            });

            if (!resList.ok) {
                console.error('Resend Error:', await resList.text());
                // Even if email fails, we send success to user or a soft error.
                return new Response(JSON.stringify({ success: false, error: 'Failed to send email via provider.' }), {
                    status: 500
                });
            }
        } else {
            console.log("Simulating email send (No API KEY):", htmlContent);
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Quote API Error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
