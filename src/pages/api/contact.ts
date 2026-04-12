export const prerender = false;

import { sendContactNotification } from '../../lib/email';

export async function POST({ request }: { request: Request }) {
    try {
        const data = await request.json();

        if (data.honey) {
            return new Response(JSON.stringify({ success: false, error: 'Spam detected.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!data.name || !data.email || !data.message) {
            return new Response(JSON.stringify({ success: false, error: 'Campos obrigatórios em falta.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { ok } = await sendContactNotification({
            name: data.name,
            email: data.email,
            message: data.message,
        });

        if (!ok) {
            return new Response(JSON.stringify({ success: false, error: 'Erro ao enviar mensagem. Tente novamente.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Contact API Error:', error);
        return new Response(JSON.stringify({ success: false, error: 'Erro interno do servidor.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
