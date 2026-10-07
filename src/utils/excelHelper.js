import * as XLSX from 'xlsx';

// Super Expanded initial dataset with full Inventory Catalog & Company FAQ
export const DEFAULT_KNOWLEDGE_BASE = [
  // ================= CATÁLOGO DE INVENTARIO: ROPA & MODA =================
  {
    id: 'inv-1',
    category: '👗 Catálogo: Ropa & Moda',
    question: '¿Cuánto cuesta el Vestido Coquette Rosa Pastel y qué tallas tienen?',
    answer: '🌸 **Vestido Coquette Rosa Pastel**: Confeccionado en tela satín suave con detalles de encaje y lazo en la espalda.\n• **Precio**: $599 MXN\n• **Tallas disponibles**: XS, S, M, L\n• **Stock**: 15 piezas disponibles en boutique.\n¡Es ideal para eventos especiales o citas bonitas! 🎀✨',
    keywords: 'vestido coquette, vestido rosa, ropa, vestidos, precio vestido, comprar vestido, tallas'
  },
  {
    id: 'inv-2',
    category: '👗 Catálogo: Ropa & Moda',
    question: '¿Tienen la Blusa Romántica con Mangas Abullonadas?',
    answer: '✨ **Blusa Romántica Manga Abullonada**: Cuello corazón, tela transpirable color perla y rosa suave.\n• **Precio**: $389 MXN\n• **Tallas**: S, M, L\n• **Stock**: 20 piezas listas para entrega inmediata 💕',
    keywords: 'blusa, blusa romantica, mangas abullonadas, top, blusas, precio blusa'
  },
  {
    id: 'inv-3',
    category: '👗 Catálogo: Ropa & Moda',
    question: '¿Qué precio tiene la Falda Tablones Pastel Lilac?',
    answer: '💜 **Falda Tablones Pastel Lilac**: Falda estilo preppy tenis con short interior para máxima comodidad.\n• **Precio**: $420 MXN\n• **Tallas**: S, M, L\n• **Stock**: 12 piezas disponibles 🌸',
    keywords: 'falda, falda tablones, falda lila, faldas, precio falda'
  },
  {
    id: 'inv-4',
    category: '👗 Catálogo: Ropa & Moda',
    question: '¿Cuánto cuesta el Cardigan Oversize Tejido Nube Rosa?',
    answer: '☁️ **Cardigan Oversize Nube Rosa**: Tejido súper calientito y esponjoso con botones en forma de corazón perlado.\n• **Precio**: $650 MXN\n• **Tallas**: Unitalla (queda perfecto de XS a XL)\n• **Stock**: 8 piezas restantes (¡uno de nuestros más vendidos!) 💖',
    keywords: 'cardigan, sueter, abrigo, oversize, tejido, precio cardigan'
  },
  {
    id: 'inv-5',
    category: '👗 Catálogo: Ropa & Moda',
    question: '¿Tienen pijamas de satín y cuánto cuestan?',
    answer: '🍓 **Pijama Silk Strawberry Pink**: Conjunto de 2 piezas (camisa manga corta + short) con estampado de fresitas.\n• **Precio**: $480 MXN\n• **Tallas**: S, M, L\n• **Stock**: 18 piezas 🎀💤',
    keywords: 'pijama, pijamas, satin, pijama fresas, seda, dormir'
  },

  // ================= CATÁLOGO: BOLSOS & ACCESORIOS =================
  {
    id: 'inv-6',
    category: '👜 Catálogo: Bolsos & Accesorios',
    question: '¿Qué precio tiene el Bolso Corazón Acolchado?',
    answer: '💖 **Bolso Corazón Acolchado con Cadena Dorada**: Cuero vegano premium, interior forrado con bolsillo para labial.\n• **Precio**: $450 MXN\n• **Colores**: Rosa Pastel, Blanco Nube, Lila Pastel\n• **Stock**: 14 piezas en tienda 🎀🛍️',
    keywords: 'bolso, bolsa, bolso corazon, cartera, bolso acolchado, colores bolso'
  },
  {
    id: 'inv-7',
    category: '👜 Catálogo: Bolsos & Accesorios',
    question: '¿Tienen la Mini Mochila Kawaii Velvet?',
    answer: '🎒 **Mini Mochila Kawaii Velvet**: Acabado terciopelo suave con cierre metálico de moño y colgante pompón.\n• **Precio**: $520 MXN\n• **Color**: Rosa Bebé\n• **Stock**: 9 piezas disponibles ✨',
    keywords: 'mochila, mini mochila, kawaii, velvet, terciopelo, bolsa escolar'
  },
  {
    id: 'inv-8',
    category: '👜 Catálogo: Bolsos & Accesorios',
    question: '¿Cuánto cuesta el Set de Broches y Moños Coquette?',
    answer: '🎀 **Set Moños Coquette (Pack de 3 piezas)**: Diseños con lazo de satín, perlas y clips antideslizantes.\n• **Precio**: $120 MXN el set\n• **Stock**: 40 sets disponibles en rosa, marfil y negro 💕',
    keywords: 'monos, broches, accesorios cabello, coquette clips, set monos'
  },
  {
    id: 'inv-9',
    category: '👜 Catálogo: Bolsos & Accesorios',
    question: '¿Venden termos o botellas para agua cute?',
    answer: '🌸 **Termo Cute Acero Inoxidable (500ml)**: Mantiene bebidas frías por 24 horas y calientes por 12 horas. Incluye popote de silicona y stickers kawaii.\n• **Precio**: $299 MXN\n• **Stock**: 30 piezas disponibles 🍓🥤',
    keywords: 'termo, botella agua, vaso, termo rosa, acero inoxidable'
  },

  // ================= CATÁLOGO: SNEAKERS & CALZADO =================
  {
    id: 'inv-10',
    category: '👟 Catálogo: Calzado & Sneakers',
    question: '¿Qué tenis o zapatillas tienen y qué precio tienen?',
    answer: '👟 **Sneakers Pastel Chunky Platform**: Zapatillas urbanas ultra ligeras con acentos en rosa pastel y suela ortopédica cómoda.\n• **Precio**: $890 MXN\n• **Números disponibles**: 23, 23.5, 24, 24.5, 25, 26 MX\n• **Stock**: 11 pares disponibles ✨🌸',
    keywords: 'tenis, sneakers, calzado, zapatillas, zapatos, plataforma, tallas tenis'
  },

  // ================= CATÁLOGO: SKINCARE & BELLEZA =================
  {
    id: 'inv-11',
    category: '💄 Catálogo: Belleza & Skincare',
    question: '¿Cuánto cuesta el Serum Hidratante Sakura Glow?',
    answer: '🌸 **Serum Facial Sakura Glow (50ml)**: Formulado con extracto de flor de cerezo y 5 pesos de Ácido Hialurónico. Vegano y libre de crueldad animal.\n• **Precio**: $320 MXN\n• **Beneficio**: Piel luminosa, efecto cristal y súper hidratada.\n• **Stock**: 22 frascos disponibles 💖✨',
    keywords: 'serum, sakura glow, skincare, suero facial, acido hialuronico, piel de porcelana'
  },
  {
    id: 'inv-12',
    category: '💄 Catálogo: Belleza & Skincare',
    question: '¿Tienen bálsamos labiales o mascarillas para labios?',
    answer: '💋 **Mascarilla Labial Berry Kiss (20g)**: Tratamiento nocturno regenerador con manteca de karité y vitamina E.\n• **Precio**: $140 MXN\n• **Stock**: 35 piezas disponibles (aroma a frambuesa deliciosa) 🍓',
    keywords: 'labial, mascarilla labios, balsamo, berry kiss, hidratante labios'
  },
  {
    id: 'inv-13',
    category: '💄 Catálogo: Belleza & Skincare',
    question: '¿Qué perfume o body mist tienen disponible?',
    answer: '🍬 **Sweet Cotton Candy Body & Hair Mist (100ml)**: Fragancia ligera para cabello y cuerpo con notas de algodón de azúcar, vainilla y peonías.\n• **Precio**: $340 MXN\n• **Stock**: 19 piezas disponibles 🎀✨',
    keywords: 'perfume, fragancia, body mist, spray cabello, aroma dulce, cotton candy'
  },

  // ================= CATÁLOGO: CAFETERÍA & DELICIAS ROSA =================
  {
    id: 'inv-14',
    category: '☕ Catálogo: Cafetería & Postres',
    question: '¿Qué bebidas rosa tienen en la cafetería y cuánto cuestan?',
    answer: '☕ **Menú de Bebidas Rosa en Boutique Café**:\n• **Pink Velvet Latte** (con glitter comestible): $75 MXN\n• **Strawberry Matcha Iced**: $85 MXN\n• **Boba Tea Rosa Refrescante**: $80 MXN\n• Opciones de leche: Entera, Deslactosada, Avena, Almendra (+ $12 MXN) 🌸✨',
    keywords: 'cafe, latte, bebidas, pink velvet latte, matcha, boba tea, menu cafeteria, precio cafe'
  },
  {
    id: 'inv-15',
    category: '☕ Catálogo: Cafetería & Postres',
    question: '¿Venden postres o macarrones?',
    answer: '🧁 **Postres Artesanales Horneados Diario**:\n• **Macaron Box (Caja 6 piezas)**: $150 MXN (Sabores: frambuesa, vainilla, pistache, fresa)\n• **Croissant de Crema de Rosas y Fresa**: $65 MXN\n• **Cupcake Coquette con Perlas**: $45 MXN 🍰💖',
    keywords: 'postres, macarrones, macarons, cupcakes, pasteles, croissant, comida'
  },

  // ================= INFORMACIÓN CORPORATIVA & ENVÍOS =================
  {
    id: 'faq-1',
    category: '📍 Horarios y Tienda',
    question: '¿Cuáles son sus horarios de atención en tienda física?',
    answer: '✨ **Nuestros Horarios de Atención**:\n• **Lunes a Sábado**: 9:00 AM a 8:00 PM\n• **Domingos**: 11:00 AM a 6:00 PM\n¡Ven a visitarnos y disfruta una bebida rosa mientras ves la colección! 💖🌸',
    keywords: 'horario, hora, abierto, abrir, atencion, dias, cuando abren'
  },
  {
    id: 'faq-2',
    category: '📍 Horarios y Tienda',
    question: '¿Dónde está ubicada la tienda física?',
    answer: '📍 **Nuestra Dirección**:\nAv. Las Rosas #452, Col. Jardines del Bosque (Plaza Primavera, Local 12).\n🚗 Contamos con estacionamiento gratuito de 2 horas para clientes de la boutique y café. 🌸',
    keywords: 'donde estan, direccion, ubicacion, mapa, como llegar, sucursal, tienda'
  },
  {
    id: 'faq-3',
    category: '📦 Envíos y Entregas',
    question: '¿Cuánto cuesta el envío y cuándo es gratis?',
    answer: '✈️ **Opciones de Envío**:\n• **Envío Express Nacional (2-4 días)**: $99 MXN\n• **Envío Mismo Día (Local CDMX/GDL/MTY)**: $69 MXN\n• 🎁 **¡ENVÍO GRATIS!**: En todas tus compras a partir de **$899 MXN**.\nEmpacamos cada pedido en nuestra caja rosa perfumada con stickers de regalo. 🎀📦',
    keywords: 'envio, envios, entrega, costo envio, paqueteria, gratis, cuanto tarda'
  },
  {
    id: 'faq-4',
    category: '📦 Envíos y Entregas',
    question: '¿Cómo puedo rastrear mi pedido?',
    answer: '🔍 En cuanto despachamos tu paquete, recibirás un mensaje a tu WhatsApp y correo con tu número de guía de DHL o Estafeta junto con el enlace para ver la ruta en vivo. 🚚💕',
    keywords: 'rastreo, rastrear, guia, seguimiento, paquete, donde viene'
  },
  {
    id: 'faq-5',
    category: '💳 Pagos y Cupones',
    question: '¿Qué formas de pago aceptan?',
    answer: '💳 **Métodos de Pago 100% Seguros**:\n• Tarjetas de Crédito / Débito (Visa, Mastercard, Amex)\n• Mercado Pago y PayPal\n• Transferencias SPEI\n• Depósito en efectivo en tiendas OXXO y 7-Eleven ✨',
    keywords: 'pago, metodos, pagar, tarjeta, transferencia, spei, oxxo, paypal'
  },
  {
    id: 'faq-6',
    category: '💳 Pagos y Cupones',
    question: '¿Tienen meses sin intereses o cupones de descuento?',
    answer: '🛍️ **Promociones Activas**:\n• **3 y 6 Meses Sin Intereses** en compras a partir de $1,200 MXN.\n• Cupón de bienvenida: ingresa el código **GIRLPOWER10** para **10% OFF** en tu primera compra online 💖🎉',
    keywords: 'msi, meses sin intereses, descuento, cupon, promocion, oferta'
  },
  {
    id: 'faq-7',
    category: '🔄 Cambios y Garantía',
    question: '¿Cómo funcionan los cambios o devoluciones?',
    answer: '🔄 Tienes **15 días naturales** desde que recibes tu paquete para solicitar un cambio de talla o modelo. Si estás en nuestra ciudad puedes hacerlo directo en boutique, o te generamos una guía de retorno sin costo de paquetería si el producto conserva sus etiquetas. 🌸',
    keywords: 'cambios, cambio, devolucion, garantia, regresar, talla'
  },
  {
    id: 'faq-8',
    category: '💬 Asesoría Personalizada',
    question: '¿Cómo puedo hablar con una asesora humana en WhatsApp?',
    answer: '💬 ¡Claro que sí reina! Para atención personalizada de estilismo o pedidos especiales, escríbenos directamente a nuestro WhatsApp oficial: **+52 (55) 1234-5678** o al correo **hola@tumarca.com**. ¡Te atendemos con todo el gusto! 🎀💖',
    keywords: 'asesor, asesora, humano, persona, whatsapp, telefono, contacto, hablar con alguien'
  }
];

