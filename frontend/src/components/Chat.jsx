import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { queryDocument } from '../store/slices/chatSlice';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const dispatch = useDispatch();
  const { messages, isQuerying, documentUploaded } = useSelector((state) => state.chat);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isQuerying]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !documentUploaded || isQuerying) return;
    
    // Add user message to UI immediately by dispatching an action 
    // but in our current simple slice we rely on dispatch to just call the API.
    // For a real app, you'd dispatch a sync action to add the message, then the thunk.
    // Here we'll just let the thunk result show, wait, we need user message showing immediately!
    
    dispatch({ type: 'chat/addUserMessage', payload: inputValue });
    dispatch(queryDocument(inputValue));
    setInputValue('');
  };

  return (
    <>
      <div className="chat-container">
        {messages.length === 0 && !documentUploaded && (
          <div style={{ margin: 'auto', textAlign: 'center', opacity: 0.5 }}>
            <Bot size={64} style={{ margin: '0 auto 16px', color: 'var(--accent-base)' }} />
            <h2>System Standby</h2>
            <p>Upload a document to initialize the AI agent.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role}`}>
            <div className={`message ${msg.role}`} style={{ display: 'flex', gap: '12px' }}>
              {msg.role === 'assistant' ? <Bot size={20} color="var(--accent-base)" style={{ flexShrink: 0, marginTop: '2px' }} /> : null}
              <div>
                <strong style={{ fontSize: '0.8rem', color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--accent-base)', display: 'block', marginBottom: '8px' }}>
                  {msg.role === 'user' ? 'You' : 'KnowledgeLens'}
                </strong>
                <div className="markdown-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isQuerying && (
          <div className="message-wrapper assistant">
            <div className="message assistant" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Bot size={20} color="var(--accent-base)" />
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <form onSubmit={handleSubmit} className="input-container glass-card">
          <input 
            type="text" 
            placeholder={documentUploaded ? "Ask a question about your document..." : "Upload a document to start asking questions..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!documentUploaded || isQuerying}
          />
          <button 
            type="submit" 
            className="send-btn" 
            disabled={!inputValue.trim() || !documentUploaded || isQuerying}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;
