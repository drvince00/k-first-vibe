function buildTextPrompt(userInfo) {
  const genderText = userInfo.gender === 'male' ? 'male' : 'female';
  const bodyTypeMap = {
    muscular: 'muscular/athletic build',
    slim: 'slim/lean build',
    average: 'average build',
    chubby: 'chubby/plus-size build',
  };
  const bodyDesc = bodyTypeMap[userInfo.bodyType] || 'average build';

  const now = new Date();
  const month = now.toLocaleString('en', { month: 'long' });
  const year = now.getFullYear();

  return `You are a professional fashion stylist and personal image consultant. Based on the person's info and location/season, provide a detailed style analysis. Respond in English only.

Person: ${genderText}, ${userInfo.height}cm, ${userInfo.weight}kg, ${bodyDesc}
Country: ${userInfo.country} (current month: ${month} ${year})

Determine the climate from the country and month. Respond in valid JSON only, no markdown:

{"climate":"brief climate description for this country and month","bodyAnalysis":{"summary":"2-3 sentence overview of this person's body proportions and how to dress to flatter them (e.g. slim build benefits from layering to add visual volume, taller frame can pull off oversized fits, etc.)","skinTone":"1-2 sentence recommendation on colors that complement typical skin tones for their region/ethnicity","silhouette":"1-2 sentences on ideal silhouette and fit style for their body type","avoid":"1 sentence on what styles or fits to avoid"},"commonTips":["5 universal styling tips personalized to this person's body type and proportions, each tip is 1-2 sentences"],"casual":{"title":"5-7 word title","description":"3-4 sentence outfit description with top, bottom, shoes, accessories","tip":"one styling tip"},"rainy":{"title":"5-7 word title","description":"3-4 sentence outfit description for rainy weather","tip":"one styling tip"}}`;
}

function buildImagePrompt(gender, bodyType, description) {
  const bodyMap = { muscular: 'athletic', slim: 'slim', average: 'average', chubby: 'plus-size' };
  const body = bodyMap[bodyType] || 'average';
  return `Generate a full-body fashion photo of the person in the reference image wearing this outfit: ${description}. Keep the person's face, skin tone, hair, and features exactly the same as the reference photo. ${gender}, ${body} build. Full body shot from head to toe, ensure the entire body including head and feet is fully visible within the frame. Clean studio background, professional fashion photography. No text or watermarks.`;
}

function buildHairstylePrompt(gender) {
  const genderText = gender === 'male' ? 'male' : 'female';
  return `Create a 3x3 grid showing 9 trendy Korean ${genderText} hairstyles on the person from the reference photo. Keep face and features identical in all 9 cells. Each cell must be framed as a HEAD AND SHOULDERS portrait shot - show from MID-CHEST up to well ABOVE the top of the hair. The camera should be zoomed OUT so that the face is small (about 25% of cell height) and the HAIR is the main focus. There must be large empty space above the hair in every cell - no hair should touch or be cropped by the top edge. Similarly, show down to the shoulders/chest - no chin should be cropped at the bottom. Think of it as a zoomed-out salon catalog photo. Variety: short, medium, long, bangs, no bangs, layered, permed, straight, textured. Clean white background. No text or watermarks.`;
}

function isQuotaError(status) {
  return status === 402 || status === 429;
}

function isRetryableError(status, body) {
  if (status === 429) return true;
  if (status === 500 || status === 502 || status === 503) return true;
  if (status === 403 && body?.includes('unsupported_country_region_territory')) return true;
  return false;
}

async function fetchWithRetry(url, options, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options);
    if (res.ok) return res;

    const body = await res.text();

    if (attempt < maxRetries && isRetryableError(res.status, body)) {
      const delay = (attempt + 1) * 2000;
      await new Promise(r => setTimeout(r, delay));
      continue;
    }

    // Return a fake Response with the body we already consumed
    return new Response(body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  }
}

async function notifyOperator(resendKey, errorDetail) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'K-Culture Cat Alert <noreply@kculturecat.cc>',
        to: ['kculturecat@gmail.com'],
        subject: '[URGENT] K-Culture Cat - OpenAI API Credit Exhausted',
        html: `<h2>OpenAI API Credit Alert</h2>
<p><strong>Time:</strong> ${new Date().toISOString()}</p>
<p><strong>Error:</strong> ${errorDetail}</p>
<p>The AI Stylist service has been automatically paused. Please recharge your OpenAI API credits immediately.</p>
<p><a href="https://platform.openai.com/settings/organization/billing">Go to OpenAI Billing</a></p>`,
      }),
    });
  } catch (e) {
    console.error('Failed to send operator alert:', e.message);
  }
}

