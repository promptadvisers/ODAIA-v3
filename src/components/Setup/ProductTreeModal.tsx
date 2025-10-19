import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { MetricsTable } from './MetricsTable';

interface ProductTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  checked?: boolean;
  expanded?: boolean;
}

export const ProductTreeModal: React.FC<ProductTreeModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [basketName, setBasketName] = useState('Odaiazol');
  const [basketWeight, setBasketWeight] = useState('7');
  const [therapeuticArea, setTherapeuticArea] = useState('Oncology');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['portfolio']));
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['tumor-agnostic']));
  const [checkedNodes, setCheckedNodes] = useState<Set<string>>(new Set(['odaiazol', 'tumor-agnostic']));
  const [metrics, setMetrics] = useState([
    { name: 'XPO TRx Volume', weight: 100, visualize: true },
    { name: 'XPO NRx Volume', weight: 0, visualize: false },
    { name: 'XPO NBRx Volume', weight: 0, visualize: false }
  ]);

  // Pharmaceutical-specific competitive data
  const competitiveProducts = [
    'Enhertu (trastuzumab deruxtecan)',
    'Kadcyla (ado-trastuzumab emtansine)',
    'Tykerb (lapatinib)',
    'Herceptin (trastuzumab)',
    'Perjeta (pertuzumab)'
  ];

  const precursorProducts = [
    'T-DM1 (ado-trastuzumab emtansine)',
    'Pertuzumab + Trastuzumab',
    'Trastuzumab monotherapy',
    'Lapatinib + Capecitabine'
  ];

  const analogProducts = [
    'Trastuzumab biosimilars',
    'Lapatinib',
    'Neratinib',
    'Tucatinib',
    'Margetuximab'
  ];

  const productTree: TreeNode[] = [
    {
      id: 'tot-oncology-mkt',
      label: 'TOT ONCOLOGY MKT',
      children: [
        {
          id: 'breast-cancer-mkt',
          label: 'BREAST CANCER MKT',
          children: [
            {
              id: 'cdk46-inhibitors',
              label: 'CDK4/6 INHIBITORS',
              children: [
                { id: 'ibrance', label: 'IBRANCE' },
                { id: 'kisqali', label: 'KISQALI' },
                { id: 'verzenio', label: 'VERZENIO' },
                { id: 'dalpiciclib', label: 'DALPICICLIB' },
                { id: 'trilaciclib', label: 'TRILACICLIB' }
              ]
            },
            {
              id: 'her2-therapies',
              label: 'HER2+ THERAPIES',
              children: [
                { id: 'odaiazol', label: 'ODAIAZOL' },
                { id: 'perjeta', label: 'PERJETA' },
                { id: 'kadcyla', label: 'KADCYLA' },
                { id: 'enhertu', label: 'ENHERTU' }
              ]
            },
            {
              id: 'parp-inhibitors',
              label: 'PARP INHIBITORS',
              children: [
                { id: 'lynparza', label: 'LYNPARZA' },
                { id: 'talzenna', label: 'TALZENNA' }
              ]
            }
          ]
        },
        {
          id: 'lung-cancer-mkt',
          label: 'LUNG CANCER MKT',
          children: [
            {
              id: 'egfr-inhibitors',
              label: 'EGFR INHIBITORS',
              children: [
                { id: 'iressa', label: 'Iressa'.toUpperCase() },
                { id: 'tarceva', label: 'Tarceva'.toUpperCase() },
                { id: 'gilotrif', label: 'Gilotrif'.toUpperCase() },
                { id: 'vizimpro', label: 'VIZIMPRO' },
                { id: 'tagrisso', label: 'TAGRISSO' },
                { id: 'exkivity', label: 'EXKIVITY' },
                { id: 'lazcluze', label: 'LAZCLUZE' },
                { id: 'rybrevant', label: 'RYBREVANT' },
                { id: 'datroway', label: 'DATROWAY' }
              ]
            },
            {
              id: 'alk-inhibitors',
              label: 'ALK INHIBITORS',
              children: [
                { id: 'alecensa', label: 'ALECENSA' },
                { id: 'alunbrig', label: 'ALUNBRIG' },
                { id: 'xalkori', label: 'XALKORI' },
                { id: 'lorbrena', label: 'LORBRENA' },
                { id: 'ceritinib', label: 'CERITINIB' }
              ]
            },
            {
              id: 'immunotherapies-io',
              label: 'IMMUNOTHERAPIES (IO)',
              children: [
                { id: 'keytruda', label: 'KEYTRUDA' },
                { id: 'opdivo', label: 'OPDIVO' },
                { id: 'tecentriq', label: 'TECENTRIQ' },
                { id: 'imfinzi', label: 'IMFINZI' },
                { id: 'libtayo', label: 'LIBTAYO' }
              ]
            }
          ]
        },
        {
          id: 'hematological-mkt',
          label: 'HEMATOLOGICAL MKT',
          children: [
            {
              id: 'btk-inhibitors',
              label: 'BTK INHIBITORS',
              children: [
                { id: 'imbruvica', label: 'IMBRUVICA' },
                { id: 'calquence', label: 'CALQUENCE' },
                { id: 'brukinsa', label: 'BRUKINSA' }
              ]
            },
            {
              id: 'bcl2-inhibitors',
              label: 'BCL-2 INHIBITORS',
              children: [
                { id: 'venclxta', label: 'VENCLXTA' }
              ]
            },
            {
              id: 'other-hematological-therapies',
              label: 'OTHER HEMATOLOGICAL THERAPIES',
              children: [
                { id: 'velcade', label: 'VELCADE' },
                { id: 'darzalex', label: 'DARZALEX' }
              ]
            },
            {
              id: 'cart-bispecifics',
              label: 'CAR-T / BISPECIFICS',
              children: []
            }
          ]
        },
        { id: 'categorical-metric', label: 'CATEGORICAL METRIC', children: [] },
        { id: 'competitive-set', label: 'COMPETITIVE SET', children: [] },
        { id: 'underlying-treatment', label: 'UNDERLYING TREATMENT', children: [] },
        { id: 'analogue', label: 'ANALOGUE', children: [] },
        {
          id: 'precursor',
          label: 'PRECURSOR',
          children: []
        },
        {
          id: 'claims',
          label: 'CLAIMS',
          children: [
            { id: 'aplddx-procedures', label: 'APLDDX PROCEDURES' },
            { id: 'aplddx-diagnosis', label: 'APLDDX DIAGNOSIS' }
          ]
        }
      ]
    }
  ];

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

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleCheck = (nodeId: string) => {
    const newChecked = new Set(checkedNodes);
    if (newChecked.has(nodeId)) {
      newChecked.delete(nodeId);
    } else {
      newChecked.add(nodeId);
    }
    setCheckedNodes(newChecked);
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isChecked = checkedNodes.has(node.id);

    return (
      <div key={node.id}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            paddingLeft: `${12 + level * 24}px`,
            cursor: 'pointer',
            backgroundColor: 'transparent',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1a2332';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => {
              e.stopPropagation();
              toggleCheck(node.id);
            }}
            style={{
              marginRight: '12px',
              width: '16px',
              height: '16px',
              cursor: 'pointer',
              accentColor: '#3b82f6'
            }}
          />

          {/* Label with expand/collapse icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1
            }}
            onClick={() => hasChildren && toggleNode(node.id)}
          >
            <span style={{
              color: '#ffffff',
              fontSize: '13px',
              userSelect: 'none'
            }}>
              {node.label}
            </span>
            {hasChildren && (
              <ChevronRight
                size={16}
                style={{
                  marginLeft: '8px',
                  color: '#64748b',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
            )}
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleSave = () => {
    const data = {
      basketName,
      basketWeight,
      therapeuticArea,
      product: 'Odaiazol',
      indication: '2L Therapy HER+',
      specialties: '',
      metrics
    };
    onSave(data);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#0f1419',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#1a2332',
          borderBottom: '1px solid #2a3441',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: '15px',
            fontWeight: '500',
            color: '#ffffff'
          }}>
            New Project: Odaiazol - Establish Product
          </h2>
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
        <div style={{ padding: '20px' }}>
          {/* Portfolio Products Section */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => toggleSection('portfolio')}
            >
              Portfolio Products
              {expandedSections.has('portfolio') ? (
                <ChevronUp size={16} style={{ marginLeft: '8px', color: '#64748b' }} />
              ) : (
                <ChevronDown size={16} style={{ marginLeft: '8px', color: '#64748b' }} />
              )}
            </h3>
            
            {expandedSections.has('portfolio') && (
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    color: '#64748b',
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
                      backgroundColor: '#1a1f2e',
                      border: '1px solid #2a3441',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontSize: '13px'
                    }}
                  />
                </div>
                
                <div style={{ width: '180px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '11px',
                    color: '#64748b',
                    marginBottom: '6px'
                  }}>
                    Basket Scoring Weight (0-10)
                  </label>
                  <input
                    type="text"
                    value={basketWeight}
                    onChange={(e) => setBasketWeight(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#1a1f2e',
                      border: '1px solid #2a3441',
                      borderRadius: '4px',
                      color: '#ffffff',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Basket Configurations Section */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff',
              marginBottom: '6px'
            }}>
              Basket Configurations
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#64748b',
              marginBottom: '16px'
            }}>
              Assign items to the configurations below to view available metrics
            </p>

            {/* Therapeutic Area Dropdown */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                color: '#64748b',
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
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #2a3441',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <option value="Oncology">Oncology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
              </select>
            </div>

            {/* Product Dropdown with Inline Tree */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                color: '#64748b',
                marginBottom: '6px'
              }}>
                Product
              </label>
              <div
                onClick={() => setShowProductDropdown(!showProductDropdown)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #2a3441',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>Odaiazol</span>
                <ChevronDown size={16} style={{ 
                  color: '#64748b',
                  transform: showProductDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} />
              </div>

              {/* Product Tree - Shows inline when dropdown is open */}
              {showProductDropdown && (
                <div style={{
                  backgroundColor: '#1a2332',
                  borderRadius: '0 0 4px 4px',
                  border: '1px solid #2a3441',
                  borderTop: 'none',
                  marginTop: '-1px',
                  padding: '8px 0'
                }}>
                  {productTree.map(node => renderTreeNode(node))}
                </div>
              )}
            </div>

            {/* Indications Dropdown */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                color: '#64748b',
                marginBottom: '6px'
              }}>
                Indications
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #2a3441',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <option value="2L Therapy HER+">2L Therapy HER+</option>
              </select>
            </div>

            {/* Specialties Dropdown */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontSize: '11px',
                color: '#64748b',
                marginBottom: '6px'
              }}>
                Specialties
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#1a1f2e',
                  border: '1px solid #2a3441',
                  borderRadius: '4px',
                  color: '#64748b',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select Specialties (Optional)</option>
                <option value="medical-oncology">Medical Oncology</option>
                <option value="hematology-oncology">Hematology-Oncology</option>
                <option value="surgical-oncology">Surgical Oncology</option>
              </select>
            </div>
          </div>

          {/* Metrics Section */}
          <MetricsTable metrics={metrics} setMetrics={setMetrics} />

          {/* Collapsible Basket Sections with Pharma Data */}
          <div style={{ marginTop: '24px' }}>
            {/* Competitive Opportunities */}
            <div style={{ marginBottom: '12px' }}>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#1a2332',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onClick={() => toggleSection('competitive')}
              >
                <span style={{ fontSize: '13px', color: '#ffffff' }}>Competitive Opportunities</span>
                {expandedSections.has('competitive') ? (
                  <ChevronUp size={16} style={{ color: '#64748b' }} />
                ) : (
                  <ChevronDown size={16} style={{ color: '#64748b' }} />
                )}
              </div>
              {expandedSections.has('competitive') && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#0a0d12',
                  borderRadius: '0 0 4px 4px',
                  marginTop: '-1px'
                }}>
                  {competitiveProducts.map((product, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0'
                    }}>
                      <input 
                        type="checkbox" 
                        style={{ marginRight: '10px', accentColor: '#3b82f6' }}
                      />
                      <span style={{ fontSize: '12px', color: '#ffffff' }}>{product}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Precursor */}
            <div style={{ marginBottom: '12px' }}>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#1a2332',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onClick={() => toggleSection('precursor')}
              >
                <span style={{ fontSize: '13px', color: '#ffffff' }}>Precursor</span>
                {expandedSections.has('precursor') ? (
                  <ChevronUp size={16} style={{ color: '#64748b' }} />
                ) : (
                  <ChevronDown size={16} style={{ color: '#64748b' }} />
                )}
              </div>
              {expandedSections.has('precursor') && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#0a0d12',
                  borderRadius: '0 0 4px 4px',
                  marginTop: '-1px'
                }}>
                  {precursorProducts.map((product, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0'
                    }}>
                      <input 
                        type="checkbox" 
                        style={{ marginRight: '10px', accentColor: '#3b82f6' }}
                      />
                      <span style={{ fontSize: '12px', color: '#ffffff' }}>{product}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Analog */}
            <div style={{ marginBottom: '12px' }}>
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#1a2332',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                onClick={() => toggleSection('analog')}
              >
                <span style={{ fontSize: '13px', color: '#ffffff' }}>Analog</span>
                {expandedSections.has('analog') ? (
                  <ChevronUp size={16} style={{ color: '#64748b' }} />
                ) : (
                  <ChevronDown size={16} style={{ color: '#64748b' }} />
                )}
              </div>
              {expandedSections.has('analog') && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#0a0d12',
                  borderRadius: '0 0 4px 4px',
                  marginTop: '-1px'
                }}>
                  {analogProducts.map((product, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0'
                    }}>
                      <input 
                        type="checkbox" 
                        style={{ marginRight: '10px', accentColor: '#3b82f6' }}
                      />
                      <span style={{ fontSize: '12px', color: '#ffffff' }}>{product}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #2a3441',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              backgroundColor: 'transparent',
              border: '1px solid #2a3441',
              borderRadius: '4px',
              color: '#94a3b8',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 20px',
              backgroundColor: 'transparent',
              border: '1px solid #2a3441',
              borderRadius: '4px',
              color: '#94a3b8',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Save objective
          </button>
        </div>
      </div>
    </div>
  );
};