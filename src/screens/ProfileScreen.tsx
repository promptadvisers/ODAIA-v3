import React from 'react';
import { Mail, Phone, Briefcase, MapPin, Calendar, Award } from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const userProfile = {
    name: 'Alexandra Martinez',
    role: 'Senior Brand Strategy Manager',
    email: 'alex.martinez@pharmacompany.com',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    department: 'Oncology Division',
    joinDate: 'March 2021',
    achievements: [
      'Q3 2024 Top Performer',
      'Brand Launch Excellence Award',
      'Cross-functional Leadership'
    ]
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '8px'
        }}>
          Profile
        </h2>
        <p style={{ 
          fontSize: '13px',
          color: 'var(--text-secondary)'
        }}>
          Manage your personal information and preferences
        </p>
      </div>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '20px'
      }}>
        {/* Profile Card */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '36px',
            fontWeight: '600',
            margin: '0 auto 20px'
          }}>
            {userProfile.name.split(' ').map(n => n[0]).join('')}
          </div>

          <h3 style={{
            fontSize: '18px',
            fontWeight: '500',
            color: 'var(--text-primary)',
            margin: 0,
            marginBottom: '4px'
          }}>
            {userProfile.name}
          </h3>
          
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: 0,
            marginBottom: '20px'
          }}>
            {userProfile.role}
          </p>

          <button style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'var(--accent-blue)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '8px'
          }}>
            Edit Profile
          </button>

          <button style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer'
          }}>
            Change Password
          </button>
        </div>

        {/* Information Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Contact Information */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            padding: '20px'
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: '16px'
            }}>
              Contact Information
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {userProfile.email}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {userProfile.phone}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {userProfile.location}
                </span>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            padding: '20px'
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: '16px'
            }}>
              Work Information
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Briefcase style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {userProfile.department}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Calendar style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Joined {userProfile.joinDate}
                </span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            padding: '20px'
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              margin: 0,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Award style={{ width: '18px', height: '18px', color: 'var(--accent-yellow)' }} />
              Achievements
            </h4>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {userProfile.achievements.map((achievement, index) => (
                <span key={index} style={{
                  padding: '6px 12px',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: '500',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};