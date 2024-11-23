import React, { useState, useEffect, useRef } from 'react';
import './ChatbotBubble.css'; // Import the CSS file

const ChatbotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Bonjour! Comment je peux vous aider?', sender: 'Mme Aude' },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('chatbotToken');
    if (token) {
      const expiryTime = JSON.parse(token).expiry;
      const remainingTime = expiryTime - Date.now();
      if (remainingTime > 0) {
        setIsLocked(true);
        setTimeout(() => {
          localStorage.removeItem('chatbotToken');
          setIsLocked(false);
        }, remainingTime);
      } else {
        localStorage.removeItem('chatbotToken');
      }
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (!userInput.trim() || isLocked) return;

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
        setRequestCount(prevCount => {
          const newCount = prevCount + 1;
          if (newCount >= 10) {
            const expiryTime = Date.now() + 2 * 60 * 60 * 1000;
            localStorage.setItem('chatbotToken', JSON.stringify({ expiry: expiryTime }));
            setIsLocked(true);
            setTimeout(() => {
              localStorage.removeItem('chatbotToken');
              setIsLocked(false);
            }, 2 * 60 * 60 * 1000);
          }
          return newCount;
        });
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
        <div className="sender">
          {message.type === 'bot' && <img src="Aude.jpg" alt="Aude" className="sender-icon" />}
          {message.sender}
        </div>
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
              disabled={isLoading || isLocked}
            />
            <button onClick={handleSendMessage} disabled={isLoading || isLocked}>
              <img src="icon_chat.png" alt="Send" className="send-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotBubble;