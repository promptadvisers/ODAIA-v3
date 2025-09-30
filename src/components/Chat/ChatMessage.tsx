import React from 'react';
import type { ChatMessage as ChatMessageType } from '../../store/chatStore';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAgent = message.type === 'agent';
  
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      marginBottom: '16px',
      alignItems: 'flex-start'
    }}>
      {/* Avatar */}
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        backgroundColor: isAgent ? '#3b82f6' : '#64748b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: '2px'
      }}>
        <span style={{
          fontSize: '12px',
          color: '#ffffff',
          fontWeight: '600'
        }}>
          {isAgent ? 'AI' : 'U'}
        </span>
      </div>
      
      {/* Message Content */}
      <div style={{
        flex: 1,
        minWidth: 0
      }}>
        <div style={{
          fontSize: '11px',
          color: '#64748b',
          marginBottom: '4px'
        }}>
          {isAgent ? 'Agent' : 'You'}
        </div>
        <div style={{
          fontSize: '13px',
          color: 'var(--text-primary)',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {message.content.split('\n').map((line, idx) => {
            // Handle bold text
            if (line.startsWith('**') && line.endsWith('**')) {
              return (
                <div key={idx} style={{ 
                  fontWeight: '600',
                  marginTop: idx > 0 ? '8px' : '0',
                  marginBottom: '4px'
                }}>
                  {line.slice(2, -2)}
                </div>
              );
            }
            // Handle bullet points
            if (line.startsWith('•')) {
              return (
                <div key={idx} style={{ 
                  paddingLeft: '16px',
                  marginBottom: '2px'
                }}>
                  {line}
                </div>
              );
            }
            // Regular text
            return line ? (
              <div key={idx} style={{ marginBottom: '4px' }}>
                {line}
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};