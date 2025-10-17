import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import { ChatMessage } from './ChatMessage';
import { PrePromptedButton } from './PrePromptedButton';
import { SuggestionCard } from '../SuggestionCard';
import { Send } from 'lucide-react';

export const ChatInterface: React.FC<{ activeTab?: string }> = ({ activeTab = 'brand' }) => {
  const {
    messages,
    prePrompts,
    suggestionCards,
    isTyping,
    isThinking,
    isExecutingTask,
    executingMessage,
    executeDemoStep,
    sendUserMessage,
    currentStep,
    generateSetupPrePrompts,
    currentActiveTab,
    setCurrentActiveTab
  } = useChatStore();
  const [inputValue, setInputValue] = React.useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, prePrompts, suggestionCards]);

  // Update current active tab and generate appropriate prompts
  useEffect(() => {
    if (activeTab === currentActiveTab) {
      return;
    }

    setCurrentActiveTab(activeTab);

    if (activeTab === 'setup') {
      generateSetupPrePrompts();
    }

    if (activeTab === 'brand' && currentStep === 0 && messages.length === 0) {
      setTimeout(() => {
        executeDemoStep(0);
      }, 1000);
    }
  }, [activeTab, currentActiveTab, currentStep, executeDemoStep, generateSetupPrePrompts, messages.length, setCurrentActiveTab]);

  // Start the demo on first load (Brand tab)
  useEffect(() => {
    if (activeTab === 'brand' && currentStep === 0 && messages.length === 0) {
      setTimeout(() => {
        executeDemoStep(0);
      }, 1000);
    }
  }, []);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'transparent'
    }}>
      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 0',
          marginBottom: '16px',
          minHeight: 0
        }}
      >
        {/* Show messages */}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {/* Executing task indicator */}
        {isExecutingTask && (
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '2px solid #10b981',
                borderTop: '2px solid transparent',
                animation: 'spin 1.5s linear infinite',
                opacity: 0.3
              }} />
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                style={{ zIndex: 1 }}
              >
                <path 
                  d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                  style={{
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
              </svg>
            </div>
            <div style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flex: 1,
              maxWidth: 'fit-content'
            }}>
              <div style={{ display: 'flex', gap: '3px' }}>
                <div style={{
                  width: '3px',
                  height: '12px',
                  backgroundColor: '#10b981',
                  borderRadius: '2px',
                  animation: 'wave 1.2s ease-in-out infinite'
                }} />
                <div style={{
                  width: '3px',
                  height: '12px',
                  backgroundColor: '#10b981',
                  borderRadius: '2px',
                  animation: 'wave 1.2s ease-in-out infinite',
                  animationDelay: '0.1s'
                }} />
                <div style={{
                  width: '3px',
                  height: '12px',
                  backgroundColor: '#10b981',
                  borderRadius: '2px',
                  animation: 'wave 1.2s ease-in-out infinite',
                  animationDelay: '0.2s'
                }} />
                <div style={{
                  width: '3px',
                  height: '12px',
                  backgroundColor: '#10b981',
                  borderRadius: '2px',
                  animation: 'wave 1.2s ease-in-out infinite',
                  animationDelay: '0.3s'
                }} />
              </div>
              <span style={{
                fontSize: '13px',
                color: 'var(--text-primary)',
                fontWeight: '500',
                letterSpacing: '0.2px'
              }}>
                {executingMessage || 'Executing task...'}
              </span>
            </div>
          </div>
        )}
        
        {/* Thinking indicator */}
        {isThinking && !isExecutingTask && (
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{
                fontSize: '12px',
                color: '#ffffff',
                fontWeight: '600'
              }}>
                AI
              </span>
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              fontStyle: 'italic'
            }}>
              Agent is thinking...
            </div>
          </div>
        )}
        
        {/* Typing indicator */}
        {isTyping && !isExecutingTask && !isThinking && (
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <span style={{
                fontSize: '12px',
                color: '#ffffff',
                fontWeight: '600'
              }}>
                AI
              </span>
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: 'var(--bg-input)',
              borderRadius: '8px',
              display: 'flex',
              gap: '4px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#64748b',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#64748b',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: '0.2s'
              }} />
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#64748b',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: '0.4s'
              }} />
            </div>
          </div>
        )}
        
        {/* Suggestion Cards */}
        {suggestionCards.length > 0 && !isTyping && !isThinking && (
          <div style={{
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {suggestionCards.map((card) => (
              <SuggestionCard key={card.id} card={card} />
            ))}
          </div>
        )}

        {/* Pre-prompted buttons */}
        {prePrompts.length > 0 && !isTyping && !isThinking && (
          <div style={{
            marginTop: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {prePrompts.map((prompt) => (
              <div key={prompt.id} style={{ flex: '0 0 auto', maxWidth: '100%' }}>
                <PrePromptedButton prompt={prompt} />
              </div>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area - Always visible */}
      <div style={{
        backgroundColor: 'var(--bg-input)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        padding: '12px',
        position: 'relative',
        marginTop: 'auto'
      }}>
          <textarea
          placeholder="Ask Agent"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
              e.preventDefault();
              sendUserMessage(inputValue.trim());
              setInputValue('');
            }
          }}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            fontSize: '13px',
            resize: 'none',
            border: 'none',
            outline: 'none',
            minHeight: '60px',
            fontFamily: 'inherit'
          }}
          rows={3}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '8px'
        }}>
            <button
            disabled={!inputValue.trim()}
            onClick={() => {
              if (inputValue.trim()) {
                sendUserMessage(inputValue.trim());
                setInputValue('');
              }
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '500',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              opacity: inputValue.trim() ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={14} />
            Send
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes wave {
          0%, 100% {
            transform: scaleY(0.5);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};