/**
 * Cute NLP & Matching Engine with Groq (Free & Ultra Fast), Gemini, OpenRouter & OpenAI
 * Includes transparent error reporting and strict token matching.
 */

function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !['de', 'la', 'el', 'en', 'y', 'a', 'los', 'las', 'un', 'una', 'por', 'con', 'para', 'es', 'son', 'al', 'que', 'me', 'tu', 'te', 'se'].includes(w));
}

function computeTokenScore(queryTokens, targetText) {
  if (!targetText || queryTokens.length === 0) return 0;
  const targetTokens = tokenize(targetText);
  if (targetTokens.length === 0) return 0;

  let matches = 0;
  for (const q of queryTokens) {
    if (targetTokens.some(t => {
      // Exact word match
      if (t === q) return true;
      // Stem / prefix match only for longer words (4+ chars) to avoid false positives with 2-letter tokens like "ia"
      if (q.length >= 4 && (t.startsWith(q) || q.startsWith(t))) return true;
      return false;
    })) {
      matches += 1;
    }
  }

  return matches / queryTokens.length;
}

/**
 * Searches the Excel knowledge base & inventory catalog for the best matching answer
 */
export function findBestMatch(userMessage, knowledgeBase, config) {
  const cleanInput = userMessage.trim().toLowerCase();
  const normalized = cleanInput.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Social greetings
  const greetings = ['hola', 'holi', 'holis', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'hello'];
  if (greetings.some(g => normalized === g || normalized.startsWith(g + ' ') || normalized.endsWith(' ' + g))) {
    return {
      type: 'greeting',
      source: 'local',
      answer: `¡Holi hermosa! 💖 Soy **${config.botName || 'Mila'}**, tu asesora y asistente virtual en **${config.companyName || 'la boutique'}** 🌸. ¿En qué te consiento hoy? Puedes preguntar por nuestro catálogo de ropa, bolsos, skincare, bebidas rosa o dudas sobre envíos y pagos ✨`,
      matchedItem: null,
      score: 1.0
    };
  }

  // 2. Gratitude
  const thanks = ['gracias', 'muchas gracias', 'mil gracias', 'te agradezco', 'muy amable', 'thanks', 'ty'];
  if (thanks.some(t => normalized.includes(t))) {
    return {
      type: 'thanks',
      source: 'local',
      answer: `¡De nada bella! 💕 Es un placer atenderte. Si quieres ver más productos de nuestro catálogo o tienes otra duda, ¡aquí estoy siempre para ti! 🎀✨`,
      matchedItem: null,
      score: 1.0
    };
  }

  // 3. AI / Bot identity questions (e.g. "usas ia?", "eres ia?", "que modelo usas?", "eres un robot?")
  const aiIdentityKeywords = ['usas ia', 'eres ia', 'tienes ia', 'eres una ia', 'eres robot', 'que modelo usas', 'inteligencia artificial', 'quien te creo', 'como funcionas'];
  if (aiIdentityKeywords.some(ak => normalized.includes(ak))) {
    const isAiConfigured = config.apiProvider && config.apiProvider !== 'none' && config.apiKey && config.apiKey.trim().length > 0;
    const aiDetails = isAiConfigured
      ? `Estoy conectada a **${config.apiProvider.toUpperCase()}** con el modelo **${config.model || 'Llama 3.3'}** 🚀.`
      : `Actualmente estoy en **Modo Local Inteligente** leyendo tu base de Excel. Puedes activar Groq o Gemini en el Panel Admin para darme superpoderes generativos ✨.`;

    return {
      type: 'ai_identity',
      source: 'local',
      answer: `✨ ¡Sí bella! Cuento con Inteligencia Artificial especializada en atención al cliente y ventas de **${config.companyName || 'nuestra empresa'}** 💕.\n\n${aiDetails}\n\nTengo en memoria todo el catálogo de productos, precios, envíos y políticas. ¿Qué producto o duda te gustaría consultar hoy? 🌸🎀`,
      matchedItem: null,
      score: 1.0
    };
  }

  // 4. General Catalog Inquiry
  const catalogKeywords = ['catalogo', 'que venden', 'que tienen', 'productos', 'inventario', 'menu', 'que puedo comprar', 'que vendes'];
  if (catalogKeywords.some(ck => normalized.includes(ck))) {
    const categories = [...new Set(knowledgeBase.map(i => i.category))];
    const topProducts = knowledgeBase
      .filter(i => i.category.toLowerCase().includes('catálogo') || i.category.toLowerCase().includes('catalogo'))
      .slice(0, 5)
      .map(i => `• ${i.question.replace('¿Cuánto cuesta el ', '').replace('¿Tienen ', '').replace('¿Qué precio tiene ', '').replace('?', '')}`)
      .join('\n');

    return {
      type: 'catalog_summary',
      source: 'local',
      answer: `🌸 **¡Bienvenida a nuestro Catálogo de ${config.companyName}!** 🛍️✨\n\nTenemos colecciones hermosas en:\n${categories.map(c => `• ${c}`).join('\n')}\n\n**Algunos de nuestros favoritos disponibles hoy**:\n${topProducts}\n\n¿Te gustaría saber el precio o detalles de alguno en específico? 💖`,
      matchedItem: null,
      score: 1.0
    };
  }

  // 5. Strict Token-based Knowledge Base & Inventory Match
  const queryTokens = tokenize(userMessage);
  let bestItem = null;
  let highestScore = 0;

  for (const item of knowledgeBase) {
    const qScore = computeTokenScore(queryTokens, item.question) * 1.6;
    const kwScore = computeTokenScore(queryTokens, item.keywords || '') * 1.3;
    const aScore = computeTokenScore(queryTokens, item.answer) * 0.4;

    const subBonus = normalized.length > 4 && item.question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalized) ? 1.0 : 0;
    const totalScore = Math.max(qScore, kwScore) + aScore + subBonus;

    if (totalScore > highestScore) {
      highestScore = totalScore;
      bestItem = item;
    }
  }

  // Requiere un umbral estricto (0.55) para evitar emparejamientos erróneos
  if (bestItem && highestScore >= 0.55) {
    return {
      type: 'knowledge',
      source: 'local',
      answer: bestItem.answer,
      matchedItem: bestItem,
      score: highestScore
    };
  }

  // 6. Fallback response amigable
  const fallback = config.fallbackMessage || 
    `¡Ay reina! 🌸 Aún no encuentro ese producto o información exacta en mi libretita rosa 📝💕. ¿Te gustaría consultar otro artículo de nuestro catálogo (vestidos, bolsos, café, skincare) o escribir a una asesora humana por WhatsApp al **+52 55 1234-5678**? ✨`;

  return {
    type: 'fallback',
    source: 'local',
    answer: fallback,
    matchedItem: null,
    score: highestScore
  };
}

