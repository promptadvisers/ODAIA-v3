import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportSection {
  title: string;
  items: Array<{
    label: string;
    value: string;
    status?: 'Medium' | 'Most Often';
  }>;
}

interface FinalReportViewProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  data?: any;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({ 
  isOpen, 
  onClose, 
  onApprove 
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['curation', 'bucket']));

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

  // Mock chart data matching the screenshot
  const chartData = [
    { name: 'A', value: 35 },
    { name: 'B', value: 42 },
    { name: 'C', value: 28 },
    { name: 'D', value: 45 }
  ];

  // Pharmaceutical-specific report sections matching screenshots
  const reportSections: ReportSection[] = [
    {
      title: 'Curation Signals',
      items: [
        { label: 'Nearby Anchor', value: 'Medium' },
        { label: 'Include upcoming appointments in curation', value: '' }
      ]
    },
    {
      title: 'Nearby Anchor Signal',
      items: [
        { label: 'Specifies how HCPs with recent touchpoints are curated for the next call', value: '' }
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
        { label: 'PowerScore by Segment', value: 'Medium' },
        { label: 'Segment Scores Signal', value: '' }
      ]
    },
    {
      title: 'Segment Scores Signal',
      items: [
        { label: 'Starters', value: 'Medium' },
        { label: 'Shrinkers', value: '' },
        { label: 'Switch-In', value: '' },
        { label: 'Switch-Out', value: '' },
        { label: 'Believers', value: '' },
        { label: 'Reverters', value: '' },
        { label: 'Medium', value: '' }
      ]
    },
    {
      title: 'Event Activity Signal',
      items: [
        { label: 'Allow attribution to override preset impact', value: '' },
        { label: 'Phone Call', value: 'Medium' },
        { label: 'Email Opened', value: 'Medium' },
        { label: 'Website Search', value: 'Medium' },
        { label: 'Event Attendance', value: 'Medium' },
        { label: 'Request a Rep', value: 'Medium' },
        { label: 'Lorem ipsum', value: 'Medium' }
      ]
    },
    {
      title: 'Upcoming Appointments Signal',
      items: [
        { label: 'Include upcoming appointments in curation', value: '' }
      ]
    }
  ];

  const bucketConfigs = [
    {
      title: 'Bucket Configs',
      subtitle: 'Maximum List Size: 10% HCPs',
      configs: [
        { label: 'Bucket Size: 10%', frequency: 'Most Often', note: 'Never' },
        { label: 'Relative Frequency', frequency: '', note: 'Estimated Frequency: Every 4 weeks' },
        { label: 'Overflow Bucket Configs', frequency: '', note: '' }
      ]
    },
    {
      title: 'Overflow Bucket Configs',
      subtitle: '',
      configs: [
        { label: 'Bucket Size: 10%', frequency: 'Most Often', note: '' },
        { label: 'Relative Frequency', frequency: '', note: 'Estimated Frequency: Every 8 weeks' }
      ]
    }
  ];

  const specialtiesSegments = {
    specialties: [
      'Specialty A', 'Specialty B', 'Specialty C', 'Specialty D', 
      'Specialty E', 'Specialty F', 'Specialty G', 'Specialty H'
    ],
    segments: [
      'Segment A', 'Segment B', 'Segment C', 
      'Segment D', 'Segment E', 'Segment F', 
      'Segment G', 'Segment H', 'Segment I'
    ]
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: '#1a1f2e',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #2a3441',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
              ←
            </button>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#ffffff',
              margin: 0
            }}>
              Value Engine: HCP Targeting Report Option 1
            </h2>
            <Badge variant="warning">Review</Badge>
          </div>
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
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {/* Chart Section */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff',
              marginBottom: '16px'
            }}>
              PowerScore by Segment
            </h3>
            <div style={{ width: '100%', height: '200px', marginBottom: '24px' }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a3441" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                    domain={[0, 50]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#0f1419',
                      border: '1px solid #2a3441',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Metrics Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {[
                { label: 'Current Value', value: '70%', desc: 'Current value of an HCP based on historical writing of Odaiazol' },
                { label: 'Potential', value: '30%', desc: 'Potential based on HCPs competitive writing and patient mix' },
                { label: 'Competitive Strategy', value: '80%', items: [
                  '90%: Odaiazol, Breast Cancer, HRE2+ 2L Therapy, XPO TRx',
                  '10% OncoThera Copay Card PSP Claims'
                ]},
                { label: 'Patient Mix', value: '20%', items: [
                  '20% 1L Therapy HER+ Market, XPO TRx',
                  '80% Payer mix, Medicaid, Medicare'
                ]}
              ].map((metric, idx) => (
                <div key={idx}>
                  <h4 style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    marginBottom: '8px',
                    fontWeight: '400'
                  }}>
                    {metric.label}: {metric.value}
                  </h4>
                  {metric.desc && (
                    <p style={{
                      fontSize: '11px',
                      color: '#64748b',
                      lineHeight: '1.4'
                    }}>
                      {metric.desc}
                    </p>
                  )}
                  {metric.items && (
                    <ul style={{
                      fontSize: '11px',
                      color: '#64748b',
                      lineHeight: '1.4',
                      paddingLeft: '16px',
                      margin: '4px 0 0 0'
                    }}>
                      {metric.items.map((item, i) => (
                        <li key={i} style={{ marginBottom: '2px' }}>✓ {item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Sections */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* Left Column - Signals */}
            <div>
              {reportSections.map((section, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#0f1419',
                  border: '1px solid #2a3441',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => toggleSection(section.title)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#1a1f2e',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#ffffff'
                    }}>
                      {section.title}
                    </span>
                    <span style={{ color: '#64748b' }}>
                      {expandedSections.has(section.title) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>
                  
                  {expandedSections.has(section.title) && (
                    <div style={{ padding: '12px 16px' }}>
                      {section.items.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            color: item.value ? '#ffffff' : '#64748b'
                          }}>
                            {item.value ? '● ' : '○ '}{item.label}
                          </span>
                          {item.value && (
                            <span style={{
                              fontSize: '11px',
                              color: '#94a3b8',
                              backgroundColor: '#1a1f2e',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              {item.value}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column - Bucket Configs & Segments */}
            <div>
              {/* Bucket Configs */}
              {bucketConfigs.map((bucket, idx) => (
                <div key={idx} style={{
                  backgroundColor: '#0f1419',
                  border: '1px solid #2a3441',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  padding: '16px'
                }}>
                  <h4 style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#ffffff',
                    marginBottom: '4px'
                  }}>
                    {bucket.title}
                  </h4>
                  <p style={{
                    fontSize: '11px',
                    color: '#64748b',
                    marginBottom: '12px'
                  }}>
                    {bucket.subtitle}
                  </p>
                  {bucket.configs.map((config, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontSize: '12px', color: '#ffffff' }}>
                          {config.label}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          backgroundColor: '#1a1f2e',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {config.frequency}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {config.note}
                      </div>
                    </div>
                  ))}
                  {idx === 0 && (
                    <div style={{
                      marginTop: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <input type="checkbox" defaultChecked />
                      <span style={{ fontSize: '12px', color: '#ffffff' }}>
                        Assign 0 PowerScore HCPs to overflow bucket
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Specialties & Segments */}
              <div style={{
                backgroundColor: '#0f1419',
                border: '1px solid #2a3441',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#ffffff',
                  marginBottom: '12px'
                }}>
                  Specialties & Segments
                </h4>
                
                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    marginBottom: '8px'
                  }}>
                    Specialties
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px'
                  }}>
                    {specialtiesSegments.specialties.map((spec, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <input type="checkbox" defaultChecked={i < 3} />
                        <span style={{ fontSize: '11px', color: '#ffffff' }}>
                          {spec}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    marginBottom: '8px'
                  }}>
                    Segments
                  </h5>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px'
                  }}>
                    {specialtiesSegments.segments.map((seg, i) => (
                      <span key={i} style={{
                        fontSize: '11px',
                        color: '#64748b'
                      }}>
                        {seg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid #2a3441',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onApprove}
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
              Approve
            </button>
            <button
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
              Edit
            </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};