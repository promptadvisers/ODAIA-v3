import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface ConfigSection {
  title: string;
  items: Array<{
    label: string;
    value: 'Low' | 'Medium' | 'High' | '';
    hasCheckbox?: boolean;
  }>;
}

interface EditConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (config: any) => void;
}

export const EditConfigurationModal: React.FC<EditConfigurationModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['curation', 'reach', 'power', 'segment', 'event']));
  const [config, setConfig] = useState<ConfigSection[]>([
    {
      title: 'Curation Signals',
      items: [
        { label: 'Nearby Anchor', value: 'Medium' },
        { label: 'Include upcoming appointments in curation', value: '', hasCheckbox: true }
      ]
    },
    {
      title: 'Reach and Frequency Signals',
      items: [
        { label: 'Last 7 days', value: 'Medium' },
        { label: 'Last month', value: 'Medium' },
        { label: 'Last Quarter', value: 'Medium' }
      ]
    },
    {
      title: 'PowerScore Signal',
      items: [
        { label: 'PowerScore (HCP Overall)', value: 'Medium' },
        { label: 'PowerScore by Segment', value: 'Medium' }
      ]
    },
    {
      title: 'Segment Scores Signal',
      items: [
        { label: 'Starters', value: 'Medium' },
        { label: 'Shrinkers', value: 'Low' },
        { label: 'Switch-In', value: 'High' },
        { label: 'Switch-Out', value: 'Low' },
        { label: 'Believers', value: 'High' },
        { label: 'Reverters', value: 'Medium' }
      ]
    },
    {
      title: 'Event Activity Signal',
      items: [
        { label: 'Allow attribution to override preset impact', value: '', hasCheckbox: true },
        { label: 'Phone Call', value: 'Medium' },
        { label: 'Email Opened', value: 'Medium' },
        { label: 'Website Search', value: 'High' },
        { label: 'Event Attendance', value: 'High' },
        { label: 'Request a Rep', value: 'High' }
      ]
    }
  ]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateValue = (sectionIndex: number, itemIndex: number, newValue: string) => {
    const newConfig = [...config];
    newConfig[sectionIndex].items[itemIndex].value = newValue as any;
    setConfig(newConfig);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(config);
    }
    onClose();
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(4px)'
      }}>
      <div style={{
        backgroundColor: '#1a1f2e',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          backgroundColor: '#1a2332',
          borderBottom: '1px solid #2a3441',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '500',
            color: '#ffffff',
            margin: 0
          }}>
            Edit Configuration Parameters
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          padding: '24px'
        }}>
          {config.map((section, sectionIndex) => {
            const sectionKey = section.title.toLowerCase().split(' ')[0];
            const isExpanded = expandedSections.has(sectionKey);
            
            return (
              <div key={sectionIndex} style={{ marginBottom: '24px' }}>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleSection(sectionKey)}
                >
                  <h3 style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#ffffff',
                    margin: 0
                  }}>
                    {section.title}
                  </h3>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                
                {isExpanded && (
                  <div style={{
                    backgroundColor: '#1a2332',
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 0',
                        borderBottom: itemIndex < section.items.length - 1 ? '1px solid #2a3441' : 'none'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {item.hasCheckbox && (
                            <input 
                              type="checkbox"
                              style={{
                                width: '16px',
                                height: '16px',
                                accentColor: '#3b82f6'
                              }}
                            />
                          )}
                          <span style={{
                            fontSize: '13px',
                            color: '#94a3b8'
                          }}>
                            {item.label}
                          </span>
                        </div>
                        
                        {!item.hasCheckbox && (
                          <select
                            value={item.value}
                            onChange={(e) => updateValue(sectionIndex, itemIndex, e.target.value)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#0a0d12',
                              border: '1px solid #2a3441',
                              borderRadius: '4px',
                              color: '#ffffff',
                              fontSize: '12px',
                              cursor: 'pointer',
                              minWidth: '100px'
                            }}
                          >
                            <option value="">Select</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #2a3441',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              backgroundColor: 'transparent',
              border: '1px solid #2a3441',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 24px',
              backgroundColor: '#3b82f6',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};