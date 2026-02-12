function buildEmailHtml(result) {
  const bodyAnalysis = result.report?.bodyAnalysis;
  const commonTips = result.report?.commonTips || [];
  const casual = result.report?.casual;
  const rainy = result.report?.rainy;
  const location = result.location;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;background:#1a1a2e;color:#e0e0e0;">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#A67C52,#C4956A);padding:28px 24px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:22px;">Your AI Style Analysis</h1>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">by K-Culture Cat</p>
  </div>

  <div style="padding:24px;">
    ${location ? `
    <!-- Location -->
    <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 18px;margin-bottom:24px;text-align:center;">
      <strong style="color:#e8c07a;font-size:15px;">${location.country}</strong>
      ${location.climate ? `<br><span style="color:#aaa;font-size:13px;">${location.climate}</span>` : ''}
    </div>` : ''}

    ${bodyAnalysis ? `
    <!-- Body Analysis -->
    <h2 style="color:#e8c07a;font-size:18px;margin:0 0 14px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">Your Style Profile</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;margin-bottom:6px;">
        <strong style="color:#e8c07a;font-size:13px;">Body Proportions</strong><br>
        <span style="color:#ccc;font-size:13px;line-height:1.5;">${bodyAnalysis.summary}</span>
      </td></tr>
      <tr><td style="height:6px;"></td></tr>
      <tr><td style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;">
        <strong style="color:#e8c07a;font-size:13px;">Color Palette</strong><br>
        <span style="color:#ccc;font-size:13px;line-height:1.5;">${bodyAnalysis.skinTone}</span>
      </td></tr>
      <tr><td style="height:6px;"></td></tr>
      <tr><td style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;">
        <strong style="color:#e8c07a;font-size:13px;">Ideal Silhouette</strong><br>
        <span style="color:#ccc;font-size:13px;line-height:1.5;">${bodyAnalysis.silhouette}</span>
      </td></tr>
      <tr><td style="height:6px;"></td></tr>
      <tr><td style="padding:8px 12px;background:rgba(255,100,100,0.08);border:1px solid rgba(255,100,100,0.2);border-radius:8px;">
        <strong style="color:#ff8a8a;font-size:13px;">What to Avoid</strong><br>
        <span style="color:#ccc;font-size:13px;line-height:1.5;">${bodyAnalysis.avoid}</span>
      </td></tr>
    </table>` : ''}

    ${commonTips.length > 0 ? `
    <!-- Common Tips -->
    <h2 style="color:#e8c07a;font-size:18px;margin:0 0 14px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">General Styling Guide</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${commonTips.map((tip, i) => `
      <tr><td style="padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:8px;">
        <span style="display:inline-block;background:linear-gradient(135deg,#8b6914,#c49b3c);color:#fff;font-weight:700;font-size:11px;width:20px;height:20px;line-height:20px;text-align:center;border-radius:50%;margin-right:8px;vertical-align:middle;">${i + 1}</span>
        <span style="color:#ccc;font-size:13px;line-height:1.5;">${tip}</span>
      </td></tr>
      <tr><td style="height:6px;"></td></tr>`).join('')}
    </table>` : ''}

    <!-- Outfit Recommendations -->
    <h2 style="color:#e8c07a;font-size:18px;margin:0 0 14px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">Outfit Recommendations</h2>

    ${casual ? `
    <!-- Casual -->
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;margin-bottom:16px;">
      <div style="background:rgba(255,255,255,0.06);padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">
        <span style="font-size:15px;">&#x1F455;</span>
        <strong style="color:#e8c07a;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;margin-left:6px;">Casual</strong>
      </div>
      <div style="padding:14px;">
        <img src="cid:casual-outfit" alt="Casual outfit" style="width:100%;border-radius:8px;margin-bottom:12px;" />
        <h3 style="color:#fff;font-size:15px;margin:0 0 6px;">${casual.title}</h3>
        <p style="color:#ccc;font-size:13px;line-height:1.6;margin:0 0 8px;">${casual.description}</p>
        ${casual.tip ? `<p style="color:#c49b3c;font-size:12px;line-height:1.5;background:rgba(196,155,60,0.1);padding:8px 10px;border-radius:6px;border-left:3px solid #c49b3c;margin:0;">&#x1F4A1; <strong>Tip:</strong> ${casual.tip}</p>` : ''}
      </div>
    </div>` : ''}

    ${rainy ? `
    <!-- Rainy -->
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;margin-bottom:16px;">
      <div style="background:rgba(255,255,255,0.06);padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);">
        <span style="font-size:15px;">&#x1F327;</span>
        <strong style="color:#e8c07a;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;margin-left:6px;">Rainy Day</strong>
      </div>
      <div style="padding:14px;">
        <img src="cid:rainy-outfit" alt="Rainy day outfit" style="width:100%;border-radius:8px;margin-bottom:12px;" />
        <h3 style="color:#fff;font-size:15px;margin:0 0 6px;">${rainy.title}</h3>
        <p style="color:#ccc;font-size:13px;line-height:1.6;margin:0 0 8px;">${rainy.description}</p>
        ${rainy.tip ? `<p style="color:#c49b3c;font-size:12px;line-height:1.5;background:rgba(196,155,60,0.1);padding:8px 10px;border-radius:6px;border-left:3px solid #c49b3c;margin:0;">&#x1F4A1; <strong>Tip:</strong> ${rainy.tip}</p>` : ''}
      </div>
    </div>` : ''}

    <!-- Hairstyle -->
    <h2 style="color:#e8c07a;font-size:18px;margin:24px 0 14px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">Trending Korean Hairstyles</h2>
    <div style="text-align:center;">
      <img src="cid:hairstyle-grid" alt="Korean hairstyle recommendations" style="width:100%;max-width:500px;border-radius:12px;" />
    </div>
  </div>

  <!-- Footer -->
  <div style="background:rgba(255,255,255,0.03);padding:20px 24px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
    <p style="margin:0;color:#777;font-size:12px;">K-Culture Cat &mdash; kculturecat.cc</p>
  </div>
</div>
</body>
</html>`;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email, result } = await request.json();

    if (!email || !result) {
      return new Response(JSON.stringify({ error: 'Missing email or result' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const html = buildEmailHtml(result);

    // Build attachments with CID for inline images
    const attachments = [];

    if (result.images?.casual) {
      attachments.push({
        content: result.images.casual.data,
        filename: 'casual-outfit.png',
        content_id: 'casual-outfit',
      });
    }

    if (result.images?.rainy) {
      attachments.push({
        content: result.images.rainy.data,
        filename: 'rainy-outfit.png',
        content_id: 'rainy-outfit',
      });
    }

    if (result.hairstyle) {
      attachments.push({
        content: result.hairstyle.data,
        filename: 'hairstyle-grid.png',
        content_id: 'hairstyle-grid',
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'K-Culture Cat <noreply@kculturecat.cc>',
        to: [email],
        subject: 'Your AI Style Analysis Report',
        html,
        attachments,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Resend API error: ${res.status}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
