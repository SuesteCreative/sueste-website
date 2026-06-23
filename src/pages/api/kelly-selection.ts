export const prerender = false;

import { sendKellySelectionNotification } from '../../lib/email';

const EARLY_BIRD_DEADLINE = new Date('2026-07-01T23:59:59+01:00').getTime();

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

        const isEarlyBird = Date.now() <= EARLY_BIRD_DEADLINE;

        const { ok } = await sendKellySelectionNotification({
            name: data.name,
            email: data.email,
            advancedCrm: !!data.advancedCrm,
            blogTier: data.blogTier || 'none',
            brandbook: !!data.brandbook,
            notes: data.notes,
            refSite1: data.refSite1,
            refSite2: data.refSite2,
            refSite3: data.refSite3,
            isEarlyBird,
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
        console.error('Kelly Selection API Error:', error);
        return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
