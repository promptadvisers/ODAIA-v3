import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore, MOCK_PRODUCTS, type Product, type SimulationScenario } from '../store/appStore';

interface AddSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSimulationModal: React.FC<AddSimulationModalProps> = ({ isOpen, onClose }) => {
  const { addSimulation, simulations, productConfig, selectedWorkflow } = useAppStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [copyFromOriginal, setCopyFromOriginal] = useState(true);
  const [simulationName, setSimulationName] = useState('');

  // Update simulation name when simulations change
  React.useEffect(() => {
    if (isOpen) {
      const simulationNumber = simulations.length + 1;
      setSimulationName(`Simulation ${simulationNumber}`);
    }
  }, [isOpen, simulations.length]);

  if (!isOpen) return null;

  const handleAddSimulation = () => {
    if (!selectedProduct || !simulationName.trim()) return;

    const newSimulation: Omit<SimulationScenario, 'id' | 'createdAt'> = {
      name: simulationName,
      product: selectedProduct,
      valueEngine: copyFromOriginal ? {
        product: productConfig.product,
        therapeuticArea: productConfig.therapeuticArea,
        indication: productConfig.indication,
        metrics: [...productConfig.metrics],
        basketWeight: productConfig.basketWeight
      } : {
        product: selectedProduct.name,
        therapeuticArea: selectedProduct.therapeuticArea,
        indication: selectedProduct.indication,
        metrics: [
          { name: 'XPO TRx Volume', weight: 100, visualize: true },
          { name: 'XPO NRx Volume', weight: 0, visualize: false }
        ],
        basketWeight: '7'
      },
      curationEngine: selectedWorkflow === 'sales' ? {
        suggestionsPerWeek: '5-10',
        signals: 12,
        strategy: 'Reach & Frequency',
        reachFrequency: '4-6 calls/month'
      } : undefined,
      status: 'configured'
    };

    addSimulation(newSimulation);
    onClose();
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
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--bg-modal)',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '1px solid var(--border-primary)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Add Simulation Scenario
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
              transition: 'background-color 200ms'
            }}
          >
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Simulation Name */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Simulation Name *
            </label>
            <input
              type="text"
              value={simulationName}
              onChange={(e) => setSimulationName(e.target.value)}
              placeholder="Enter simulation name..."
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 200ms'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-blue)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
              }}
            />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              You can customize the name or use the auto-generated one
            </div>
          </div>

          {/* Product Selection */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Product *
            </label>
            <select
              value={selectedProduct?.id || ''}
              onChange={(e) => {
                const product = MOCK_PRODUCTS.find(p => p.id === e.target.value);
                setSelectedProduct(product || null);
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <option value="">Select a product...</option>
              {MOCK_PRODUCTS.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.indication})
                </option>
              ))}
            </select>
          </div>

          {/* Product Details (shown when selected) */}
          {selectedProduct && (
            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Therapeutic Area
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {selectedProduct.therapeuticArea}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Launch Status
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {selectedProduct.launchStatus}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Indication
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>
                  {selectedProduct.indication}
                </div>
              </div>
            </div>
          )}

          {/* Configuration Template */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: '12px'
            }}>
              Configuration Template
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                backgroundColor: copyFromOriginal ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-secondary)',
                border: `1px solid ${copyFromOriginal ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 200ms'
              }}>
                <input
                  type="radio"
                  checked={copyFromOriginal}
                  onChange={() => setCopyFromOriginal(true)}
                  style={{ marginTop: '2px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Copy from Original Configuration
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Use existing metric weights, basket configuration, and curation settings as starting point
                  </div>
                </div>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                backgroundColor: !copyFromOriginal ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-secondary)',
                border: `1px solid ${!copyFromOriginal ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 200ms'
              }}>
                <input
                  type="radio"
                  checked={!copyFromOriginal}
                  onChange={() => setCopyFromOriginal(false)}
                  style={{ marginTop: '2px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Start Fresh
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Begin with default configuration values for the selected product
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddSimulation}
            disabled={!selectedProduct || !simulationName.trim()}
          >
            Add Simulation
          </Button>
        </div>
      </div>
    </div>
  );
};
