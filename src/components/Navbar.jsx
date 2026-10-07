import React from 'react';
import { MessageSquareHeart, Sliders, Volume2, VolumeX, Sparkles, ExternalLink, Bot } from 'lucide-react';
import { useBot } from '../context/BotContext';
import CuteAvatar from './CuteAvatar';

export default function Navbar({ activeView, setActiveView, onToggleWidgetPreview }) {
  const { config, updateConfig, toggleSound } = useBot();

  const themes = [
    { id: 'pink', name: '🌸 Fresa', color: '#ff65a3' },
    { id: 'lavender', name: '💜 Lavanda', color: '#a855f7' },
    { id: 'peach', name: '🍑 Melocotón', color: '#fb7185' },
    { id: 'mint', name: '🌿 Menta', color: '#14b8a6' }
  ];

  return (
    <header className="navbar">
      {/* Brand logo & title */}
      <div className="nav-brand">
        <div className="brand-avatar animate-float">
          <CuteAvatar id={config.botAvatar} size={28} />
        </div>
        <div>
          <div className="brand-title">
            {config.botName || 'Mila AI'}
            <Sparkles size={16} className="animate-sparkle" style={{ color: 'var(--primary)' }} />
          </div>
          <div className="brand-subtitle">{config.companyName || 'Boutique & Café Rosé'}</div>
        </div>
      </div>

      {/* Navigation: Only visible when the admin is on /admin route */}
      {activeView === 'admin' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="badge-tag" style={{ background: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' }}>
            🔒 Modo Administrador
          </span>
          <button
            className="btn-cute-secondary"
            onClick={() => setActiveView('chat')}
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
          >
            <MessageSquareHeart size={16} />
            <span>Ver Chatbot de Clientes</span>
          </button>
        </div>
      ) : null}

      {/* Right tools: Sound toggle & Theme picker */}
      <div className="nav-actions">
        {/* Theme select dropdown */}
        <select
          value={config.themeColor}
          onChange={(e) => {
            updateConfig({ themeColor: e.target.value });
            document.documentElement.setAttribute('data-theme', e.target.value);
          }}
          className="form-select"
          style={{ width: 'auto', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 600 }}
          title="Cambiar paleta de colores"
        >
          {themes.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        {/* Audio sound effects toggle */}
        <button
          onClick={toggleSound}
          className="icon-btn-round"
          title={config.soundEnabled ? 'Silenciar sonidos cute' : 'Activar sonidos cute'}
        >
          {config.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Widget Preview Toggle - Only in Admin mode */}
        {activeView === 'admin' && (
          <button
            onClick={onToggleWidgetPreview}
            className="btn-cute-secondary"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
            title="Probar widget flotante como en tu tienda web"
          >
            <Bot size={15} />
            <span>Probar Flotante</span>
          </button>
        )}
      </div>
    </header>
  );
}
