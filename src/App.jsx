import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatView from './components/ChatView';
import AdminPanel from './components/AdminPanel';
import WidgetPreviewModal from './components/WidgetPreviewModal';
import { BotProvider } from './context/BotContext';
import './App.css';

function MainApp() {
  // Sync URL route with view: '/' -> chat, '/admin' -> admin
  const getInitialView = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('admin')) return 'admin';
    }
    return 'chat';
  };

  const [activeView, setActiveView] = useState(getInitialView);
  const [showWidgetPreview, setShowWidgetPreview] = useState(false);

  // Sync browser URL bar without page reload
  const handleViewChange = (view) => {
    setActiveView(view);
    const newPath = view === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  };

  // Listen to popstate for back/forward browser buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      setActiveView(path.includes('admin') ? 'admin' : 'chat');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="app-container">
      {/* Background Floating Cute Decorations */}
      <div className="bg-decorations">
        <span className="decor-item animate-float" style={{ top: '8%', left: '4%', fontSize: '2rem' }}>🌸</span>
        <span className="decor-item animate-sparkle" style={{ top: '15%', right: '8%', fontSize: '1.8rem' }}>✨</span>
        <span className="decor-item animate-bounce-subtle" style={{ bottom: '12%', left: '6%', fontSize: '2rem' }}>💖</span>
        <span className="decor-item animate-float" style={{ bottom: '18%', right: '5%', fontSize: '2.2rem' }}>🎀</span>
        <span className="decor-item" style={{ top: '50%', left: '2%', fontSize: '1.5rem', opacity: 0.2 }}>🧁</span>
        <span className="decor-item animate-sparkle" style={{ top: '65%', right: '3%', fontSize: '1.5rem', opacity: 0.25 }}>🌟</span>
      </div>

      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={handleViewChange}
        onToggleWidgetPreview={() => setShowWidgetPreview(!showWidgetPreview)}
      />

      {/* Main View Container */}
      <main className="main-wrapper">
        {activeView === 'chat' ? (
          <ChatView />
        ) : (
          <AdminPanel />
        )}
      </main>

      {/* Floating Widget Live Demo Modal */}
      <WidgetPreviewModal
        isOpen={showWidgetPreview}
        onClose={() => setShowWidgetPreview(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BotProvider>
      <MainApp />
    </BotProvider>
  );
}
