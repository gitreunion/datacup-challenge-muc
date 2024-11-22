import React, { useState } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import axios from 'axios';
import './ChatbotBubble.css'; // Import the CSS file

const ChatbotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const theme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#00b2a9',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#00b2a9',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
  };

  const FetchResponse = ({ steps, triggerNextStep }) => {
    const userMessage = steps['user-input'].value;
    const [response, setResponse] = React.useState('...'); // Initial state as "..."
    const [isFetching, setIsFetching] = React.useState(true);

    React.useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.post('http://your-backend-url/api', {
            message: userMessage,
          });
          setResponse(res.data.reply); // Set the response
        } catch (error) {
          setResponse('Sorry, something went wrong.');
        } finally {
          setIsFetching(false); // End fetching
        }
      };

      fetchData();
    }, [userMessage]);

    React.useEffect(() => {
      if (!isFetching) {
        triggerNextStep({ value: response });
      }
    }, [isFetching, response, triggerNextStep]);

    return <div>{response}</div>; // Show either "..." or the response
  };

  const steps = [
    { id: '1', message: 'Hello! How can I help you today?', trigger: 'user-input' },
    { id: 'user-input', user: true, trigger: 'fetch-response' },
    { id: 'fetch-response', component: <FetchResponse />, asMessage: true, trigger: 'user-input' },
  ];

  return (
    <div className="chatbot-container">
      <img
        src="icon_chat.png"
        alt="Chat Icon"
        onClick={toggleChatbot}
        className="chat-icon"
      />
      {isOpen && (
        <div className="chat-popup">
          <ThemeProvider theme={theme}>
            <ChatBot 
              steps={steps}
              placeholder="Type your message..."
              style={{ width: '100%', height: '100%' }}
            />
          </ThemeProvider>
        </div>
      )}
    </div>
  );
};

export default ChatbotBubble;
