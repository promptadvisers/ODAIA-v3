import React, { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore } from '../store/appStore';

// Mock HCP data
const generateMockHCPs = (count: number) => {
  const names = ['Crystal Ball', 'Meridith Kvyst', 'George Smith', 'Samantha White', 'Alexander Lee', 'Olivia Johnson', 'Ethan Brown'];
  const specialties = ['Odaiazol Adopter', 'Odaiazol Expert', 'Lorem ipsum'];
  const segments = ['near_term_shrinker', 'growers', 'Lorem ipsum', 'Odaiazol...'];

  return Array.from({ length: count }, (_, i) => ({
    id: 47248002 + i,
    name: names[i % names.length],
    powerScore: 10 - Math.floor(i / 5),
    specialty: specialties[i % specialties.length],
    segment: segments[i % segments.length]
  }));
};

export const CurationAdvancedConfigDialog: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const isOpen = activeModal === 'curation-edit';

  const [nearbyAnchor, setNearbyAnchor] = useState(true);
  const [nearbyAnchorLevel, setNearbyAnchorLevel] = useState('Medium');
  const [powerScore, setPowerScore] = useState(true);
  const [powerScoreLevel, setPowerScoreLevel] = useState('Medium');
  
  const [last7Days, setLast7Days] = useState(true);
  const [last7DaysLevel, setLast7DaysLevel] = useState('Medium');
  const [lastMonth, setLastMonth] = useState(true);
  const [lastMonthLevel, setLastMonthLevel] = useState('Medium');
  const [lastQuarter, setLastQuarter] = useState(true);
  const [lastQuarterLevel, setLastQuarterLevel] = useState('Medium');
  
  const [starters, setStarters] = useState(true);
  const [startersLevel, setStartersLevel] = useState('Medium');
  
  const [bucketASize, setBucketASize] = useState('50');
  const [bucketBSize, setBucketBSize] = useState('25');
  const [bucketCSize, setBucketCSize] = useState('15');
  
  const [selectedRegion, setSelectedRegion] = useState('median-65');

  // Generate HCP lists based on selected region
  const allHCPsCount = selectedRegion === 'median-100' ? 100 : 65;
  const mockHCPsAll = useMemo(() => generateMockHCPs(allHCPsCount), [allHCPsCount]);

  // Calculate curated list size based on bucket percentages
  const curatedListSize = useMemo(() => {
    const bucketA = parseInt(bucketASize) || 0;
    const bucketB = parseInt(bucketBSize) || 0;
    const bucketC = parseInt(bucketCSize) || 0;
    const totalPercentage = Math.min(100, bucketA + bucketB + bucketC);
    return Math.round((totalPercentage / 100) * 30); // Max 30 HCPs
  }, [bucketASize, bucketBSize, bucketCSize]);

  // Filter curated HCPs based on active signals
  const mockHCPsCurated = useMemo(() => {
    let baseHCPs = generateMockHCPs(100);

    // Filter by PowerScore if enabled
    if (powerScore) {
      const minScore = powerScoreLevel === 'High' ? 8 : powerScoreLevel === 'Medium' ? 6 : 4;
      baseHCPs = baseHCPs.filter(hcp => hcp.powerScore >= minScore);
    }

    // Filter by Nearby Anchor if enabled
    if (nearbyAnchor && nearbyAnchorLevel === 'High') {
      baseHCPs = baseHCPs.filter((_, i) => i % 2 === 0); // Simulate filtering
    }

    // Filter by time-based signals
    const activeTimeSignals = [last7Days, lastMonth, lastQuarter].filter(Boolean).length;
    if (activeTimeSignals > 0) {
      baseHCPs = baseHCPs.slice(0, Math.max(10, baseHCPs.length - (3 - activeTimeSignals) * 5));
    }

    // Filter by segment scores
    if (starters && startersLevel === 'High') {
      baseHCPs = baseHCPs.filter(hcp => hcp.segment === 'growers' || hcp.segment === 'near_term_shrinker');
    }

    // Return the calculated number of HCPs
    return baseHCPs.slice(0, Math.max(1, curatedListSize));
  }, [nearbyAnchor, nearbyAnchorLevel, powerScore, powerScoreLevel, last7Days, lastMonth, lastQuarter, starters, startersLevel, curatedListSize]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && setActiveModal(null)}>
      <Dialog.Portal>
        <Dialog.Overlay style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000
        }} />
        <Dialog.Content style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--bg-modal)',
          borderRadius: '12px',
          padding: 0,
          width: '95vw',
          maxWidth: '1400px',
          height: '90vh',
          zIndex: 1001,
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Dialog.Title style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Curation Configuration / [Product Line] Configs
            </Dialog.Title>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setActiveModal(null)}>
                Save Configs
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left Panel - Controls */}
            <div style={{
              width: '400px',
              borderRight: '1px solid var(--border-subtle)',
              overflow: 'auto',
              padding: '20px'
            }}>
              
              {/* Curation Signals */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '16px',
                  letterSpacing: '-0.01em'
                }}>
                  Curation Signals
                </h3>
                
                {/* Nearby Anchor */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={nearbyAnchor}
                        onChange={(e) => setNearbyAnchor(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      Nearby Anchor
                    </label>
                    <select
                      value={nearbyAnchorLevel}
                      onChange={(e) => setNearbyAnchorLevel(e.target.value)}
                      disabled={!nearbyAnchor}
                      style={{
                        padding: '6px 10px',
                        fontSize: '11px',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                {/* PowerScore */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={powerScore}
                        onChange={(e) => setPowerScore(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      PowerScore
                    </label>
                    <select
                      value={powerScoreLevel}
                      onChange={(e) => setPowerScoreLevel(e.target.value)}
                      disabled={!powerScore}
                      style={{
                        padding: '6px 10px',
                        fontSize: '11px',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                {/* Reach and Frequency */}
                <h4 style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  marginTop: '20px',
                  letterSpacing: '-0.01em'
                }}>
                  Reach and Frequency Signals
                </h4>

                {[
                  { label: 'Last 7 days', checked: last7Days, setChecked: setLast7Days, level: last7DaysLevel, setLevel: setLast7DaysLevel },
                  { label: 'Last month', checked: lastMonth, setChecked: setLastMonth, level: lastMonthLevel, setLevel: setLastMonthLevel },
                  { label: 'Last Quarter', checked: lastQuarter, setChecked: setLastQuarter, level: lastQuarterLevel, setLevel: setLastQuarterLevel }
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) => item.setChecked(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        {item.label}
                      </label>
                      <select
                        value={item.level}
                        onChange={(e) => item.setLevel(e.target.value)}
                        disabled={!item.checked}
                        style={{
                          padding: '6px 10px',
                          fontSize: '11px',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                ))}

                {/* Segment Scores */}
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  marginTop: '20px'
                }}>
                  Segment Scores Signal
                </h4>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      color: 'var(--text-primary)'
                    }}>
                      <input
                        type="checkbox"
                        checked={starters}
                        onChange={(e) => setStarters(e.target.checked)}
                      />
                      Starters
                    </label>
                    <select
                      value={startersLevel}
                      onChange={(e) => setStartersLevel(e.target.value)}
                      disabled={!starters}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px'
                      }}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bucket Configs */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px'
                }}>
                  Bucket Configs
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px'
                  }}>
                    Maximum List Size: 30 HCPs
                  </label>
                </div>

                {[
                  { label: 'Bucket A Configs', size: bucketASize, setSize: setBucketASize },
                  { label: 'Bucket B Configs', size: bucketBSize, setSize: setBucketBSize },
                  { label: 'Bucket C Configs', size: bucketCSize, setSize: setBucketCSize }
                ].map((bucket, i) => (
                  <div key={i} style={{ marginBottom: '16px' }}>
                    <h4 style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      marginBottom: '8px'
                    }}>
                      {bucket.label}
                    </h4>
                    <label style={{
                      display: 'block',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginBottom: '4px'
                    }}>
                      Bucket Size: {bucket.size}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={bucket.size}
                      onChange={(e) => bucket.setSize(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                ))}
              </div>

              {/* Specialties & Segments */}
              <details style={{ marginBottom: '16px' }}>
                <summary style={{
                  padding: '8px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Specialties & Segments
                </summary>
                <div style={{ padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Multi-select specialties and segments...
                </div>
              </details>
            </div>

            {/* Right Panel - Live Preview */}
            <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
              <div style={{ marginBottom: '20px' }}>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    marginBottom: '16px'
                  }}
                >
                  <option value="median-100">Median Region (100 HCPs)</option>
                  <option value="median-65">Median Region (65 HCPs)</option>
                </select>

                {/* All HCPs Table */}
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  letterSpacing: '-0.01em'
                }}>
                  Median Region ({selectedRegion === 'median-100' ? '100' : '65'} HCPs)
                </h4>
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '24px'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-table-header)' }}>
                        <th style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          PowerScore
                        </th>
                        <th style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Entity ID
                        </th>
                        <th style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Specialty
                        </th>
                        <th style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Segment
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockHCPsAll.slice(0, 10).map((hcp, i) => (
                        <tr
                          key={i}
                          style={{
                            backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-table-row-alt)',
                            borderTop: '1px solid var(--border-subtle)'
                          }}
                        >
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: hcp.powerScore === 10 ? 'var(--accent-orange)' : 'var(--accent-yellow-badge)',
                              color: '#ffffff',
                              fontSize: '13px',
                              fontWeight: '700'
                            }}>
                              {hcp.powerScore}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>
                            {hcp.id}
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {hcp.specialty}
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {hcp.segment}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sample Curated List */}
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  letterSpacing: '-0.01em'
                }}>
                  Sample Curated List ({mockHCPsCurated.length} HCPs)
                </h4>
                <div style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-table-header)' }}>
                        <th style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          PowerScore
                        </th>
                        <th style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Entity ID
                        </th>
                        <th style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Specialty
                        </th>
                        <th style={{
                          padding: '10px 12px',
                          textAlign: 'left',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          Segment
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockHCPsCurated.map((hcp, i) => (
                        <tr
                          key={i}
                          style={{
                            backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-table-row-alt)',
                            borderTop: '1px solid var(--border-subtle)'
                          }}
                        >
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: hcp.powerScore === 10 ? 'var(--accent-orange)' : 'var(--accent-yellow-badge)',
                              color: '#ffffff',
                              fontSize: '13px',
                              fontWeight: '700'
                            }}>
                              {hcp.powerScore}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>
                            {hcp.id}
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {hcp.specialty}
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {hcp.segment}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
