export const prerender = false;

import { sendQuoteNotification } from '../../lib/email';

export async function POST({ request }: { request: Request }) {
    try {
        const data = await request.json();

        if (data.honey) {
            return new Response(JSON.stringify({ success: false, error: 'Spam detected.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!data.name || !data.email) {
            return new Response(JSON.stringify({ success: false, error: 'Missing required fields.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { ok } = await sendQuoteNotification({
            name: data.name,
            email: data.email,
            company: data.company,
            deadline: data.deadline,
            message: data.message,
            selections: data.selections,
            addons: data.addons,
            totalEstimated: data.totalEstimated,
            hasStartingAt: data.hasStartingAt,
            travelAddress: data.travelAddress,
            travelKm: data.travelKm,
            travelFee: data.travelFee,
        });

        if (!ok) {
            return new Response(JSON.stringify({ success: false, error: 'Failed to send email via provider.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Quote API Error:', error);
        return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
