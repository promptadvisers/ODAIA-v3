import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

interface ProjectObjectiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cardType?: 'medicalObjectives' | 'brandAccess' | 'salesGoals' | 'competitiveLandscape' | 'hcp-targeting' | 'call-plan';
}

export const ProjectObjectiveDialog: React.FC<ProjectObjectiveDialogProps> = ({ 
  isOpen, 
  onClose, 
  cardType = 'medicalObjectives' 
}) => {
  // Dynamic initial values based on card type
  const getInitialValues = () => {
    switch (cardType) {
      case 'brandAccess':
        return {
          title: 'Brand Access Strategy: Objective 1',
          basketName: 'OncoConnect Access Program',
          basketScore: '8',
          therapeuticArea: 'Oncology',
          product: 'OncoThera',
          indications: { 'PSP': true, 'Copay': true, 'Portal': true },
          metrics: [
            'Patient Enrollment Rate',
            'Prior Auth Approval Time',
            'Copay Card Utilization',
            'Portal Active Users'
          ]
        };
      case 'salesGoals':
        return {
          title: 'Sales Goals: Objective 1',
          basketName: 'XPO TRx Growth Target',
          basketScore: '9',
          therapeuticArea: 'Oncology',
          product: 'XPO',
          indications: { 'NBRx': true, 'TRx': true, 'Volume': true },
          metrics: [
            'XPO TRx Share Monthly',
            'NBRx Growth Rate',
            'Market Share Increase',
            'HCP Adoption Rate'
          ]
        };
      case 'competitiveLandscape':
        return {
          title: 'Competitive Landscape: Objective 1',
          basketName: 'Competitive Positioning',
          basketScore: '7',
          therapeuticArea: 'Oncology',
          product: 'Market Analysis',
          indications: { 'T-DM1': true, 'T-DXd': true, 'Sacituzumab': false },
          metrics: [
            'Market Share vs Competitors',
            'Switch Rate Analysis',
            'Competitive Win Rate',
            'Differentiation Score'
          ]
        };
      default: // medicalObjectives
        return {
          title: 'New Project: Objective 1',
          basketName: 'Target Product Nacida',
          basketScore: '7',
          therapeuticArea: '',
          product: '',
          indications: { 'SEA': true, 'EGPA': true, 'NP': true },
          metrics: [
            'IOVIA TRx Share Monthly',
            'IOVIA TRx Share Monthly',
            'IOVIA TRx Share Monthly',
            'IOVIA TRx Share Monthly'
          ]
        };
    }
  };

  const initialValues = getInitialValues();
  
  const [basketName, setBasketName] = useState(initialValues.basketName);
  const [basketScore, setBasketScore] = useState(initialValues.basketScore);
  const [therapeuticArea, setTherapeuticArea] = useState(initialValues.therapeuticArea);
  const [product, setProduct] = useState(initialValues.product);
  const [selectedIndications, setSelectedIndications] = useState(initialValues.indications);
  const [expandedSections, setExpandedSections] = useState({
    portfolio: true,
    competitive: true,
    precursor: true
  });

  // Reset values when card type changes
  useEffect(() => {
    const values = getInitialValues();
    setBasketName(values.basketName);
    setBasketScore(values.basketScore);
    setTherapeuticArea(values.therapeuticArea);
    setProduct(values.product);
    setSelectedIndications(values.indications);
  }, [cardType]);

  if (!isOpen) return null;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          animation: 'fadeIn 200ms'
        }}
        onClick={onClose}
      />
      
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--bg-modal)',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '90%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 1001,
          animation: 'slideIn 200ms'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {initialValues.title}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              transition: 'background-color 200ms'
            }}
          >
            <X style={{ width: '20px', height: '20px', color: 'var(--text-muted)' }} />
          </button>
        </div>
        
        <div style={{ padding: '24px' }}>
          {/* Portfolio Products Section */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => toggleSection('portfolio')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0',
                marginBottom: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Portfolio Products
              </h3>
              {expandedSections.portfolio ? 
                <ChevronUp style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} /> :
                <ChevronDown style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              }
            </button>
            
            {expandedSections.portfolio && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '16px', alignItems: 'center' }}>
                <div>
                  <label style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    display: 'block',
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
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    display: 'block',
                    marginBottom: '6px'
                  }}>
                    Basket Scoring Weight (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={basketScore}
                    onChange={(e) => setBasketScore(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: 'var(--text-primary)',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Basket Configurations */}
          <div style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <h4 style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '16px'
              }}>
                Basket Configurations
              </h4>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '16px'
              }}>
                Assign items to the configurations below to view available metrics
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  Select Therapeutic Areas
                </label>
                <select
                  value={therapeuticArea}
                  onChange={(e) => setTherapeuticArea(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                >
                  <option value="">Select Therapeutic Areas</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Immunology">Immunology</option>
                </select>
              </div>

              <div>
                <label style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  display: 'block',
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
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                >
                  <option value="">Select Product</option>
                  <option value="OncoThera">OncoThera</option>
                  <option value="XPO">XPO</option>
                  <option value="Nacida">Nacida</option>
                  <option value="Market Analysis">Market Analysis</option>
                </select>
              </div>

              <div>
                <label style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  display: 'block',
                  marginBottom: '6px'
                }}>
                  Select Indications (Optional)
                </label>
                <div style={{
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-input)',
                  padding: '8px'
                }}>
                  {Object.entries(selectedIndications).map(([key, value]) => (
                    <label 
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background-color 200ms'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setSelectedIndications(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        style={{
                          marginRight: '8px'
                        }}
                      />
                      <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{key}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Metric Configuration */}
            <div style={{ marginTop: '20px' }}>
              <label style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                display: 'block',
                marginBottom: '12px'
              }}>
                Metric (select)
              </label>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Scoring Weight
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ 
                      textAlign: 'left', 
                      fontSize: '11px', 
                      color: 'var(--text-secondary)',
                      padding: '8px 8px 8px 0',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}>
                      {cardType === 'brandAccess' ? 'Access Metrics' : 
                       cardType === 'salesGoals' ? 'Sales Metrics' :
                       cardType === 'competitiveLandscape' ? 'Competitive Metrics' :
                       'IOVIA TRx Share Monthly'}
                    </th>
                    <th style={{ 
                      textAlign: 'center', 
                      fontSize: '11px', 
                      color: 'var(--text-secondary)',
                      padding: '8px',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}>
                      Scoring Weight
                    </th>
                    <th style={{ 
                      textAlign: 'center', 
                      fontSize: '11px', 
                      color: 'var(--text-secondary)',
                      padding: '8px',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}>
                      Baseline
                    </th>
                    <th style={{ 
                      textAlign: 'center', 
                      fontSize: '11px', 
                      color: 'var(--text-secondary)',
                      padding: '8px',
                      borderBottom: '1px solid var(--border-subtle)'
                    }}>
                      Percentile
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {initialValues.metrics.map((metric, index) => (
                    <tr key={index}>
                      <td style={{ 
                        fontSize: '12px', 
                        color: 'var(--text-primary)',
                        padding: '12px 8px 12px 0'
                      }}>
                        {metric}
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                        <span style={{ 
                          fontSize: '12px', 
                          color: 'var(--text-primary)',
                          fontWeight: '500'
                        }}>
                          50%
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                        <input 
                          type="checkbox" 
                          checked={true}
                          readOnly
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                        <input 
                          type="checkbox" 
                          checked={false}
                          readOnly
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Competitive Opportunities Section */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => toggleSection('competitive')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0',
                marginBottom: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Competitive Opportunities
              </h3>
              {expandedSections.competitive ? 
                <ChevronUp style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} /> :
                <ChevronDown style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              }
            </button>
            
            {expandedSections.competitive && (
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)'
                }}>
                  {cardType === 'competitiveLandscape' 
                    ? 'T-DM1, T-DXd, and Sacituzumab competitive positioning analysis'
                    : 'No competitive opportunities configured'}
                </p>
              </div>
            )}
          </div>

          {/* Precursor Section */}
          <div>
            <button
              onClick={() => toggleSection('precursor')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0',
                marginBottom: '16px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Precursor
              </h3>
              {expandedSections.precursor ? 
                <ChevronUp style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} /> :
                <ChevronDown style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              }
            </button>
            
            {expandedSections.precursor && (
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)'
                }}>
                  {cardType === 'salesGoals' 
                    ? '2L metastatic breast cancer patient flow analysis'
                    : cardType === 'brandAccess'
                    ? 'Patient journey from diagnosis to treatment access'
                    : 'No precursor configured'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 200ms'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--accent-blue)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'opacity 200ms'
            }}
          >
            Save objective
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
};