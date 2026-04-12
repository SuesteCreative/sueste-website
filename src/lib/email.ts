import { Resend } from 'resend';

const BASE_URL = 'https://www.suestecreative.com';
const LOGO_URL = `${BASE_URL}/images/logo-white-hor.webp`;
const BRAND_COLOR = '#38bdf8';
const DARK_BG = '#0f172a';

function getResend(): Resend | null {
    const key = import.meta.env.RESEND_API_KEY;
    if (!key) {
        console.warn('[email] RESEND_API_KEY not set — email not sent');
        return null;
    }
    return new Resend(key);
}

function getTargetEmail(): string {
    return import.meta.env.CONTACT_EMAIL || 'geral@suestecreative.com';
}

// ── Shared HTML wrapper ───────────────────────────────────────────────────────

function emailShell(bodyHtml: string): string {
    return `
<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
  <!-- Header -->
  <div style="background:${DARK_BG};padding:28px 32px;text-align:center;">
    <img src="${LOGO_URL}" alt="Sueste Creative" style="height:36px;display:inline-block;" />
  </div>

  <!-- Body -->
  <div style="padding:32px;">
    ${bodyHtml}
  </div>

  <!-- Footer -->
  <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="margin:0;font-size:13px;color:#94a3b8;">
      © ${new Date().getFullYear()} Sueste Creative &mdash; Algarve, Portugal<br/>
      <a href="${BASE_URL}" style="color:${BRAND_COLOR};text-decoration:none;">${BASE_URL}</a>
    </p>
  </div>
</div>`;
}

function row(label: string, value: string): string {
    return `<div style="margin-bottom:12px;font-size:15px;line-height:1.5;">
      <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">${label}</span><br/>
      <span style="color:#1e293b;font-weight:500;">${value || '—'}</span>
    </div>`;
}

function section(title: string, content: string): string {
    return `<div style="background:#f8fafc;border-radius:10px;padding:20px 24px;margin:20px 0;border-left:4px solid ${BRAND_COLOR};">
      <h3 style="margin:0 0 16px;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:${BRAND_COLOR};">${title}</h3>
      ${content}
    </div>`;
}

// ── Contact form notification ─────────────────────────────────────────────────

export async function sendContactNotification(data: {
    name: string;
    email: string;
    message: string;
}): Promise<{ ok: boolean; error?: string }> {
    const resend = getResend();
    const target = getTargetEmail();

    const html = emailShell(`
      <h2 style="margin:0 0 4px;font-size:22px;color:#1e293b;">Nova Mensagem de Contacto</h2>
      <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Recebida através do formulário em suestecreative.com</p>

      ${section('Remetente', `
        ${row('Nome', data.name)}
        ${row('Email', `<a href="mailto:${data.email}" style="color:${BRAND_COLOR};">${data.email}</a>`)}
      `)}

      ${section('Mensagem', `
        <p style="margin:0;font-size:15px;color:#334155;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
      `)}

      <div style="text-align:center;margin-top:28px;">
        <a href="mailto:${data.email}?subject=Re: Contacto Sueste Creative" style="display:inline-block;background:${BRAND_COLOR};color:#0f172a;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;">
          Responder a ${data.name.split(' ')[0]}
        </a>
      </div>
    `);

    if (!resend) return { ok: true }; // dev mode — no-op

    const { error } = await resend.emails.send({
        from: 'Sueste Website <website@suestecreative.com>',
        to: [target],
        reply_to: data.email,
        subject: `Nova mensagem de ${data.name}`,
        html,
    });

    if (error) {
        console.error('[email] sendContactNotification error:', error);
        return { ok: false, error: JSON.stringify(error) };
    }
    return { ok: true };
}

// ── Quote request notification ────────────────────────────────────────────────

export async function sendQuoteNotification(data: {
    name: string;
    email: string;
    company?: string;
    deadline?: string;
    message?: string;
    selections?: unknown;
    addons?: unknown;
    totalEstimated?: number;
    hasStartingAt?: boolean;
}): Promise<{ ok: boolean; error?: string }> {
    const resend = getResend();
    const target = getTargetEmail();

    const priceLabel = data.hasStartingAt
        ? `A partir de ${data.totalEstimated}€`
        : `${data.totalEstimated}€`;

    const selectionsText = data.selections
        ? JSON.stringify(data.selections, null, 2)
        : null;

    const addonsText = data.addons
        ? JSON.stringify(data.addons, null, 2)
        : null;

    const html = emailShell(`
      <h2 style="margin:0 0 4px;font-size:22px;color:#1e293b;">Novo Pedido de Orçamento</h2>
      <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Submetido através da calculadora em suestecreative.com</p>

      ${section('Cliente', `
        ${row('Nome', data.name)}
        ${row('Email', `<a href="mailto:${data.email}" style="color:${BRAND_COLOR};">${data.email}</a>`)}
        ${data.company ? row('Empresa', data.company) : ''}
        ${data.deadline ? row('Prazo', data.deadline) : ''}
      `)}

      <div style="background:${DARK_BG};border-radius:10px;padding:20px 24px;margin:20px 0;text-align:center;">
        <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;">Estimativa</p>
        <p style="margin:0;font-size:32px;font-weight:800;color:${BRAND_COLOR};">${priceLabel}</p>
        <p style="margin:6px 0 0;font-size:11px;color:#475569;font-style:italic;">Valores estimados — sujeitos a proposta formal</p>
      </div>

      ${selectionsText ? section('Serviços Selecionados', `<pre style="margin:0;font-size:12px;color:#334155;white-space:pre-wrap;overflow-x:auto;">${selectionsText}</pre>`) : ''}

      ${addonsText ? section('Add-ons', `<pre style="margin:0;font-size:12px;color:#334155;white-space:pre-wrap;overflow-x:auto;">${addonsText}</pre>`) : ''}

      ${data.message ? section('Mensagem / Notas', `<p style="margin:0;font-size:15px;color:#334155;line-height:1.7;white-space:pre-wrap;">${data.message}</p>`) : ''}

      <div style="text-align:center;margin-top:28px;">
        <a href="mailto:${data.email}?subject=Proposta Sueste Creative" style="display:inline-block;background:${BRAND_COLOR};color:#0f172a;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;">
          Enviar Proposta a ${data.name.split(' ')[0]}
        </a>
      </div>
    `);

    if (!resend) return { ok: true }; // dev mode — no-op

    const { error } = await resend.emails.send({
        from: 'Sueste Website <website@suestecreative.com>',
        to: [target],
        reply_to: data.email,
        subject: `Pedido de orçamento: ${data.name} — ${priceLabel}`,
        html,
    });

    if (error) {
        console.error('[email] sendQuoteNotification error:', error);
        return { ok: false, error: JSON.stringify(error) };
    }
    return { ok: true };
}
