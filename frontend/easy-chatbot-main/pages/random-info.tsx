// frontend/easy-chatbot-main/pages/random-info.tsx
import React from 'react';
import ChatbotBubble from '@/components/ChatbotBubble';

const RandomInfoPage = () => {
  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/page.png')" }}>
      <ChatbotBubble />
    </div>
  );
};

export default RandomInfoPage;