function normalizeKey(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Enhanced Excel parser that supports BOTH standard FAQs and Product Inventory sheets
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('El archivo Excel no contiene ninguna hoja.');
        }

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!rawJson || rawJson.length < 2) {
          throw new Error('El archivo Excel debe tener encabezados y al menos una fila de datos.');
        }

        const headerRow = rawJson[0].map(h => normalizeKey(h));

        // Column indexes
        let qCol = -1;
        let aCol = -1;
        let catCol = -1;
        let kwCol = -1;
        let priceCol = -1;
        let stockCol = -1;

        headerRow.forEach((colName, idx) => {
          if (['pregunta', 'preguntas', 'question', 'q', 'producto', 'articulo', 'nombre'].some(k => colName.includes(k))) {
            if (qCol === -1) qCol = idx;
          } else if (['respuesta', 'respuestas', 'answer', 'a', 'descripcion', 'detalle', 'informacion'].some(k => colName.includes(k))) {
            if (aCol === -1) aCol = idx;
          } else if (['categoria', 'category', 'seccion', 'departamento', 'tipo'].some(k => colName.includes(k))) {
            if (catCol === -1) catCol = idx;
          } else if (['palabras', 'keywords', 'tags', 'etiquetas', 'clave'].some(k => colName.includes(k))) {
            if (kwCol === -1) kwCol = idx;
          } else if (['precio', 'costo', 'price'].some(k => colName.includes(k))) {
            priceCol = idx;
          } else if (['stock', 'existencias', 'inventario', 'cantidad'].some(k => colName.includes(k))) {
            stockCol = idx;
          }
        });

        // Fallbacks
        if (qCol === -1) qCol = 0;
        if (aCol === -1 && headerRow.length > 1) aCol = 1;

        const results = [];
        for (let i = 1; i < rawJson.length; i++) {
          const row = rawJson[i];
          if (!row || row.length === 0) continue;

          let question = row[qCol] ? String(row[qCol]).trim() : '';
          let answer = (aCol !== -1 && row[aCol]) ? String(row[aCol]).trim() : '';
          const category = (catCol !== -1 && row[catCol]) ? String(row[catCol]).trim() : 'General';
          let keywords = (kwCol !== -1 && row[kwCol]) ? String(row[kwCol]).trim() : '';
          const price = (priceCol !== -1 && row[priceCol] !== undefined) ? String(row[priceCol]).trim() : '';
          const stock = (stockCol !== -1 && row[stockCol] !== undefined) ? String(row[stockCol]).trim() : '';

          // If this is structured as a product inventory row, enrich format:
          if (question && (price || stock)) {
            if (!question.toLowerCase().startsWith('¿')) {
              const rawTitle = question;
              question = `¿Cuánto cuesta ${rawTitle} y tienen stock?`;
              let enrichedAnswer = `🌸 **${rawTitle}**\n${answer ? `• ${answer}\n` : ''}`;
              if (price) enrichedAnswer += `• **Precio**: $${price.replace('$', '')} MXN\n`;
              if (stock) enrichedAnswer += `• **Disponibilidad**: ${stock} unidades en stock 💕`;
              answer = enrichedAnswer;
              if (!keywords) keywords = rawTitle.toLowerCase();
            }
          }

          if (question && answer) {
            results.push({
              id: `kb-excel-${Date.now()}-${i}`,
              question,
              answer,
              category: category || 'General',
              keywords: keywords || ''
            });
          }
        }

        if (results.length === 0) {
          throw new Error('No se encontraron registros válidos de preguntas o productos en el archivo.');
        }

        resolve(results);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Downloads a super expanded sample template Excel with FAQ and Inventory products
 */
