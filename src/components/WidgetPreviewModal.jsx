import React, { useState } from 'react';
import { MessageCircleHeart, X, Sparkles } from 'lucide-react';
import ChatView from './ChatView';
import { useBot } from '../context/BotContext';
import { sounds } from '../utils/sound';

export default function WidgetPreviewModal({ isOpen, onClose }) {
  const { config } = useBot();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Floating Trigger button at bottom-right */}
      <button
        onClick={() => {
          sounds.playPop();
          setIsMinimized(!isMinimized);
        }}
        className="floating-widget-trigger animate-bounce-subtle"
        title="Abrir / Cerrar Chatbot Flotante"
      >
        <span style={{ fontSize: '1.3rem' }}>{config.botAvatar || '🎀'}</span>
        <span>{isMinimized ? '¡Holi! ¿Dudas? 💕' : 'Cerrar Chat 🌸'}</span>
        <Sparkles size={16} />
      </button>

      {/* Floating Widget Window */}
      {!isMinimized && (
        <div className="floating-chat-popup">
          <ChatView isWidgetMode={true} onCloseWidget={onClose} />
        </div>
      )}
    </>
  );
}
