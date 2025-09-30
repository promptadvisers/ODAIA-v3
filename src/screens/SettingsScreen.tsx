import React from 'react';
import { Moon, Sun, Bell, Lock, Database } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useAppStore();

  const settingSections = [
    {
      title: 'Appearance',
      icon: Sun,
      settings: [
        {
          name: 'Theme',
          description: 'Toggle between light and dark mode',
          control: (
            <button
              onClick={toggleTheme}
              style={{
                padding: '6px 12px',
                backgroundColor: 'var(--accent-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          )
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          name: 'Email Notifications',
          description: 'Receive email updates about important changes',
          control: <ToggleSwitch defaultChecked={true} />
        },
        {
          name: 'Browser Notifications',
          description: 'Show desktop notifications for real-time updates',
          control: <ToggleSwitch defaultChecked={false} />
        }
      ]
    },
    {
      title: 'Security',
      icon: Lock,
      settings: [
        {
          name: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          control: <ToggleSwitch defaultChecked={false} />
        },
        {
          name: 'Session Timeout',
          description: 'Automatically log out after 30 minutes of inactivity',
          control: <ToggleSwitch defaultChecked={true} />
        }
      ]
    },
    {
      title: 'Data & Analytics',
      icon: Database,
      settings: [
        {
          name: 'Auto-sync Data',
          description: 'Automatically sync data every 15 minutes',
          control: <ToggleSwitch defaultChecked={true} />
        },
        {
          name: 'Export Analytics',
          description: 'Allow exporting analytics data to CSV',
          control: <ToggleSwitch defaultChecked={true} />
        }
      ]
    }
  ];

  return (
    <div style={{ 
      flex: 1,
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '900px',
        padding: '24px'
      }}>
        <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          Settings
        </h2>
        <p style={{ 
          fontSize: '13px',
          color: 'var(--text-secondary)'
        }}>
          Manage your application preferences and configuration
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {settingSections.map((section, index) => (
          <div key={index} style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            padding: '20px'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <section.icon style={{ 
                width: '20px',
                height: '20px',
                color: 'var(--accent-blue)'
              }} />
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                {section.title}
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {section.settings.map((setting, settingIndex) => (
                <div key={settingIndex} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: settingIndex < section.settings.length - 1 ? '16px' : '0',
                  borderBottom: settingIndex < section.settings.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      fontWeight: '400',
                      margin: 0,
                      marginBottom: '4px'
                    }}>
                      {setting.name}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      margin: 0
                    }}>
                      {setting.description}
                    </p>
                  </div>
                  <div>
                    {setting.control}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

const ToggleSwitch: React.FC<{ defaultChecked?: boolean }> = ({ defaultChecked = false }) => {
  const [checked, setChecked] = React.useState(defaultChecked);

  return (
    <button
      onClick={() => setChecked(!checked)}
      style={{
        width: '44px',
        height: '24px',
        backgroundColor: checked ? 'var(--accent-blue)' : 'var(--border-primary)',
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color 200ms'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '2px',
        left: checked ? '22px' : '2px',
        width: '20px',
        height: '20px',
        backgroundColor: 'white',
        borderRadius: '50%',
        transition: 'left 200ms'
      }} />
    </button>
  );
};