export function downloadSampleTemplate() {
  const sampleData = DEFAULT_KNOWLEDGE_BASE.map(item => ({
    'Categoría': item.category,
    'Pregunta o Producto': item.question,
    'Respuesta o Detalle': item.answer,
    'Palabras Clave': item.keywords
  }));

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  worksheet['!cols'] = [
    { wch: 30 }, // Categoría
    { wch: 48 }, // Pregunta / Producto
    { wch: 75 }, // Respuesta / Detalle
    { wch: 40 }  // Palabras Clave
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Catalogo_Y_Preguntas');

  XLSX.writeFile(workbook, 'plantilla_catalogo_y_preguntas_empresa.xlsx');
}

/**
 * Exports current knowledge base
 */
export function exportKnowledgeBaseToExcel(items, filename = 'base_conocimiento_y_catalogo.xlsx') {
  const formatted = items.map(item => ({
    'Categoría': item.category || 'General',
    'Pregunta o Producto': item.question,
    'Respuesta o Detalle': item.answer,
    'Palabras Clave': item.keywords || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);
  worksheet['!cols'] = [
    { wch: 30 },
    { wch: 48 },
    { wch: 75 },
    { wch: 40 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario_Y_Preguntas');
  XLSX.writeFile(workbook, filename);
}
