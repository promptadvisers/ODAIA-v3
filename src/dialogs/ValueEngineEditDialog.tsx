import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore } from '../store/appStore';

export const ValueEngineEditDialog: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const isOpen = activeModal === 'value-engine-edit';

  const [basketName, setBasketName] = useState('Odaiazol');
  const [basketWeight, setBasketWeight] = useState('7');
  const [therapeuticArea, setTherapeuticArea] = useState('Oncology');
  const [product, setProduct] = useState('Odaiazol');
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['tumor-agnostic']);
  const [selectedIndications, setSelectedIndications] = useState<string[]>(['odaiazol']);

  const [metrics, setMetrics] = useState([
    { name: 'XPO TRx Volume', weight: 100, visualize: true },
    { name: 'XPO NRx Volume', weight: 0, visualize: false },
    { name: 'XPO NBRx Volume', weight: 0, visualize: false }
  ]);

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
          backgroundColor: level === 0 ? 'var(--bg-card)' : 'transparent',
          borderRadius: '6px',
          marginBottom: '4px'
        }}>
          {hasChildren && (
            <button
              onClick={() => toggleNode(node.id)}
              style={{
                padding: '2px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronRight
                size={16}
                style={{
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms'
                }}
              />
            </button>
          )}
          {!hasChildren && <div style={{ width: '20px' }} />}

          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelection(node.id)}
            style={{ cursor: 'pointer' }}
          />

          <span style={{
            fontSize: '13px',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
          onClick={() => hasChildren && toggleNode(node.id)}
          >
            {node.label}
          </span>
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
          padding: '24px',
          width: '90vw',
          maxWidth: '700px',
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
            marginBottom: '24px'
          }}>
            <Dialog.Title style={{
              fontSize: '18px',
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
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '16px'
            }}>
              Portfolio Products
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px'
                }}>
                  Basket Name
                </label>
                <input
                  type="text"
                  value={basketName}
                  onChange={(e) => setBasketName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginBottom: '6px'
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
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
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
              marginBottom: '8px'
            }}>
              Basket Configurations
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '16px'
            }}>
              Assign items to the configurations below to view available metrics
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}>
                Therapeutic Area
              </label>
              <select
                value={therapeuticArea}
                onChange={(e) => setTherapeuticArea(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="Oncology">Oncology</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}>
                Product
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="Odaiazol">Odaiazol</option>
              </select>
            </div>

            {/* Product Tree */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              {renderTreeNode(productTree)}
            </div>
          </div>

          {/* Metrics */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Metrics
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '16px'
            }}>
              Assign scoring weight for each available metric
            </p>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-main)' }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)'
                    }}>
                      Metric name
                    </th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--text-secondary)'
                    }}>
                      Scoring weight
                    </th>
                    <th style={{
                      padding: '12px',
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
                    <tr key={index} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <td style={{
                        padding: '12px',
                        fontSize: '13px',
                        color: 'var(--text-primary)'
                      }}>
                        {metric.name}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <input
                          type="number"
                          value={metric.weight}
                          onChange={(e) => updateMetricWeight(index, parseInt(e.target.value) || 0)}
                          min="0"
                          max="100"
                          style={{
                            width: '80px',
                            padding: '6px 12px',
                            backgroundColor: 'var(--bg-main)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            fontSize: '13px',
                            textAlign: 'center',
                            outline: 'none'
                          }}
                        />
                        <span style={{
                          marginLeft: '4px',
                          fontSize: '13px',
                          color: 'var(--text-secondary)'
                        }}>
                          %
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={metric.visualize}
                          onChange={() => toggleMetricVisualize(index)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Collapsible Sections */}
          <details style={{ marginBottom: '16px' }}>
            <summary style={{
              padding: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              Competitive Opportunities
            </summary>
            <div style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Configure competitive opportunity metrics...
            </div>
          </details>

          <details style={{ marginBottom: '16px' }}>
            <summary style={{
              padding: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              Precursor
            </summary>
            <div style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Configure precursor metrics...
            </div>
          </details>

          <details style={{ marginBottom: '24px' }}>
            <summary style={{
              padding: '12px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text-primary)'
            }}>
              Analog
            </summary>
            <div style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Configure analog metrics...
            </div>
          </details>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingTop: '20px',
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
