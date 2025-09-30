import React, { useState } from 'react';
import { X, ChevronLeft, Check } from 'lucide-react';
import { useAppStore } from '../store/appStore';

interface BrandAccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandAccessDialog: React.FC<BrandAccessDialogProps> = ({ isOpen, onClose }) => {
  const { updateBrandAccess, brandConfig } = useAppStore();
  const [formData, setFormData] = useState({
    pspProgram: brandConfig.brandAccess.pspProgram || 'OncoConnect PSP',
    finicalSupport: brandConfig.brandAccess.finicalSupport || 'OncoThera Copay Card',
    webPortal: brandConfig.brandAccess.webPortal || '',
    marketAccess: brandConfig.brandAccess.marketAccess || ''
  });

  const handleSubmit = () => {
    updateBrandAccess({
      ...formData,
      status: formData.webPortal && formData.marketAccess ? 'Ready' : 'Missing info'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        width: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ChevronLeft 
              style={{ 
                width: '20px', 
                height: '20px', 
                color: 'var(--text-muted)', 
                cursor: 'pointer' 
              }}
              onClick={onClose}
            />
            <h2 style={{
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Brand Access Strategy
            </h2>
            <span style={{
              padding: '4px 12px',
              backgroundColor: 'var(--accent-yellow)',
              color: 'white',
              fontSize: '11px',
              fontWeight: '600',
              borderRadius: '6px'
            }}>
              Missing info
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Check 
              style={{ 
                width: '20px', 
                height: '20px', 
                color: 'var(--text-muted)', 
                cursor: 'pointer' 
              }}
            />
            <X 
              style={{ 
                width: '20px', 
                height: '20px', 
                color: 'var(--text-muted)', 
                cursor: 'pointer' 
              }}
              onClick={onClose}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* PSP Program */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)', 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              PSP Program
            </label>
            <input
              type="text"
              value={formData.pspProgram}
              onChange={(e) => setFormData({...formData, pspProgram: e.target.value})}
              placeholder="OncoConnect PSP"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Finical Support */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)', 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Finical Support
            </label>
            <input
              type="text"
              value={formData.finicalSupport}
              onChange={(e) => setFormData({...formData, finicalSupport: e.target.value})}
              placeholder="OncoThera Copay Card"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          {/* Web Portal */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              fontSize: '12px', 
              color: formData.webPortal ? 'var(--text-secondary)' : '#ef4444', 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Web Portal
            </label>
            <div style={{ position: 'relative' }}>
              {!formData.webPortal && (
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#ef4444',
                  fontWeight: 'bold',
                  backgroundColor: 'transparent',
                  zIndex: 1
                }}>
                  !
                </span>
              )}
              <input
                type="text"
                value={formData.webPortal}
                onChange={(e) => setFormData({...formData, webPortal: e.target.value})}
                placeholder="None"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  paddingLeft: !formData.webPortal ? '36px' : '12px',
                  backgroundColor: 'var(--bg-input)',
                  border: `1px solid ${formData.webPortal ? 'var(--border-subtle)' : '#ef4444'}`,
                  borderRadius: '6px',
                  color: formData.webPortal ? 'var(--text-primary)' : '#ef4444',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Market Access */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ 
              fontSize: '12px', 
              color: formData.marketAccess ? 'var(--text-secondary)' : '#ef4444', 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Market Access
            </label>
            <div style={{ position: 'relative' }}>
              {!formData.marketAccess && (
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#ef4444',
                  fontWeight: 'bold',
                  backgroundColor: 'transparent',
                  zIndex: 1
                }}>
                  !
                </span>
              )}
              <input
                type="text"
                value={formData.marketAccess}
                onChange={(e) => setFormData({...formData, marketAccess: e.target.value})}
                placeholder="None"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  paddingLeft: !formData.marketAccess ? '36px' : '12px',
                  backgroundColor: 'var(--bg-input)',
                  border: `1px solid ${formData.marketAccess ? 'var(--border-subtle)' : '#ef4444'}`,
                  borderRadius: '6px',
                  color: formData.marketAccess ? 'var(--text-primary)' : '#ef4444',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--accent-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Done
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};