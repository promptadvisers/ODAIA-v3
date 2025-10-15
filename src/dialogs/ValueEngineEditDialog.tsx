import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore, MOCK_PRODUCTS } from '../store/appStore';

export const ValueEngineEditDialog: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const isOpen = activeModal === 'value-engine-edit';

  const [basketName, setBasketName] = useState('Odaiazol');
  const [basketWeight, setBasketWeight] = useState('7');
  const [therapeuticArea, setTherapeuticArea] = useState('Oncology');
  const [product] = useState('Odaiazol');
  const [indication, setIndication] = useState('2L HER2+ Metastatic Breast Cancer');
  const [specialties, setSpecialties] = useState('Oncology');
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['tumor-agnostic']);
  const [selectedIndications, setSelectedIndications] = useState<string[]>(['odaiazol']);

  const [metrics, setMetrics] = useState([
    { name: 'XPO TRx Volume', weight: 90, visualize: true },
    { name: 'XPO NRx Volume', weight: 0, visualize: false },
    { name: 'XPO NBRx Volume', weight: 0, visualize: false },
    { name: 'OncoThera Copay Card PSP Claims', weight: 10, visualize: true }
  ]);

  const [openSections, setOpenSections] = useState({
    competitive: false,
    patient: false,
    analog: false
  });

  const productTree = {
    id: 'tumor-agnostic',
    label: 'Tumor-Agnostic Indications',
    children: [
      {
        id: 'odaiazol',
        label: 'Odaiazol',
        children: [
          { id: 'ntrk', label: 'NTRK fusion' },
          { id: 'braf', label: 'BRAF V600E–mutant tumors' }
        ]
      }
    ]
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev =>
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const toggleSelection = (nodeId: string) => {
    setSelectedIndications(prev =>
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const updateMetricWeight = (index: number, weight: number) => {
    const updated = [...metrics];
    updated[index].weight = weight;
    setMetrics(updated);
  };

  const toggleMetricVisualize = (index: number) => {
    const updated = [...metrics];
    updated[index].visualize = !updated[index].visualize;
    setMetrics(updated);
  };

  // Sync Indication and Therapeutic Area when Product changes
  useEffect(() => {
    const selectedProductData = MOCK_PRODUCTS.find(p => p.name === product);
    if (selectedProductData) {
      setIndication(selectedProductData.indication);
      setTherapeuticArea(selectedProductData.therapeuticArea);
    }
  }, [product]);

  const renderTreeNode = (node: any, level: number = 0) => {
    const isExpanded = expandedNodes.includes(node.id);
    const isSelected = selectedIndications.includes(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} style={{ marginLeft: level * 20 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: level === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          borderRadius: '6px',
          marginBottom: '4px',
          cursor: 'pointer',
          transition: 'background-color 200ms'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = level === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              style={{
                padding: '4px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 200ms'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <ChevronRight
                size={14}
                style={{
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms ease-in-out'
                }}
              />
            </button>
          )}
          {!hasChildren && <div style={{ width: '20px' }} />}

          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              toggleSelection(node.id);
            }}
            style={{
              cursor: 'pointer',
              width: '16px',
              height: '16px',
              accentColor: '#3b82f6'
            }}
          />

          <span style={{
            fontSize: '13px',
            color: 'var(--text-primary)',
            flex: 1,
            fontWeight: level === 0 ? '500' : '400'
          }}
          onClick={() => hasChildren && toggleNode(node.id)}
          >
            {node.label}
          </span>

          {/* Chevron on the right for all items */}
          <ChevronRight
            size={14}
            style={{
              color: 'var(--text-muted)',
              marginLeft: 'auto'
            }}
          />
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child: any) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

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
          padding: '28px 32px',
          width: '90vw',
          maxWidth: '680px',
          maxHeight: '85vh',
          overflow: 'auto',
          zIndex: 1001,
          border: '1px solid var(--border-subtle)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px'
          }}>
            <Dialog.Title style={{
              fontSize: '17px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              New Project: Odaiazol - Establish Product
            </Dialog.Title>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Portfolio Products */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '14px'
            }}>
              Portfolio Products
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px'
                }}>
                  Basket Name
                </label>
                <input
                  type="text"
                  value={basketName}
                  onChange={(e) => setBasketName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border-color 200ms'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--border-focus)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px'
                }}>
                  Basket Scoring Weight (0-10)
                </label>
                <input
                  type="number"
                  value={basketWeight}
                  onChange={(e) => setBasketWeight(e.target.value)}
                  min="0"
                  max="10"
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border-color 200ms'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--border-focus)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                />
              </div>
            </div>
          </div>

          {/* Basket Configurations */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '10px',
              letterSpacing: '-0.01em'
            }}>
              Basket Configurations
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '14px',
              lineHeight: '1.5'
            }}>
              Assign items to the configurations below to view available metrics
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '8px'
              }}>
                Therapeutic Area
              </label>
              <select
                value={therapeuticArea}
                onChange={(e) => setTherapeuticArea(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 200ms'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
              >
                <option value="Oncology">Oncology</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '8px'
              }}>
                Product
              </label>
              <div
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 200ms',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
              >
                <span>{product}</span>
                <ChevronRight
                  size={16}
                  style={{
                    transform: productDropdownOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms',
                    color: 'var(--text-secondary)'
                  }}
                />
              </div>

              {/* Custom Popover with Tree */}
              {productDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '8px',
                  zIndex: 1000,
                  maxHeight: '300px',
                  overflow: 'auto',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                }}>
                  {renderTreeNode(productTree)}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '8px'
              }}>
                Indication
              </label>
              <select
                value={indication}
                onChange={(e) => setIndication(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 200ms'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
              >
                <option value={indication}>{indication}</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '8px'
              }}>
                Specialties
              </label>
              <select
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 200ms'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
              >
                <option value="Oncology">Oncology</option>
              </select>
            </div>

            {/* Product Tree - Hidden as it's now in the Product dropdown */}
            {/*
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '6px',
              padding: '14px 16px',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                marginBottom: '10px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                Indications
              </div>
              {renderTreeNode(productTree)}
            </div>
            */}
          </div>

          {/* Metrics */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '12px'
            }}>
              Metrics
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '14px'
            }}>
              Assign scoring weight for each available metric
            </p>

            <div style={{
              backgroundColor: 'transparent',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)'
                  }}>
                    <th style={{
                      padding: '14px 18px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)'
                    }}>
                      Metric name
                    </th>
                    <th style={{
                      padding: '14px 18px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)'
                    }}>
                      Scoring weight
                    </th>
                    <th style={{
                      padding: '14px 18px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)'
                    }}>
                      Visualize
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((metric, index) => (
                    <tr key={index}>
                      <td style={{
                        padding: '14px 18px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--text-primary)',
                        backgroundColor: 'transparent'
                      }}>
                        {metric.name}
                      </td>
                      <td style={{
                        padding: '14px 18px',
                        textAlign: 'right',
                        backgroundColor: 'transparent'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                          <input
                            type="number"
                            value={metric.weight}
                            onChange={(e) => updateMetricWeight(index, parseInt(e.target.value) || 0)}
                            min="0"
                            max="100"
                            style={{
                              width: '90px',
                              padding: '9px 14px',
                              backgroundColor: 'rgba(255, 255, 255, 0.04)',
                              color: 'var(--text-primary)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '6px',
                              fontSize: '13px',
                              textAlign: 'center',
                              outline: 'none'
                            }}
                          />
                          <span style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            minWidth: '20px'
                          }}>
                            %
                          </span>
                        </div>
                      </td>
                      <td style={{
                        padding: '14px 18px',
                        textAlign: 'center',
                        backgroundColor: 'transparent'
                      }}>
                        <input
                          type="checkbox"
                          checked={metric.visualize}
                          onChange={() => toggleMetricVisualize(index)}
                          style={{
                            cursor: 'pointer',
                            width: '18px',
                            height: '18px',
                            accentColor: '#3b82f6'
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Collapsible Sections */}
          <details
            style={{ marginBottom: '16px' }}
            onToggle={(e) => setOpenSections({...openSections, competitive: (e.target as HTMLDetailsElement).open})}
          >
            <summary style={{
              padding: '13px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              listStyle: 'none',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                marginRight: '8px',
                display: 'inline-block',
                transform: openSections.competitive ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease'
              }}>
                ▶
              </span>
              Competitive Potential
            </summary>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '18px',
              marginTop: '8px'
            }}>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-primary)',
                marginBottom: '16px',
                padding: '12px 18px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '6px'
              }}>
                Basket weight: 2
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: '12px 18px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)'
                    }}>
                      Markets
                    </th>
                    <th style={{
                      padding: '12px 18px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)'
                    }}>
                      Scoring weight
                    </th>
                    <th style={{
                      padding: '12px 18px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)'
                    }}>
                      Visualize
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{
                      padding: '12px 18px',
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      2L Therapy HER+ Overall Market, XPO TRx
                    </td>
                    <td style={{
                      padding: '12px 18px',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          value="80"
                          readOnly
                          style={{
                            width: '85px',
                            padding: '9px 14px',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            color: 'var(--text-primary)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '6px',
                            fontSize: '14px',
                            textAlign: 'center',
                            outline: 'none'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          color: 'var(--text-secondary)'
                        }}>
                          %
                        </span>
                      </div>
                    </td>
                    <td style={{
                      padding: '12px 18px',
                      textAlign: 'center'
                    }}>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        style={{
                          cursor: 'pointer',
                          width: '18px',
                          height: '18px',
                          accentColor: '#3b82f6'
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      padding: '12px 18px',
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      Competitive brand PixelTron, XPO NBRx
                    </td>
                    <td style={{
                      padding: '12px 18px',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          value="20"
                          readOnly
                          style={{
                            width: '85px',
                            padding: '9px 14px',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            color: 'var(--text-primary)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '6px',
                            fontSize: '14px',
                            textAlign: 'center',
                            outline: 'none'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          color: 'var(--text-secondary)'
                        }}>
                          %
                        </span>
                      </div>
                    </td>
                    <td style={{
                      padding: '12px 18px',
                      textAlign: 'center'
                    }}>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        style={{
                          cursor: 'pointer',
                          width: '18px',
                          height: '18px',
                          accentColor: '#3b82f6'
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>

          <details
            style={{ marginBottom: '16px' }}
            onToggle={(e) => setOpenSections({...openSections, patient: (e.target as HTMLDetailsElement).open})}
          >
            <summary style={{
              padding: '13px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              listStyle: 'none',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                marginRight: '8px',
                display: 'inline-block',
                transform: openSections.patient ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease'
              }}>
                ▶
              </span>
              Patient Potential (precursor)
            </summary>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '18px',
              marginTop: '8px'
            }}>
              <div style={{
                fontSize: '13px',
                color: 'var(--text-primary)',
                marginBottom: '16px',
                padding: '12px 18px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '6px'
              }}>
                Basket weight: 1
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{
                      padding: '12px 18px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)'
                    }}>
                    </th>
                    <th style={{
                      padding: '12px 18px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)'
                    }}>
                      Scoring weight
                    </th>
                    <th style={{
                      padding: '12px 18px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'var(--text-secondary)'
                    }}>
                      Visualize
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{
                      padding: '12px 18px',
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      PSP Claims
                    </td>
                    <td style={{
                      padding: '12px 18px',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          value="20"
                          readOnly
                          style={{
                            width: '85px',
                            padding: '9px 14px',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            color: 'var(--text-primary)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '6px',
                            fontSize: '14px',
                            textAlign: 'center',
                            outline: 'none'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          color: 'var(--text-secondary)'
                        }}>
                          %
                        </span>
                      </div>
                    </td>
                    <td style={{
                      padding: '12px 18px',
                      textAlign: 'center'
                    }}>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        style={{
                          cursor: 'pointer',
                          width: '18px',
                          height: '18px',
                          accentColor: '#3b82f6'
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{
                      padding: '12px 18px',
                      fontSize: '14px',
                      color: 'var(--text-primary)'
                    }}>
                      Payer mix, Medicaid, Medicare
                    </td>
                    <td style={{
                      padding: '12px 18px',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          value="80"
                          readOnly
                          style={{
                            width: '85px',
                            padding: '9px 14px',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            color: 'var(--text-primary)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '6px',
                            fontSize: '14px',
                            textAlign: 'center',
                            outline: 'none'
                          }}
                        />
                        <span style={{
                          fontSize: '14px',
                          color: 'var(--text-secondary)'
                        }}>
                          %
                        </span>
                      </div>
                    </td>
                    <td style={{
                      padding: '12px 18px',
                      textAlign: 'center'
                    }}>
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        style={{
                          cursor: 'pointer',
                          width: '18px',
                          height: '18px',
                          accentColor: '#3b82f6'
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>

          <details
            style={{ marginBottom: '24px' }}
            onToggle={(e) => setOpenSections({...openSections, analog: (e.target as HTMLDetailsElement).open})}
          >
            <summary style={{
              padding: '13px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              listStyle: 'none',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                marginRight: '8px',
                display: 'inline-block',
                transform: openSections.analog ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease'
              }}>
                ▶
              </span>
              Analog
            </summary>
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '8px'
            }}>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-muted)',
                margin: 0
              }}>
                Not required
              </p>
            </div>
          </details>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setActiveModal(null)}>
              Save objective
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
