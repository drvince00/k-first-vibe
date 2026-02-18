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

  return `You are an expert fashion stylist and personal image consultant with deep knowledge in facial morphology, optical skin harmony theory, and personal color analysis. Analyze the provided photo and person's info to deliver a scientifically grounded style consultation. Respond in English only.

## Person Info
- Gender: ${genderText}, ${userInfo.height}cm, ${userInfo.weight}kg, ${bodyDesc}
- Country: ${userInfo.country} (current month: ${month} ${year})

## Analysis Instructions

### 1. Face Shape Analysis (from photo)
Analyze the person's facial proportions using the Facial Index (FI) framework:
- FI = (Morphological Facial Height / Bizygomatic Width) × 100
- Classify into: Oval, Round, Square, Oblong, Heart, or Diamond
- Note key geometric features (forehead-to-jaw width ratio, jawline angles)

### 2. Skin Undertone & Personal Color (from photo)
Analyze the skin's optical properties:
- Determine undertone: Warm (golden/yellow/peach base from carotene/pheomelanin) or Cool (pink/blue base from hemoglobin)
- Classify into seasonal type: Spring (Warm+Bright), Summer (Cool+Soft), Autumn (Warm+Muted), Winter (Cool+Vivid)
- Recommend a specific color palette based on the seasonal type

### 3. Hairstyle Correction Principles
Based on face shape, determine:
- Where to add/reduce volume (top, sides) to approach the ideal oval proportion
- Recommended parting ratio and bang style
- Styles to avoid for this face shape

### 4. Neckline Optimization
Apply the "opposing element principle":
- Round face → V-neck/square neck (add vertical lines)
- Square face → U-neck/round neck/scoop neck (add curves to soften angles)
- Oblong face → boat neck/high neck (add horizontal lines)
- Heart face → round neck/off-shoulder (balance narrow chin)

### 5. Fabric Texture Recommendations
Consider surface roughness (Ra) and optical reflectance:
- Spring/Winter (vivid types) → smooth fabrics (silk, satin) that maintain color clarity
- Summer/Autumn (muted types) → textured fabrics (wool, linen, tweed) that diffuse light softly

Respond in valid JSON only, no markdown:

{"climate":"brief climate description","faceAnalysis":{"shape":"one of: Oval, Round, Square, Oblong, Heart, Diamond","description":"2-3 sentences explaining the geometric features observed - forehead width, cheekbone prominence, jawline shape, and face length-to-width ratio","correctionGoal":"1-2 sentences on what visual correction is needed to approach oval balance"},"personalColor":{"undertone":"Warm or Cool","season":"Spring, Summer, Autumn, or Winter","description":"2-3 sentences explaining the skin's optical characteristics observed and why this season type was determined","palette":["6 specific recommended colors, e.g. Coral, Dusty Rose, Olive Green"],"avoidColors":["3 colors to avoid"]},"bodyAnalysis":{"summary":"2-3 sentence overview of body proportions and how to dress to flatter them","silhouette":"1-2 sentences on ideal silhouette and fit style","neckline":"recommended neckline type and why it suits this face shape","fabricTexture":"1-2 sentences on ideal fabric textures based on personal color season","avoid":"1 sentence on styles or fits to avoid"},"commonTips":["5 styling tips that integrate face shape correction, personal color, neckline, and body type - each 1-2 sentences"],"casual":{"title":"5-7 word title","description":"3-4 sentence outfit description specifying neckline, fabric texture, colors from personal palette, top, bottom, shoes, accessories","tip":"one styling tip"},"rainy":{"title":"5-7 word title","description":"3-4 sentence outfit description for rainy weather with appropriate fabrics and colors","tip":"one styling tip"}}`;
}

function buildImagePrompt(gender, bodyType, description) {
  const bodyMap = { muscular: 'athletic', slim: 'slim', average: 'average', chubby: 'plus-size' };
  const body = bodyMap[bodyType] || 'average';
  return `Generate a full-body fashion photo of the person in the reference image wearing this outfit: ${description}. Keep the person's face, skin tone, hair, and features exactly the same as the reference photo. ${gender}, ${body} build. Full body shot from head to toe, ensure the entire body including head and feet is fully visible within the frame. Clean studio background, professional fashion photography. No text or watermarks.`;
}

function buildHairstylePrompt(gender, faceShape, correctionGoal) {
  const genderText = gender === 'male' ? 'male' : 'female';
  const faceGuide = faceShape && correctionGoal
    ? ` This person has a ${faceShape} face shape. Styling goal: ${correctionGoal} Prioritize hairstyles that achieve this correction - for example, adding top volume for round/square faces, adding side volume for oblong faces, or chin-length waves for heart-shaped faces.`
    : '';
  return `Create a 3x3 grid showing 9 trendy Korean ${genderText} hairstyles on the person from the reference photo.${faceGuide} Keep face and features identical in all 9 cells. Each cell must be framed as a HEAD AND SHOULDERS portrait shot - show from MID-CHEST up to well ABOVE the top of the hair. The camera should be zoomed OUT so that the face is small (about 25% of cell height) and the HAIR is the main focus. There must be large empty space above the hair in every cell - no hair should touch or be cropped by the top edge. Similarly, show down to the shoulders/chest - no chin should be cropped at the bottom. Think of it as a zoomed-out salon catalog photo. Variety: short, medium, long, bangs, no bangs, layered, permed, straight, textured. Clean white background. No text or watermarks.`;
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

async function callOpenAIText(prompt, apiKey, photoBase64, photoMimeType) {
  const content = [];
  if (photoBase64 && photoMimeType) {
    content.push({
      type: 'image_url',
      image_url: { url: `data:${photoMimeType};base64,${photoBase64}`, detail: 'low' },
    });
  }
  content.push({ type: 'text', text: prompt });

  const res = await fetchWithRetry('https://gateway.ai.cloudflare.com/v1/1b9d390db4dbabd680f186ddd291afcb/openai-proxy/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content }],
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
  const res = await fetchWithRetry('https://gateway.ai.cloudflare.com/v1/1b9d390db4dbabd680f186ddd291afcb/openai-proxy/openai/images/edits', fetchOpts, 1);

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

    // Step 1: Get text recommendations (with photo for face/skin analysis)
    const prompt = buildTextPrompt(userInfo);
    const report = await callOpenAIText(prompt, apiKey, photo, mime);

    // Step 2: Generate images in parallel (casual outfit, rainy outfit, hairstyle grid)
    const casualDesc = report.casual?.description || '';
    const rainyDesc = report.rainy?.description || '';
    const faceShape = report.faceAnalysis?.shape || '';
    const correctionGoal = report.faceAnalysis?.correctionGoal || '';

    const [casualImage, rainyImage, hairstyleImage] = await Promise.all([
      callOpenAIImage(buildImagePrompt(gender, bt, casualDesc), photo, mime, apiKey, '1024x1536'),
      callOpenAIImage(buildImagePrompt(gender, bt, rainyDesc), photo, mime, apiKey, '1024x1536'),
      callOpenAIImage(buildHairstylePrompt(gender, faceShape, correctionGoal), photo, mime, apiKey, '1024x1024'),
    ]);

    return new Response(JSON.stringify({
      customerEmail,
      location: { country, climate: report.climate || '' },
      report: {
        faceAnalysis: report.faceAnalysis,
        personalColor: report.personalColor,
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
