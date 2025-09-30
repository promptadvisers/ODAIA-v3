import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'away' | 'offline';
  avatar?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Brand Manager',
    email: 'sarah.j@company.com',
    phone: '+1 (555) 123-4567',
    status: 'active'
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Medical Science Liaison',
    email: 'michael.c@company.com',
    phone: '+1 (555) 234-5678',
    status: 'active'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Sales Director',
    email: 'emily.r@company.com',
    phone: '+1 (555) 345-6789',
    status: 'away'
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Market Access Lead',
    email: 'david.k@company.com',
    phone: '+1 (555) 456-7890',
    status: 'active'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    role: 'Clinical Operations',
    email: 'lisa.t@company.com',
    phone: '+1 (555) 567-8901',
    status: 'offline'
  }
];

export const TeamScreen: React.FC = () => {
  return (
    <div style={{ 
      flex: 1,
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '1400px',
        padding: '24px'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            Team Members
          </h2>
          <p style={{ 
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            Manage and collaborate with your team members
          </p>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '20px'
        }}>
        {teamMembers.map((member) => (
          <div key={member.id} style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            padding: '16px'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>
                    {member.name}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    margin: 0
                  }}>
                    {member.role}
                  </p>
                </div>
              </div>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: member.status === 'active' ? 'var(--accent-green)' : 
                                member.status === 'away' ? 'var(--accent-yellow)' : 
                                'var(--text-muted)'
              }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {member.email}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {member.phone}
                </span>
              </div>
            </div>

            <div style={{ 
              display: 'flex',
              gap: '8px',
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <button style={{
                flex: 1,
                padding: '6px 12px',
                backgroundColor: 'var(--accent-blue)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                Message
              </button>
              <button style={{
                flex: 1,
                padding: '6px 12px',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                View Profile
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};