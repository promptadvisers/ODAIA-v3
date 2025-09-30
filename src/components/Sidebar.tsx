import React from 'react';
import { Users, FileText, Settings, User, Plus, Edit2 } from 'lucide-react';
import odaiaLogo from '../assets/odaia.png';

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  onLogoClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, onLogoClick }) => {
  const menuItems = [
    { icon: Users, label: 'Team', id: 'team' },
    { icon: FileText, label: 'Documents', id: 'documents' },
    { icon: Settings, label: 'Settings', id: 'settings' },
    { icon: User, label: 'Profile', id: 'profile' }
  ];
  
  const handleMainDashboardClick = () => {
    // Clear the active section to go back to main dashboard
    onSectionChange?.('');
    // Call the logo click handler if provided
    onLogoClick?.();
  };

  return (
    <div 
      style={{ 
        width: '50px',
        backgroundColor: 'var(--bg-main)',
        borderRight: '1px solid var(--border-subtle)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '12px',
        paddingBottom: '12px'
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={handleMainDashboardClick}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
          title="Go to Dashboard"
        >
          <img 
            src={odaiaLogo}
            alt="ODAIA Logo"
            style={{
              width: '32px',
              height: '32px',
              objectFit: 'contain'
            }}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange?.(item.id)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'none'
            }}
            title={item.label}
          >
            <item.icon 
              style={{ 
                width: '20px',
                height: '20px',
                color: activeSection === item.id ? 'var(--text-primary)' : 'var(--text-muted)',
                strokeWidth: activeSection === item.id ? 2 : 1.5
              }} 
            />
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
        <button 
          onClick={handleMainDashboardClick}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="New Chat"
        >
          <Plus style={{ width: '20px', height: '20px', color: 'var(--text-muted)', strokeWidth: 1.5 }} />
        </button>
        <button 
          onClick={handleMainDashboardClick}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Edit Chat"
        >
          <Edit2 style={{ width: '20px', height: '20px', color: 'var(--text-muted)', strokeWidth: 1.5 }} />
        </button>
      </div>
    </div>
  );
};