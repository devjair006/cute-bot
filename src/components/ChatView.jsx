import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Download, Sparkles, Heart, Smile, Bot, RefreshCw, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBot } from '../context/BotContext';
import { queryAIWithContext } from '../utils/nlpEngine';
import { sounds } from '../utils/sound';

export default function ChatView({ isWidgetMode = false, onCloseWidget }) {
  const { knowledgeBase, config } = useBot();

  const [messages, setMessages] = useState(() => [
    {
      id: 'init-msg',
      sender: 'bot',
      text: config.welcomeMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      loved: false
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const cuteEmojis = ['✨', '💖', '🌸', '🎀', '🛍️', '🧁', '💕', '🍰', '💌', '🐰'];

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Generate suggested quick chips from current knowledge base (top 4-5)
  const suggestedQuestions = knowledgeBase
    .filter(item => item.question && item.question.trim().length > 0)
    .slice(0, 5)
    .map(item => item.question);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    sounds.playSend();

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      loved: false
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setShowEmojiBar(false);
    setIsTyping(true);

    // Natural typing delay
    const typingDelay = Math.min(1100, Math.max(500, text.length * 30));

    setTimeout(async () => {
      try {
        const result = await queryAIWithContext(text, knowledgeBase, config);

        sounds.playSparkle();

        const botReply = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: result.answer,
          source: result.source || 'local',
          isError: result.isError || false,
          category: result.matchedItem?.category || null,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          loved: false
        };

        setMessages(prev => [...prev, botReply]);
      } catch (err) {
        setMessages(prev => [
          ...prev,
          {
            id: `bot-err-${Date.now()}`,
            sender: 'bot',
            text: config.fallbackMessage,
            source: 'error',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            loved: false
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    }, typingDelay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleLoveMessage = (id) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === id) {
          const nextState = !msg.loved;
          if (nextState) {
            confetti({
              particleCount: 35,
              spread: 60,
              origin: { y: 0.75 },
              colors: ['#ff65a3', '#ffcbf2', '#f72585', '#b5179e']
            });
            sounds.playPop();
          }
          return { ...msg, loved: nextState };
        }
        return msg;
      })
    );
  };

  const clearChat = () => {
    sounds.playPop();
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'bot',
        text: config.welcomeMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        loved: false
      }
    ]);
  };

  const downloadTranscript = () => {
    sounds.playPop();
    const transcriptText = messages.map(m => `[${m.time}] ${m.sender === 'bot' ? config.botName : 'Usuario'}: ${m.text}`).join('\n\n');
    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${config.botName.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple formatting helper for bold markdown **text**
  const renderFormattedText = (text) => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} style={{ fontWeight: 700, color: 'var(--primary-hover)' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`chat-window ${isWidgetMode ? 'widget-mode' : ''}`}>
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar-wrapper">
            <div className="chat-header-avatar animate-float">
              {config.botAvatarType === 'url' ? (
                <img src={config.botAvatar} alt="bot avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <span>{config.botAvatar || '🎀'}</span>
              )}
            </div>
            <div className="online-dot" />
          </div>
          <div>
            <div className="chat-header-name">
              {config.botName || 'Lola AI'}
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="chat-header-status">
              <span>●</span> {config.apiProvider && config.apiProvider !== 'none' && config.apiKey ? (
                <span style={{ color: '#10b981', fontWeight: 700 }}>
                  {config.apiProvider.toUpperCase()} ({config.model?.includes('70b') ? 'Llama 3.1' : (config.model || 'Llama 3.1')}) ⚡
                </span>
              ) : (
                <span>Modo Local (Excel) 💕</span>
              )}
            </div>
            <div className="chat-header-company">{config.companyName || 'Boutique & Café Rosé'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button onClick={clearChat} className="icon-btn-round" title="Limpiar conversación">
            <RefreshCw size={15} />
          </button>
          <button onClick={downloadTranscript} className="icon-btn-round" title="Descargar historial de chat">
            <Download size={15} />
          </button>
          {isWidgetMode && (
            <button onClick={onCloseWidget} className="icon-btn-round" title="Cerrar ventana">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender}`}>
            {msg.sender === 'bot' && (
              <div className="msg-avatar">
                {config.botAvatarType === 'url' ? (
                  <img src={config.botAvatar} alt="bot" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  <span>{config.botAvatar || '🎀'}</span>
                )}
              </div>
            )}

            <div className={`bubble ${msg.sender === 'bot' ? 'bot-bubble' : 'user-bubble'}`}>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {renderFormattedText(msg.text)}
              </div>

              <div className="bubble-footer">
                {msg.sender === 'bot' && (
                  <span style={{ marginRight: 'auto', fontSize: '0.7rem', fontWeight: 700 }}>
                    {msg.source === 'groq' && <span style={{ color: '#d97706' }}>⚡ Groq IA</span>}
                    {msg.source === 'gemini' && <span style={{ color: '#2563eb' }}>🌟 Gemini IA</span>}
                    {msg.source === 'openrouter' && <span style={{ color: '#7c3aed' }}>🌐 OpenRouter</span>}
                    {msg.source === 'openai' && <span style={{ color: '#059669' }}>🤖 OpenAI</span>}
                    {msg.source === 'local' && <span style={{ color: 'var(--primary)' }}>🌸 Base Excel</span>}
                    {msg.isError && <span style={{ color: '#dc2626' }}>⚠️ Error Conexión</span>}
                  </span>
                )}
                <span>{msg.time}</span>
                {msg.sender === 'bot' && (
                  <button
                    onClick={() => toggleLoveMessage(msg.id)}
                    className="msg-reaction-btn"
                    title="Dar amor a esta respuesta"
                  >
                    {msg.loved ? '💖' : '🤍'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="message-row bot">
            <div className="msg-avatar">
              <span>{config.botAvatar || '🎀'}</span>
            </div>
            <div className="typing-box">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions Chips Carousel */}
      {suggestedQuestions.length > 0 && (
        <div className="chat-suggestions">
          <span className="suggestions-title">
            <Sparkles size={13} /> Sugerencias:
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              className="chip-btn"
              onClick={() => handleSendMessage(q)}
              disabled={isTyping}
            >
              🌸 {q}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Picker Quick Bar */}
      {showEmojiBar && (
        <div
          style={{
            padding: '0.45rem 1rem',
            background: 'rgba(255, 240, 246, 0.95)',
            borderTop: '1px solid var(--card-border)',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto'
          }}
        >
          {cuteEmojis.map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputValue(prev => prev + emoji);
                inputRef.current?.focus();
              }}
              style={{
                fontSize: '1.25rem',
                background: 'transparent',
                padding: '2px 6px',
                borderRadius: '8px'
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="chat-input-bar">
        <button
          onClick={() => setShowEmojiBar(!showEmojiBar)}
          className="icon-btn-round"
          title="Insertar emoji cute"
        >
          <Smile size={18} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu consulta aquí con amor... 🌸✨"
          className="chat-input-field"
          disabled={isTyping}
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isTyping}
          className="chat-send-btn"
          title="Enviar mensaje"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
