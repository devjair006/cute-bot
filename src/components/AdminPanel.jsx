import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, Upload, Download, Plus, Trash2, Edit3, Search, 
  Sparkles, CheckCircle2, AlertCircle, Palette, Key, Code, RefreshCw, Eye, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBot } from '../context/BotContext';
import { parseExcelFile, downloadSampleTemplate, exportKnowledgeBaseToExcel } from '../utils/excelHelper';
import { testAIConnection } from '../utils/nlpEngine';
import { sounds } from '../utils/sound';

export default function AdminPanel() {
  const { 
    knowledgeBase, 
    config, 
    updateKnowledgeBase, 
    addKnowledgeItem, 
    updateKnowledgeItem, 
    deleteKnowledgeItem, 
    resetToDefaultData, 
    updateConfig 
  } = useBot();

  const [activeTab, setActiveTab] = useState('excel');
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [testingAi, setTestingAi] = useState(false);
  const [testAiResult, setTestAiResult] = useState(null);
  const [detectedModels, setDetectedModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [appendMode, setAppendMode] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formCategory, setFormCategory] = useState('');
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formKeywords, setFormKeywords] = useState('');

  // Copy toast state
  const [toastMessage, setToastMessage] = useState('');

  const fileInputRef = useRef(null);

  // Unique categories list
  const categories = ['ALL', ...new Set(knowledgeBase.map(i => i.category || 'General'))];

  // Filtered knowledge items
  const filteredItems = knowledgeBase.filter(item => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch = 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.keywords && item.keywords.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Handle Excel file upload
  const handleFileUpload = async (file) => {
    if (!file) return;

    sounds.playPop();
    setUploadStatus({ type: 'loading', message: 'Leyendo y procesando archivo Excel... 🌸' });

    try {
      const parsedItems = await parseExcelFile(file);

      if (appendMode) {
        updateKnowledgeBase([...knowledgeBase, ...parsedItems]);
      } else {
        updateKnowledgeBase(parsedItems);
      }

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
      sounds.playSparkle();

      setUploadStatus({
        type: 'success',
        message: `¡Hermoso! Se cargaron exitosamente ${parsedItems.length} preguntas y respuestas. 💖`
      });
    } catch (err) {
      setUploadStatus({
        type: 'error',
        message: `Error al leer Excel: ${err.message || 'Verifica el formato del archivo'}`
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Open modal for Create/Edit
  const openModal = (item = null) => {
    sounds.playPop();
    if (item) {
      setEditingItem(item);
      setFormCategory(item.category || 'General');
      setFormQuestion(item.question);
      setFormAnswer(item.answer);
      setFormKeywords(item.keywords || '');
    } else {
      setEditingItem(null);
      setFormCategory('General');
      setFormQuestion('');
      setFormAnswer('');
      setFormKeywords('');
    }
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) return;

    if (editingItem) {
      updateKnowledgeItem(editingItem.id, {
        category: formCategory.trim() || 'General',
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        keywords: formKeywords.trim()
      });
      showToast('¡Pregunta actualizada correctamente! ✨');
    } else {
      addKnowledgeItem({
        category: formCategory.trim() || 'General',
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
        keywords: formKeywords.trim()
      });
      showToast('¡Nueva pregunta agregada con éxito! 💕');
    }

    sounds.playSparkle();
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Segura que deseas eliminar esta pregunta de la base de datos? 🌸')) {
      deleteKnowledgeItem(id);
      sounds.playPop();
      showToast('Pregunta eliminada.');
    }
  };

  // Copy embed snippet helper
  const copyEmbedSnippet = (code) => {
    navigator.clipboard.writeText(code);
    sounds.playSparkle();
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
    showToast('¡Código copiado al portapapeles! 🎀');
  };

  const embedScriptCode = `<iframe 
  src="${window.location.origin}/" 
  width="400" 
  height="600" 
  style="border:none; border-radius:24px; box-shadow:0 10px 30px rgba(255,105,180,0.25);"
  title="${config.botName}">
</iframe>`;

  return (
    <div className="admin-window">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="cute-toast">
          <Sparkles size={18} style={{ color: 'var(--primary)' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-header-title">
            Panel de Administración
            <Sparkles size={20} style={{ color: 'var(--primary)' }} />
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Gestiona la información de tu empresa vía Excel y personaliza la apariencia girlie de tu chatbot.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => downloadSampleTemplate()} 
            className="btn-cute-secondary"
            title="Descargar plantilla de Excel recomendada"
          >
            <Download size={16} />
            Descargar Plantilla Excel
          </button>

          <button 
            onClick={() => exportKnowledgeBaseToExcel(knowledgeBase)} 
            className="btn-cute-secondary"
            title="Exportar base de datos a un archivo Excel"
          >
            <FileSpreadsheet size={16} />
            Exportar a Excel
          </button>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="admin-stats-bar">
        <div className="stat-card">
          <div className="stat-icon">
            <FileSpreadsheet />
          </div>
          <div>
            <div className="stat-value">{knowledgeBase.length}</div>
            <div className="stat-label">Preguntas en Base de Datos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Sparkles />
          </div>
          <div>
            <div className="stat-value">{categories.length - 1}</div>
            <div className="stat-label">Categorías Registradas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 style={{ color: '#10b981' }} />
          </div>
          <div>
            <div className="stat-value" style={{ color: '#10b981', fontSize: '1.25rem' }}>Activo 💖</div>
            <div className="stat-label">Estado de {config.botName}</div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="admin-subtabs">
        <button
          className={`admin-subtab-btn ${activeTab === 'excel' ? 'active' : ''}`}
          onClick={() => setActiveTab('excel')}
        >
          <Upload size={17} />
          <span>1. Subir Excel (.xlsx)</span>
        </button>

        <button
          className={`admin-subtab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          <FileSpreadsheet size={17} />
          <span>2. Gestionar Preguntas ({knowledgeBase.length})</span>
        </button>

        <button
          className={`admin-subtab-btn ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          <Palette size={17} />
          <span>3. Estilo Girlie & Marca</span>
        </button>

        <button
          className={`admin-subtab-btn ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <Key size={17} />
          <span>4. Conexión IA (Opcional)</span>
        </button>

        <button
          className={`admin-subtab-btn ${activeTab === 'vercel' ? 'active' : ''}`}
          onClick={() => setActiveTab('vercel')}
        >
          <Code size={17} />
          <span>5. Vercel & Código Web</span>
        </button>
      </div>

      {/* ================= TAB 1: EXCEL UPLOAD ================= */}
      {activeTab === 'excel' && (
        <div>
          {/* Upload Status Banner */}
          {uploadStatus && (
            <div
              style={{
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.92rem',
                fontWeight: 600,
                background: uploadStatus.type === 'error' ? '#fee2e2' : '#f0fdf4',
                color: uploadStatus.type === 'error' ? '#dc2626' : '#16a34a',
                border: `1px solid ${uploadStatus.type === 'error' ? '#fca5a5' : '#bbf7d0'}`
              }}
            >
              {uploadStatus.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              <span>{uploadStatus.message}</span>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            className={`dropzone-container ${dragActive ? 'dragging' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />

            <div className="dropzone-icon">🎀📊</div>
            <h3 className="dropzone-title">Arrastra tu archivo Excel aquí o haz clic para seleccionarlo</h3>
            <p className="dropzone-desc">
              Soporta archivos <strong>.xlsx</strong>, <strong>.xls</strong> o <strong>.csv</strong> con columnas como 
              <em> Pregunta</em>, <em> Respuesta</em> y opcionalmente <em> Categoría</em> o <em> Palabras Clave</em>.
            </p>

            <button type="button" className="btn-cute-primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              <Upload size={17} />
              Seleccionar Archivo Excel
            </button>
          </div>

          {/* Mode Settings */}
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={appendMode}
                onChange={(e) => setAppendMode(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
              <span>Añadir al contenido actual en vez de sobrescribir toda la base</span>
            </label>

            <button
              onClick={() => {
                if (window.confirm('¿Deseas restaurar la base de datos de ejemplo de Boutique & Café Rosé? 🌸')) {
                  resetToDefaultData();
                  sounds.playSparkle();
                  showToast('Base de datos restaurada al ejemplo.');
                }
              }}
              className="btn-cute-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              <RefreshCw size={15} />
              Restaurar Datos de Demostración
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MANAGE Q&A ================= */}
      {activeTab === 'manage' && (
        <div>
          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Buscar en preguntas o respuestas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.3rem' }}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="form-select"
                style={{ width: 'auto' }}
              >
                {categories.map((c, i) => (
                  <option key={i} value={c}>
                    {c === 'ALL' ? 'Todas las Categorías' : c}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={() => openModal()} className="btn-cute-primary">
              <Plus size={16} />
              Nueva Pregunta
            </button>
          </div>

          {/* Table */}
          <div className="table-container">
            {filteredItems.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌸</div>
                <p>No se encontraron preguntas con los filtros seleccionados.</p>
              </div>
            ) : (
              <table className="cute-table">
                <thead>
                  <tr>
                    <th style={{ width: '18%' }}>Categoría</th>
                    <th style={{ width: '32%' }}>Pregunta</th>
                    <th style={{ width: '38%' }}>Respuesta</th>
                    <th style={{ width: '12%', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className="badge-tag">{item.category || 'General'}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.question}</td>
                      <td style={{ color: 'var(--text-main)', fontSize: '0.86rem' }}>
                        {item.answer}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => openModal(item)}
                            className="icon-btn-round"
                            title="Editar pregunta"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="icon-btn-round"
                            title="Eliminar"
                            style={{ width: '32px', height: '32px', color: '#ef4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: GIRLIE STYLE & BRAND ================= */}
      {activeTab === 'style' && (
        <div style={{ maxWidth: '680px' }}>
          <div className="form-group">
            <label className="form-label">Nombre del Chatbot ✨</label>
            <input
              type="text"
              className="form-input"
              value={config.botName}
              onChange={(e) => updateConfig({ botName: e.target.value })}
              placeholder="Ej. Lola AI 🎀"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nombre de tu Empresa / Marca 🛍️</label>
            <input
              type="text"
              className="form-input"
              value={config.companyName}
              onChange={(e) => updateConfig({ companyName: e.target.value })}
              placeholder="Ej. Boutique & Café Rosé"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar del Bot 💕</label>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              {['🎀', '🐱', '🐰', '👑', '🌸', '💖', '☕', '🍓'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => updateConfig({ botAvatar: emoji, botAvatarType: 'emoji' })}
                  style={{
                    width: '45px',
                    height: '45px',
                    fontSize: '1.4rem',
                    borderRadius: 'var(--radius-md)',
                    background: config.botAvatar === emoji ? 'var(--primary-light)' : '#ffffff',
                    border: `2px solid ${config.botAvatar === emoji ? 'var(--primary)' : 'var(--card-border)'}`
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="O ingresa la URL de una foto/logo (ej. https://...)"
              value={config.botAvatarType === 'url' ? config.botAvatar : ''}
              onChange={(e) => {
                if (e.target.value.trim()) {
                  updateConfig({ botAvatar: e.target.value.trim(), botAvatarType: 'url' });
                }
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mensaje de Bienvenida 🌸</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={config.welcomeMessage}
              onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mensaje cuando no encuentra la respuesta (Fallback) 📝</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={config.fallbackMessage}
              onChange={(e) => updateConfig({ fallbackMessage: e.target.value })}
            />
          </div>

          <button onClick={() => showToast('¡Configuración de estilo guardada con éxito! 💖')} className="btn-cute-primary">
            Guardar Cambios
          </button>
        </div>
      )}

      {/* ================= TAB 4: AI & API (OPTIONAL) ================= */}
      {activeTab === 'ai' && (
        <div style={{ maxWidth: '680px' }}>
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 240, 246, 0.85)',
              border: '1px solid var(--card-border)',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              lineHeight: 1.6
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} /> ¿Cuál es la pasarela de IA gratuita más generosa?
            </div>
            <p>
              ¡La mejor opción 100% gratuita y ultra rápida es <strong>Groq Cloud</strong>! 🚀 Da acceso gratis a <strong>Llama 3.3 70B Versatile</strong> con hasta 14,400 peticiones al día sin pedir ninguna tarjeta de crédito.
            </p>
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="btn-cute-primary"
                style={{ fontSize: '0.82rem', padding: '0.45rem 1rem', textDecoration: 'none' }}
              >
                🎁 Obtener clave Groq Gratis en 10 seg (console.groq.com)
              </a>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="btn-cute-secondary"
                style={{ fontSize: '0.82rem', padding: '0.45rem 1rem', textDecoration: 'none' }}
              >
                🌟 Clave Google Gemini Gratis (AI Studio)
              </a>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Proveedor de Inteligencia Artificial</label>
            <select
              className="form-select"
              value={config.apiProvider}
              onChange={(e) => {
                const prov = e.target.value;
                let defaultMod = 'llama-3.1-8b-instant';
                if (prov === 'gemini') defaultMod = 'gemini-1.5-flash';
                else if (prov === 'openrouter') defaultMod = 'meta-llama/llama-3.1-8b-instruct:free';
                else if (prov === 'openai') defaultMod = 'gpt-4o-mini';
                updateConfig({ apiProvider: prov, model: defaultMod });
              }}
            >
              <option value="none">✨ Modo Local Inteligente (100% Gratis, Sin Claves, Instantáneo)</option>
              <option value="groq">⚡ Groq Cloud (¡Recomendado! Gratis & Ultra Rápido - Llama 3.1 8B) 🚀</option>
              <option value="openrouter">🌐 OpenRouter (Modelos Gratis :free)</option>
              <option value="gemini">🌟 Google Gemini (Gemini 1.5 Flash)</option>
              <option value="openai">🤖 OpenAI (GPT-4o Mini)</option>
            </select>
          </div>

          {config.apiProvider !== 'none' && (
            <>
              <div className="form-group">
                <label className="form-label">
                  API Key ({config.apiProvider.toUpperCase()})
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder={config.apiProvider === 'groq' ? 'gsk_...' : 'Pega tu clave secreta de API aquí...'}
                  value={config.apiKey}
                  onChange={(e) => updateConfig({ apiKey: e.target.value })}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  Tu clave se guarda segura y encriptada en tu propio navegador (LocalStorage) y nunca viaja a servidores ajenos.
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Modelo Seleccionado</label>
                {config.apiProvider === 'groq' ? (
                  <select
                    className="form-select"
                    value={config.model}
                    onChange={(e) => updateConfig({ model: e.target.value })}
                  >
                    {detectedModels.length > 0 ? (
                      detectedModels.map(m => (
                        <option key={m} value={m}>⚡ {m}</option>
                      ))
                    ) : (
                      <>
                        <option value="llama-3.1-8b-instant">⚡ llama-3.1-8b-instant</option>
                        <option value="openai/gpt-oss-20b">🤖 openai/gpt-oss-20b</option>
                        <option value="openai/gpt-oss-120b">🚀 openai/gpt-oss-120b</option>
                        <option value="qwen/qwen3.8-27b">🌟 qwen/qwen3.8-27b</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    value={config.model}
                    onChange={(e) => updateConfig({ model: e.target.value })}
                    placeholder="Modelo (ej. gemini-1.5-flash)"
                  />
                )}
                <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  {config.apiProvider === 'groq' && (detectedModels.length > 0 ? `✨ Se detectaron ${detectedModels.length} modelos disponibles en tu cuenta Groq.` : '💡 Haz clic en "Probar mi API Key ahora" para auto-detectar los modelos activos de tu cuenta.')}
                </small>
              </div>
            </>
          )}

          {/* Test connection results banner */}
          {testAiResult && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.85rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: testAiResult.success ? '#f0fdf4' : '#fee2e2',
                color: testAiResult.success ? '#15803d' : '#b91c1c',
                border: `1px solid ${testAiResult.success ? '#bbf7d0' : '#fca5a5'}`
              }}
            >
              {testAiResult.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>
                {testAiResult.success
                  ? `¡Conexión exitosa con ${config.apiProvider.toUpperCase()} (${testAiResult.model})! Latencia: ${testAiResult.latencyMs}ms 🚀`
                  : `Error de conexión: ${testAiResult.error}`}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <button onClick={() => showToast('¡Configuración de IA guardada con éxito! ✨')} className="btn-cute-primary">
              Guardar Configuración IA
            </button>

            {config.apiProvider !== 'none' && (
              <button
                type="button"
                onClick={async () => {
                  setTestingAi(true);
                  setTestAiResult(null);
                  sounds.playPop();
                  const res = await testAIConnection(config);
                  setTestingAi(false);
                  setTestAiResult(res);
                  if (res.availableModels && res.availableModels.length > 0) {
                    setDetectedModels(res.availableModels);
                  }
                  if (res.success && res.model) {
                    updateConfig({ model: res.model });
                    sounds.playSparkle();
                    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
                    showToast(`¡Conectado con éxito a ${res.model}! ✨`);
                  }
                }}
                disabled={testingAi || !config.apiKey}
                className="btn-cute-secondary"
                style={{ fontSize: '0.88rem' }}
              >
                <Zap size={16} />
                {testingAi ? 'Detectando modelos y probando...' : '🧪 Probar mi API Key ahora'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 5: VERCEL & EMBED CODE ================= */}
      {activeTab === 'vercel' && (
        <div style={{ maxWidth: '750px' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontFamily: 'var(--font-cute)', fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              🚀 Despliegue en Vercel en 2 minutos
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
              Este proyecto ya incluye el archivo <code>vercel.json</code> con las redirecciones SPA listas. 
              Para publicarlo gratis en Vercel:
            </p>
            <ol style={{ paddingLeft: '1.4rem', fontSize: '0.88rem', marginTop: '0.75rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
              <li>Sube este código a tu repositorio en GitHub (o ejecuta <code>vercel</code> desde tu terminal).</li>
              <li>Entra a <a href="https://vercel.com" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>vercel.com</a> y haz clic en <strong>Add New Project</strong>.</li>
              <li>Importa tu repositorio. ¡Vercel detectará Vite automáticamente!</li>
              <li>Presiona <strong>Deploy</strong> y en 30 segundos tendrás tu URL pública lista (ej. <code>https://mi-empresa-bot.vercel.app</code>).</li>
            </ol>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontFamily: 'var(--font-cute)', fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              🎀 Código para insertar en cualquier Sitio Web o Tienda
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Copia este código y pégalo en tu tienda Shopify, WordPress, WooCommerce, Webflow o HTML:
            </p>

            <div style={{ position: 'relative' }}>
              <pre
                style={{
                  background: '#2b232c',
                  color: '#ffd6ea',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.84rem',
                  overflowX: 'auto',
                  fontFamily: 'monospace'
                }}
              >
                {embedScriptCode}
              </pre>

              <button
                onClick={() => copyEmbedSnippet(embedScriptCode)}
                className="btn-cute-primary"
                style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
              >
                Copiar Código 🎀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT ITEM ================= */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: 'var(--font-cute)', fontSize: '1.35rem', marginBottom: '1.2rem', color: 'var(--text-main)' }}>
              {editingItem ? 'Editar Pregunta & Respuesta 🌸' : 'Agregar Nueva Pregunta a la Empresa 💖'}
            </h2>

            <form onSubmit={handleSaveModal}>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. Envíos, Horarios, Pagos, Productos..."
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pregunta de los clientes *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ej. ¿Tienen envíos gratis?"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Respuesta del Chatbot *</label>
                <textarea
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="Escribe la respuesta bonita y clara que el bot debe dar..."
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Palabras Clave (Opcional, separadas por coma)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="envio, costo, paqueteria, gratis"
                  value={formKeywords}
                  onChange={(e) => setFormKeywords(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-cute-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-cute-primary"
                >
                  Guardar en Base de Datos ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
