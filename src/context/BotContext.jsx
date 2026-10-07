import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_KNOWLEDGE_BASE } from '../utils/excelHelper';
import { sounds } from '../utils/sound';

const BotContext = createContext(null);

const STORAGE_KEY_KB = 'cute_bot_knowledge_base_v3';
const STORAGE_KEY_CFG = 'cute_bot_config_v3';

const DEFAULT_CONFIG = {
  botName: 'Lola AI 🎀',
  botTagline: 'Asistente de ventas & boutique',
  botAvatar: '🎀',
  botAvatarType: 'emoji',
  companyName: 'Boutique & Café Rosé',
  welcomeMessage: '¡Holi bella! 💖 Bienvenida a Boutique & Café Rosé. Pregúntame sobre nuestro catálogo de ropa, bolsos, skincare, bebidas rosa o dudas de envíos y pagos ✨ ¿Qué se te antoja ver hoy?',
  fallbackMessage: '¡Ay hermosa! 🌸 Aún no tengo ese producto o dato en mi libretita rosa 📝💕. ¿Quieres consultar otra prenda/bebida o escribir a una asesora humana por WhatsApp al **+52 55 1234-5678**?',
  themeColor: 'pink',
  soundEnabled: true,
  apiProvider: 'groq', // default to Groq
  apiKey: '',
  model: 'llama-3.1-8b-instant'
};

export function BotProvider({ children }) {
  const [knowledgeBase, setKnowledgeBase] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_KB);
      if (saved) return JSON.parse(saved);
    } catch {
      // LocalStorage access fallback
    }
    return DEFAULT_KNOWLEDGE_BASE;
  });

  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CFG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.model === 'llama-3.3-70b-versatile') {
          parsed.model = 'llama-3.1-8b-instant';
        }
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch {
      // LocalStorage access fallback
    }
    return DEFAULT_CONFIG;
  });

  // Sync sound setting with sounds helper
  useEffect(() => {
    sounds.enabled = config.soundEnabled;
  }, [config.soundEnabled]);

  // Persist knowledge base
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_KB, JSON.stringify(knowledgeBase));
    } catch (e) {
      console.warn('Error al guardar knowledge base:', e);
    }
  }, [knowledgeBase]);

  // Persist config
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CFG, JSON.stringify(config));
    } catch (e) {
      console.warn('Error al guardar config:', e);
    }
  }, [config]);

  const updateKnowledgeBase = (newList) => {
    setKnowledgeBase(newList);
  };

  const addKnowledgeItem = (item) => {
    const newItem = {
      ...item,
      id: item.id || `kb-custom-${Date.now()}`
    };
    setKnowledgeBase(prev => [newItem, ...prev]);
  };

  const updateKnowledgeItem = (id, updatedFields) => {
    setKnowledgeBase(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const deleteKnowledgeItem = (id) => {
    setKnowledgeBase(prev => prev.filter(item => item.id !== id));
  };

  const resetToDefaultData = () => {
    setKnowledgeBase(DEFAULT_KNOWLEDGE_BASE);
    setConfig(DEFAULT_CONFIG);
  };

  const updateConfig = (partial) => {
    setConfig(prev => ({ ...prev, ...partial }));
  };

  const toggleSound = () => {
    setConfig(prev => {
      const nextVal = !prev.soundEnabled;
      sounds.enabled = nextVal;
      if (nextVal) sounds.playPop();
      return { ...prev, soundEnabled: nextVal };
    });
  };

  return (
    <BotContext.Provider
      value={{
        knowledgeBase,
        config,
        updateKnowledgeBase,
        addKnowledgeItem,
        updateKnowledgeItem,
        deleteKnowledgeItem,
        resetToDefaultData,
        updateConfig,
        toggleSound
      }}
    >
      {children}
    </BotContext.Provider>
  );
}

export function useBot() {
  const context = useContext(BotContext);
  if (!context) {
    throw new Error('useBot must be used within a BotProvider');
  }
  return context;
}
