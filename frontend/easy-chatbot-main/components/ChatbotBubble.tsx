import React, { useState, useEffect, useRef } from 'react';
import './ChatbotBubble.css'; // Import the CSS file

const ChatbotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Bonjour! Comment je peux vous aider?', sender: 'Mme Odd' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    setMessages(prevMessages => [...prevMessages, { type: 'user', text: userMessage, sender: 'Vous' }]);
    setUserInput('');
    setIsLoading(true);

    // Simulate an API call
    fetch('http://localhost:9001/chat_completion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_message: userMessage }),
    })
      .then(response => {
        if (response.status === 404 || !response.ok) {
          throw new Error('API returned 404 or other error');
        }
        return response.json();
      })
      .then(data => {
        setMessages(prevMessages => [...prevMessages, { type: 'bot', text: data.reply, sender: 'Mme Aude' }]);
      })
      .catch(() => {
        setMessages(prevMessages => [...prevMessages, { type: 'bot', text: 'Une erreur est survenue veuillez réessayer.', sender: 'Mme Aude' }]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const renderMessages = () =>
    messages.map((message, index) => (
      <div key={index} className={`message ${message.type === 'bot' ? 'bot-message' : 'user-message'}`}>
        <div className="sender">{message.sender}</div>
        <div className="message-text">{message.text}</div>
      </div>
    ));

  return (
    <div className="chatbot-container">
      <img 
        src="icon_chat.png"
        alt="Chat"
        onClick={toggleChat}
        className="chat-icon"
      />
      {isOpen && (
        <div className="chatbox animate-slide-in">
          <div className="messages">
            {renderMessages()}
            <div ref={messagesEndRef} />
          </div>
          <div className="input-container">
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Entrez votre message..."
              disabled={isLoading}
            />
            <button onClick={handleSendMessage} disabled={isLoading}>
              <img src="icon_chat.png" alt="Send" className="send-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotBubble;