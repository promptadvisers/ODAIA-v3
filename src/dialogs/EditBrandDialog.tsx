import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../store/appStore';

interface EditBrandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemKey: keyof BrandConfig | null;
}

type BrandConfig = {
  brand: {
    status: 'Ready' | 'Missing info' | 'Pending';
    tags: string[];
    description: string;
    approved: boolean;
  };
  brandAccess: {
    status: 'Ready' | 'Missing info' | 'Pending';
    pspProgram: string;
    finicalSupport: string;
    webPortal: string;
    marketAccess: string;
    approved: boolean;
  };
  salesGoals: {
    status: 'Ready' | 'Missing info' | 'Pending';
    approved: boolean;
  };
  competitiveLandscape: {
    status: 'Ready' | 'Missing info' | 'Pending';
    tags?: string[];
    description?: string;
    approved: boolean;
  };
};

export const EditBrandDialog: React.FC<EditBrandDialogProps> = ({ isOpen, onClose, itemKey }) => {
  const { brandConfig, updateBrandItem } = useAppStore();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (itemKey && brandConfig && itemKey in brandConfig) {
      setFormData({ ...(brandConfig as any)[itemKey] });
    }
  }, [itemKey, brandConfig, isOpen]);

  if (!isOpen || !itemKey) return null;

  const handleSave = () => {
    updateBrandItem(itemKey as keyof BrandConfig, formData);
    onClose();
  };

  const renderFormFields = () => {
    switch (itemKey) {
      case 'brand':
        return (
          <>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  resize: 'vertical'
                }}
              />
            </div>
          </>
        );
      
      case 'brandAccess':
        return (
          <>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                PSP Program
              </label>
              <input
                type="text"
                value={formData.pspProgram || ''}
                onChange={(e) => setFormData({ ...formData, pspProgram: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Financial Support
              </label>
              <input
                type="text"
                value={formData.finicalSupport || ''}
                onChange={(e) => setFormData({ ...formData, finicalSupport: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Web Portal
              </label>
              <input
                type="text"
                value={formData.webPortal || ''}
                onChange={(e) => setFormData({ ...formData, webPortal: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
            </div>
          </>
        );

      case 'salesGoals':
        return (
          <>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Sales Goals Configuration
              </label>
              <textarea
                placeholder="Enter sales goals and metrics..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  resize: 'vertical'
                }}
              />
            </div>
          </>
        );

      case 'competitiveLandscape':
        return (
          <>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Competitors (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Landscape Analysis
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  resize: 'vertical'
                }}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (itemKey) {
      case 'brand': return 'Edit Brand';
      case 'brandAccess': return 'Edit Brand Access Strategy';
      case 'salesGoals': return 'Edit Sales Goals';
      case 'competitiveLandscape': return 'Edit Competitive Landscape';
      default: return 'Edit';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          animation: 'fadeIn 200ms'
        }}
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--bg-modal)',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '90%',
          maxWidth: '500px',
          zIndex: 1001,
          animation: 'slideIn 200ms'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background-color 200ms'
            }}
          >
            <X style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
          </button>
        </div>
        
        {/* Content */}
        <div style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {renderFormFields()}
        </div>
        
        {/* Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 200ms'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--accent-blue)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'opacity 200ms'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
};