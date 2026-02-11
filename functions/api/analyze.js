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

  return `You are a professional fashion stylist. Based on the person's info and location/season, recommend 2 outfit styles. Respond in English only.

Person: ${genderText}, ${userInfo.height}cm, ${userInfo.weight}kg, ${bodyDesc}
Country: ${userInfo.country} (current month: ${month} ${year})

Determine the climate from the country and month. Respond in valid JSON only, no markdown:

{"climate":"brief climate description for this country and month","casual":{"title":"5-7 word title","description":"3-4 sentence outfit description with top, bottom, shoes, accessories","tip":"one styling tip"},"rainy":{"title":"5-7 word title","description":"3-4 sentence outfit description for rainy weather","tip":"one styling tip"}}`;
}

function buildImagePrompt(gender, bodyType, description) {
  const bodyMap = { muscular: 'athletic', slim: 'slim', average: 'average', chubby: 'plus-size' };
  const body = bodyMap[bodyType] || 'average';
  return `Generate a full-body fashion photo of the person in the reference image wearing this outfit: ${description}. Keep the person's face, skin tone, hair, and features exactly the same as the reference photo. ${gender}, ${body} build. Full body shot from head to toe, ensure the entire body including head and feet is fully visible within the frame. Clean studio background, professional fashion photography. No text or watermarks.`;
}

function buildHairstylePrompt(gender) {
  const genderText = gender === 'male' ? 'male' : 'female';
  return `Create a 3x3 grid image showing 9 different trendy Korean hairstyles applied to the person in the reference photo. Each cell in the grid shows the same person's face with a different popular Korean ${genderText} hairstyle from 2025-2026. Keep the person's face, skin tone, and facial features exactly the same in all 9 cells. Only change the hairstyle in each cell. Include a variety of styles: short, medium, long, with bangs, without bangs, layered, permed, straight, and textured styles popular in Korea. IMPORTANT: Each cell must show the complete face from the top of the hair to below the chin with generous padding above the head and below the chin. Make the face slightly smaller within each cell to ensure nothing is cropped. Leave at least 15% margin on all sides of each cell. Clean white background for each cell. Professional salon photography style. No text, labels, or watermarks.`;
}

async function callOpenAIText(prompt, apiKey) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
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

  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI image error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  const imageData = data.data?.[0]?.b64_json;
  if (!imageData) return null;

  return { mimeType: 'image/png', data: imageData };
}

const POLAR_API_BASE = 'https://sandbox-api.polar.sh/v1';

async function verifyCheckout(checkoutId, polarToken) {
  const res = await fetch(`${POLAR_API_BASE}/checkouts/${checkoutId}`, {
    headers: { Authorization: `Bearer ${polarToken}` },
  });
  if (!res.ok) throw new Error(`Checkout verification failed: ${res.status}`);
  const data = await res.json();
  if (data.status !== 'succeeded') {
    throw new Error(`Payment not completed (status: ${data.status})`);
  }
  return data.order_id;
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
    orderId = await verifyCheckout(checkoutId, polarToken);

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
      location: { country, climate: report.climate || '' },
      report: {
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
    // Auto-refund if payment was verified but analysis failed
    if (orderId && polarToken) {
      await refundOrder(orderId, polarToken);
    }

    return new Response(JSON.stringify({
      error: err.message,
      refunded: !!orderId,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