/**
 * Fetches the active models available to this specific Groq API key
 */
export async function fetchGroqModels(key) {
  if (!key || !key.trim()) return [];
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${key.trim()}`
      }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || [])
      .map(m => m.id)
      .filter(id => !id.includes('whisper') && !id.includes('guard')); // only text/chat models
  } catch {
    return [];
  }
}

/**
 * Tests connection to configured AI Provider and returns latency or error
 */
export async function testAIConnection(config) {
  const provider = config.apiProvider;
  const key = config.apiKey ? config.apiKey.trim() : '';

  if (!key || provider === 'none') {
    return { success: false, error: 'No se ha configurado ninguna API Key o el proveedor está en Modo Local.' };
  }

  const startTime = performance.now();

  try {
    if (provider === 'groq') {
      // 1. Check account model access
      const availableModels = await fetchGroqModels(key);
      let targetModel = config.model;

      if (availableModels.length > 0) {
        // If configured model is not in available models, pick first available
        if (!targetModel || !availableModels.includes(targetModel)) {
          targetModel = availableModels.find(m => m.includes('llama') || m.includes('qwen') || m.includes('gpt')) || availableModels[0];
        }
      } else {
        targetModel = targetModel || 'llama-3.1-8b-instant';
      }

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [{ role: 'user', content: 'Di solo: ¡Conexión exitosa!' }],
          max_tokens: 20
        })
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        const errMsg = errorJson.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        return { success: false, error: errMsg, availableModels };
      }

      const data = await res.json();
      const latency = Math.round(performance.now() - startTime);
      return {
        success: true,
        latencyMs: latency,
        model: targetModel,
        availableModels: availableModels.length > 0 ? availableModels : [targetModel],
        reply: data.choices?.[0]?.message?.content || '¡Conexión exitosa!'
      };
    }

    if (provider === 'gemini') {
      const model = config.model || 'gemini-1.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Di solo: ¡Conexión exitosa!' }] }]
        })
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        return { success: false, error: errorJson.error?.message || `HTTP ${res.status}: ${res.statusText}` };
      }

      const latency = Math.round(performance.now() - startTime);
      return { success: true, latencyMs: latency, model: model };
    }

    if (provider === 'openrouter') {
      const model = config.model || 'meta-llama/llama-3.1-8b-instruct:free';
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Di solo: ¡Conexión exitosa!' }],
          max_tokens: 20
        })
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        return { success: false, error: errorJson.error?.message || `HTTP ${res.status}: ${res.statusText}` };
      }

      const latency = Math.round(performance.now() - startTime);
      return { success: true, latencyMs: latency, model: model };
    }

    if (provider === 'openai') {
      const model = config.model || 'gpt-4o-mini';
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: 'Di solo: ¡Conexión exitosa!' }],
          max_tokens: 20
        })
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        return { success: false, error: errorJson.error?.message || `HTTP ${res.status}: ${res.statusText}` };
      }

      const latency = Math.round(performance.now() - startTime);
      return { success: true, latencyMs: latency, model: model };
    }

    return { success: false, error: 'Proveedor no reconocido.' };
  } catch (err) {
    return { success: false, error: err.message || 'Error de red al conectar.' };
  }
}

/**
 * Main query function: Calls external AI LLM with RAG Excel context.
 * If external AI fails, notifies user explicitly with details rather than guessing random items.
 */
export async function queryAIWithContext(userMessage, knowledgeBase, config) {
  // If in local mode or without key, use local matcher
  if (!config.apiKey || !config.apiKey.trim() || config.apiProvider === 'none') {
    return findBestMatch(userMessage, knowledgeBase, config);
  }

  const key = config.apiKey.trim();
  const provider = config.apiProvider;

  const contextData = knowledgeBase.map((k, i) => 
    `[REGISTRO #${i+1}] Categoría: ${k.category}\nPregunta/Producto: ${k.question}\nRespuesta/Detalle: ${k.answer}\nPalabras clave: ${k.keywords}`
  ).join('\n---\n');

  const systemPrompt = `Eres ${config.botName || 'Mila'}, la asesora virtual de ventas y atención al cliente corporativa de "${config.companyName || 'Boutique & Café Rosé'}".
Tu personalidad es ultra cute, dulce, educada, chic, estética y profesional. Usas emojis lindos (🌸, 💖, ✨, 🎀, 🛍️, 🍰, 🧁) de forma natural y elegante.

Tienes acceso completo al siguiente Catálogo de Inventario y Base de Conocimientos extraído del archivo Excel de la empresa:
=== INICIO DE BASE DE DATOS EXCEL ===
${contextData}
=== FIN DE BASE DE DATOS EXCEL ===

INSTRUCCIONES CLAVE:
1. Responde preguntas sobre precios, tallas, stock, envíos, métodos de pago y recomendaciones basándote en la información anterior.
2. Si preguntan por precios de productos, da el precio exacto en MXN y menciona detalles bonitos o disponibilidad.
3. Si el usuario te saluda o pregunta quién eres o si usas IA, responde amablemente y confirma que eres una IA dulce con acceso al catálogo.
4. Si algo NO está en la base de datos, sé muy amable y recomienda consultar a una asesora humana al WhatsApp oficial (+52 55 1234-5678).
5. Mantén las respuestas visualmente atractivas con viñetas y formato limpio.`;

  try {
    // 1. GROQ
    if (provider === 'groq') {
      let model = config.model || 'llama-3.1-8b-instant';
      if (!model || model.includes('70b') || model === 'llama-3.3-70b-versatile') {
        model = 'llama-3.1-8b-instant';
      }
      let res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.6,
          max_tokens: 650
        })
      });

      // Auto-recovery if model is not recognized on account
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        const msg = errorJson.error?.message || `HTTP ${res.status}: ${res.statusText}`;

        if (msg.includes('does not exist') || msg.includes('do not have access')) {
          const avail = await fetchGroqModels(key);
          if (avail.length > 0) {
            const fallbackModel = avail.find(m => m.includes('llama') || m.includes('qwen') || m.includes('gpt')) || avail[0];
            const retryRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
              },
              body: JSON.stringify({
                model: fallbackModel,
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: userMessage }
                ],
                temperature: 0.6,
                max_tokens: 650
              })
            });

            if (retryRes.ok) {
              const retryData = await retryRes.json();
              const text = retryData.choices?.[0]?.message?.content;
              if (text) {
                return { type: 'ai_groq', source: 'groq', modelUsed: fallbackModel, answer: text, score: 1.0 };
              }
            }
          }
        }
        throw new Error(msg);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) {
        return { type: 'ai_groq', source: 'groq', modelUsed: model, answer: text, score: 1.0 };
      }
    }

    // 2. OPENROUTER
    else if (provider === 'openrouter') {
      const model = config.model || 'meta-llama/llama-3.1-8b-instruct:free';
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Cute Bot'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7
        })
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) {
        return { type: 'ai_openrouter', source: 'openrouter', answer: text, score: 1.0 };
      }
    }

    // 3. GEMINI
    else if (provider === 'gemini') {
      const model = config.model || 'gemini-1.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nPregunta del cliente: ${userMessage}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600
          }
        })
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return { type: 'ai_gemini', source: 'gemini', answer: text, score: 1.0 };
      }
    }

    // 4. OPENAI
    else if (provider === 'openai') {
      const model = config.model || 'gpt-4o-mini';
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7
        })
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error?.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) {
        return { type: 'ai_openai', source: 'openai', answer: text, score: 1.0 };
      }
    }
  } catch (err) {
    console.error('Error al invocar API de IA:', err);
    // Transmit transparent error message to the user instead of silent random fallback
    return {
      type: 'ai_error',
      source: 'error',
      isError: true,
      errorDetails: err.message,
      answer: `⚠️ **Aviso de Conexión IA (${provider.toUpperCase()})**:\nHubo un problema al contactar el servicio de IA:\n> *"${err.message}"*\n\n✨ **Solución rápida**:\n1. Ve a **Panel Admin & Excel** > pestaña **4. Conexión IA**.\n2. Verifica que tu API key esté completa (ej. \`gsk_...\` para Groq) y el proveedor sea el correcto.\n3. Presiona el botón **"Probar Conexión con IA"** para diagnosticarla en tiempo real 💕.`,
      score: 1.0
    };
  }

  return findBestMatch(userMessage, knowledgeBase, config);
}