async function callOpenAIText(prompt, apiKey) {
  const res = await fetchWithRetry('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    if (isQuotaError(res.status)) {
      throw Object.assign(new Error(`QUOTA_EXHAUSTED: ${res.status} - ${err}`), { quotaError: true });
    }
    throw new Error(`OpenAI text error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse style recommendations');
  return JSON.parse(jsonMatch[0]);
}

async function callOpenAIImage(prompt, photoBase64, photoMimeType, apiKey, size = '1024x1536') {
  const binaryStr = atob(photoBase64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  const ext = photoMimeType.includes('png') ? 'png' : 'jpg';
  const blob = new Blob([bytes], { type: photoMimeType });

  const formData = new FormData();
  formData.append('model', 'gpt-image-1');
  formData.append('image[]', blob, `photo.${ext}`);
  formData.append('prompt', prompt);
  formData.append('n', '1');
  formData.append('size', size);
  formData.append('quality', 'medium');

  const fetchOpts = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  };
  // Image API: only retry once (large payload)
  const res = await fetchWithRetry('https://api.openai.com/v1/images/edits', fetchOpts, 1);

  if (!res.ok) {
    const err = await res.text();
    if (isQuotaError(res.status)) {
      throw Object.assign(new Error(`QUOTA_EXHAUSTED: ${res.status} - ${err}`), { quotaError: true });
    }
    throw new Error(`OpenAI image error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  const imageData = data.data?.[0]?.b64_json;
  if (!imageData) return null;

  return { mimeType: 'image/png', data: imageData };
}

const POLAR_API_BASE = 'https://api.polar.sh/v1';

async function verifyCheckout(checkoutId, polarToken) {
  const res = await fetch(`${POLAR_API_BASE}/checkouts/${checkoutId}`, {
    headers: { Authorization: `Bearer ${polarToken}` },
  });
  if (!res.ok) throw new Error(`Checkout verification failed: ${res.status}`);
  const data = await res.json();
  if (data.status !== 'succeeded' && data.status !== 'confirmed') {
    throw new Error(`Payment not completed (status: ${data.status})`);
  }
  return { orderId: data.order_id, customerEmail: data.customer_email || null };
}

async function refundOrder(orderId, polarToken) {
  const res = await fetch(`${POLAR_API_BASE}/refunds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${polarToken}`,
    },
    body: JSON.stringify({
      order_id: orderId,
      reason: 'service_not_rendered',
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`Refund failed for order ${orderId}: ${err}`);
    return false;
  }
  return true;
}

async function notifyRefundFailure(resendKey, orderId, originalError) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'K-Culture Cat Alert <noreply@kculturecat.cc>',
        to: ['kculturecat@gmail.com'],
        subject: '[URGENT] Refund Failed - Manual Action Required',
        html: `<h2>Refund Failed Alert</h2>
<p><strong>Time:</strong> ${new Date().toISOString()}</p>
<p><strong>Order ID:</strong> ${orderId}</p>
<p><strong>Original Error:</strong> ${originalError}</p>
<p>The automatic refund failed. Please process this refund manually in the <a href="https://polar.sh/kculturecat/orders">Polar Dashboard</a>.</p>`,
      }),
    });
  } catch (e) {
    console.error('Failed to send refund failure alert:', e.message);
  }
}

export async function onRequestPost(context) {
  const polarToken = context.env.POLAR_ACCESS_TOKEN;
  let orderId = null;

  try {
    const body = await context.request.json();
    const { photo, photoMimeType, height, weight, gender, country, bodyType, checkoutId } = body;

    if (!photo || !height || !weight || !gender || !country) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Step 0: Verify payment
    if (!checkoutId) {
      return new Response(JSON.stringify({ error: 'Missing checkout ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const verified = await verifyCheckout(checkoutId, polarToken);
    orderId = verified.orderId;
    const customerEmail = verified.customerEmail;

    const apiKey = context.env.OPENAI_API_KEY;
    const userInfo = { height, weight, gender, country, bodyType: bodyType || 'average' };
    const mime = photoMimeType || 'image/jpeg';
    const bt = bodyType || 'average';

    // Step 1: Get text recommendations
    const prompt = buildTextPrompt(userInfo);
    const report = await callOpenAIText(prompt, apiKey);

    // Step 2: Generate images in parallel (casual outfit, rainy outfit, hairstyle grid)
    const casualDesc = report.casual?.description || '';
    const rainyDesc = report.rainy?.description || '';

    const [casualImage, rainyImage, hairstyleImage] = await Promise.all([
      callOpenAIImage(buildImagePrompt(gender, bt, casualDesc), photo, mime, apiKey, '1024x1536'),
      callOpenAIImage(buildImagePrompt(gender, bt, rainyDesc), photo, mime, apiKey, '1024x1536'),
      callOpenAIImage(buildHairstylePrompt(gender), photo, mime, apiKey, '1024x1024'),
    ]);

    return new Response(JSON.stringify({
      customerEmail,
      location: { country, climate: report.climate || '' },
      report: {
        bodyAnalysis: report.bodyAnalysis,
        commonTips: report.commonTips,
        casual: report.casual,
        rainy: report.rainy,
      },
      images: {
        casual: casualImage,
        rainy: rainyImage,
      },
      hairstyle: hairstyleImage,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    let refunded = false;

    // Auto-refund if payment was verified but analysis failed
    if (orderId && polarToken) {
      refunded = await refundOrder(orderId, polarToken);

      // If refund failed, urgently notify operator for manual refund
      if (!refunded && context.env.RESEND_API_KEY) {
        await notifyRefundFailure(context.env.RESEND_API_KEY, orderId, err.message);
      }
    }

    // Notify operator if OpenAI quota exhausted
    if (err.quotaError && context.env.RESEND_API_KEY) {
      await notifyOperator(context.env.RESEND_API_KEY, err.message);
    }

    return new Response(JSON.stringify({
      error: err.message,
      refunded,
      refundFailed: !!orderId && !refunded,
      serviceUnavailable: !!err.quotaError,
    }), {
      status: err.quotaError ? 503 : 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
