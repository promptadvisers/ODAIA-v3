import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { FileUpload, FileList } from '../components/FileUpload';
import { Plus, Edit2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { SetupTab } from './SetupTab';
import { ChatInterface } from '../components/Chat/ChatInterface';

interface MainDashboardProps {
  onNavigate?: (screen: string) => void;
  activeTab?: string;
  onEdit?: (item: string) => void;
  onTabChange?: (tab: string) => void;
  onStartSimulation?: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ onNavigate, activeTab = 'brand', onEdit, onTabChange, onStartSimulation }) => {
  const { uploadedFiles, brandConfig, setActiveModal, isProcessingFile, hasUploadedFiles, setEditingCardType, updateBrandConfig, selectedWorkflow, setSelectedWorkflow, setSetupReady } = useAppStore();
  const [editingCard, setEditingCard] = React.useState<string | null>(null);
  const [editValues, setEditValues] = React.useState<{ [key: string]: string }>({});
  const [originalValues, setOriginalValues] = React.useState<{ [key: string]: string }>({});
  const [approvedCards, setApprovedCards] = React.useState<Set<string>>(new Set());

  const brandItems = [
    {
      title: 'Brand',
      tags: brandConfig.brand.tags,
      description: brandConfig.brand.description,
      status: brandConfig.brand.status,
      approved: brandConfig.brand.approved
    },
    {
      title: 'Brand Access Strategy',
      tags: ['OncoConnect PSP', 'OncoThera Copay Card', 'OncoPortal web'],
      description: 'The access strategy for OncoThera includes the OncoConnect PSP to streamline patient access, the OncoThera Copay Card for eligible patients, and the OncoPortal web platform for real-time prior authorization and patient tracking.',
      status: brandConfig.brandAccess.status,
      approved: brandConfig.brandAccess.approved,
      onClick: () => onNavigate?.('brand-access')
    },
    {
      title: 'Sales Goals',
      tags: ['XPO TRx', 'Increase volume by 20%', 'Breast Cancer'],
      description: 'Focus on driving a sustained increase in TRx volume in the 2L HER2+ metastatic breast cancer segment by expanding adoption among high-volume oncologists, capturing switches from T-DM1, and supporting persistence through PSP and copay programs',
      status: brandConfig.salesGoals.status,
      approved: brandConfig.salesGoals.approved
    },
    {
      title: 'Competitive Landscape',
      tags: brandConfig.competitiveLandscape.tags,
      description: brandConfig.competitiveLandscape.description,
      status: brandConfig.competitiveLandscape.status,
      approved: brandConfig.competitiveLandscape.approved
    },
    {
      title: 'Medical Objectives',
      tags: ['Target Product Nacida', `Score: ${brandConfig.medicalObjectives.basketScore}/10`, ...brandConfig.medicalObjectives.indications],
      description: `Configure primary objectives for ${brandConfig.medicalObjectives.basketName || 'medical products'}. This includes therapeutic area targeting, indication selection, and scoring weight configurations for optimal HCP targeting and engagement strategies.`,
      status: brandConfig.medicalObjectives.status,
      approved: brandConfig.medicalObjectives.approved
    }
  ];

  // Check if all brand items are ready
  const allItemsReady = brandItems.every(item => item.status === 'Ready');

  // Update setupReady state when status changes
  React.useEffect(() => {
    setSetupReady(allItemsReady);
  }, [allItemsReady, setSetupReady]);

  const handleRunSetup = () => {
    if (allItemsReady && onTabChange) {
      onTabChange('setup');
    }
  };

  const handleApproveCard = (cardTitle: string) => {
    setApprovedCards(prev => new Set(prev).add(cardTitle));
  };

  const handleApproveAll = () => {
    const allTitles = brandItems.map(item => item.title);
    setApprovedCards(new Set(allTitles));
  };

  // Filter out approved cards
  const visibleBrandItems = brandItems.filter(item => !approvedCards.has(item.title));

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Assistant Panel */}
      <div style={{ 
        width: '380px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ padding: '24px 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '22px' }}>👋</span>
            <div style={{ flex: 1 }}>
              <h1 style={{ 
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                lineHeight: '1.4',
                margin: 0
              }}>
                I'm your Maptual<br />
                Configuration Assistant
              </h1>
            </div>
          </div>
          
          {/* Instructions */}
          <p style={{ 
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '14px',
            lineHeight: '1.5'
          }}>
            To get started, upload any slide decks, documents, or meeting notes that outline your brand strategy.
          </p>
          
          <p style={{ 
            fontSize: '13px',
            color: 'var(--text-secondary)',
            marginBottom: '20px',
            lineHeight: '1.5'
          }}>
            I'll extract strategic insights to suggest optimal configurations for Maptual Field.
          </p>
          
          {/* File Upload or List */}
          {uploadedFiles.length === 0 ? (
            <FileUpload />
          ) : (
            <FileList />
          )}
          
          {/* Chat Interface - Replace suggestions and input area when files are uploaded */}
          {uploadedFiles.length > 0 ? (
            <div style={{
              marginTop: '24px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0
            }}>
              <ChatInterface activeTab={activeTab} />
            </div>
          ) : (
            /* Original Input Area for when no files uploaded */
            <div style={{ marginTop: 'auto' }}>
              <div style={{ 
                backgroundColor: 'var(--bg-input)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                padding: '12px'
              }}>
                <textarea
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    resize: 'none',
                    border: 'none',
                    outline: 'none',
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Ask Agent"
                  rows={5}
                  disabled
                />
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '12px'
                }}>
                  <button 
                    onClick={() => setActiveModal('new-project')}
                    style={{
                      padding: '6px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      transition: 'background-color 200ms'
                    }}
                  >
                    <Plus style={{ width: '18px', height: '18px', color: 'var(--text-muted)' }} />
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'background-color 200ms'
                  }}>
                    <Edit2 style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
        <div>
          {/* Show processing state */}
          {isProcessingFile && (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                margin: '0 auto 20px',
                border: '3px solid var(--border-primary)',
                borderTop: '3px solid var(--accent-blue)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                Processing your documents...
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)'
              }}>
                Extracting strategic insights and generating configuration suggestions
              </p>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          {/* Notification Banner */}
          {activeTab === 'brand' && hasUploadedFiles && !isProcessingFile && (
            <>
              <div style={{
                padding: '18px 24px',
                backgroundColor: allItemsReady ? 'rgba(59, 130, 246, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                borderRadius: '8px',
                border: `1px solid ${allItemsReady ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '6px',
                    letterSpacing: '-0.01em'
                  }}>
                    {allItemsReady ? 'Ready to run setup' : 'Missing information to run setup'}
                  </h3>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    {allItemsReady
                      ? 'All the information that is required is ready.'
                      : 'Add the missing information so that we can run setup.'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {allItemsReady && (
                    <select
                      value={selectedWorkflow}
                      onChange={(e) => setSelectedWorkflow(e.target.value as 'sales' | 'marketing')}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        outline: 'none',
                        fontWeight: '500'
                      }}
                    >
                      <option value="sales">Sales</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  )}
                  <Button
                    onClick={handleRunSetup}
                    disabled={!allItemsReady}
                    size="sm"
                  >
                    Run Setup
                  </Button>
                </div>
              </div>

              {/* Approve All Button - Only show if there are visible cards */}
              {visibleBrandItems.length > 0 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '16px'
                }}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleApproveAll}
                  >
                    Approve All
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Show brand items only after file upload */}
          {activeTab === 'brand' && hasUploadedFiles && !isProcessingFile && visibleBrandItems.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <CardTitle>{item.title}</CardTitle>
                  <Badge variant={item.status === 'Ready' ? 'success' : 'warning'}>
                    {item.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {item.tags && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {item.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} style={{
                        padding: '4px 10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: '500',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {/* Inline editing for Brand and Sales Goals */}
                {(item.title === 'Brand' || item.title === 'Sales Goals') && editingCard === item.title ? (
                  <div style={{ position: 'relative' }}>
                    <textarea
                    value={editValues[item.title] || item.description}
                    onChange={(e) => setEditValues(prev => ({ ...prev, [item.title]: e.target.value }))}
                    onKeyDown={(e) => {
                      // Cancel on ESC key
                      if (e.key === 'Escape') {
                        setEditValues(prev => ({ ...prev, [item.title]: originalValues[item.title] || '' }));
                        setEditingCard(null);
                      }
                    }}
                    onBlur={(e) => {
                      // Don't save if we're clicking on another editable field
                      const relatedTarget = e.relatedTarget as HTMLElement;
                      if (relatedTarget && relatedTarget.tagName === 'TEXTAREA') {
                        return;
                      }
                      
                      // Save the changes
                      if (item.title === 'Brand') {
                        updateBrandConfig({
                          ...brandConfig,
                          brand: { ...brandConfig.brand, description: editValues[item.title] || item.description || '' }
                        });
                      } else if (item.title === 'Sales Goals') {
                        updateBrandConfig({
                          ...brandConfig,
                          salesGoals: { ...brandConfig.salesGoals, description: editValues[item.title] || item.description || '' }
                        });
                      }
                      setEditingCard(null);
                    }}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '4px',
                      resize: 'vertical',
                      marginBottom: '20px',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                    <div style={{ 
                      fontSize: '11px', 
                      color: 'var(--text-muted)', 
                      marginTop: '4px' 
                    }}>
                      Press ESC to cancel • Click outside to save
                    </div>
                  </div>
                ) : item.description ? (
                  <p 
                    style={{ 
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      marginBottom: '20px',
                      lineHeight: '1.6',
                      cursor: (item.title === 'Brand' || item.title === 'Sales Goals') ? 'text' : 'default'
                    }}
                    onClick={() => {
                      if (item.title === 'Brand' || item.title === 'Sales Goals') {
                        setEditingCard(item.title);
                        setEditValues(prev => ({ ...prev, [item.title]: item.description || '' }));
                        setOriginalValues(prev => ({ ...prev, [item.title]: item.description || '' }));
                      }
                    }}
                  >{item.description}</p>
                ) : null}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleApproveCard(item.title);
                    }}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      // For Brand and Sales Goals, trigger inline editing
                      if (item.title === 'Brand' || item.title === 'Sales Goals') {
                        setEditingCard(item.title);
                        setEditValues(prev => ({ ...prev, [item.title]: item.description || '' }));
                        setOriginalValues(prev => ({ ...prev, [item.title]: item.description || '' }));
                        return;
                      }
                      
                      const itemKey = item.title === 'Brand' ? 'brand' : 
                                     item.title === 'Brand Access Strategy' ? 'brandAccess' :
                                     item.title === 'Sales Goals' ? 'salesGoals' :
                                     item.title === 'Competitive Landscape' ? 'competitiveLandscape' :
                                     item.title === 'Medical Objectives' ? 'medicalObjectives' : null;
                      
                      // If Brand Access Strategy has missing info, open the form dialog
                      if (itemKey === 'brandAccess' && item.status === 'Missing info') {
                        setActiveModal('brand-access');
                      }
                      // Otherwise route specific cards to the ProjectObjectiveDialog
                      else if (itemKey === 'medicalObjectives' || itemKey === 'brandAccess' || 
                          itemKey === 'competitiveLandscape') {
                        setEditingCardType(itemKey);
                        setActiveModal('project-objective');
                      } else if (itemKey && onEdit) {
                        onEdit(itemKey);
                      }
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Show prompt to upload files if none uploaded */}
          {activeTab === 'brand' && !hasUploadedFiles && !isProcessingFile && (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                No insights available yet
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)'
              }}>
                Upload brand strategy documents to generate configuration insights
              </p>
            </div>
          )}
          
          {activeTab === 'setup' && (
            <SetupTab onNavigateToReport={onStartSimulation || (() => onTabChange && onTabChange('report'))} />
          )}
        </div>
      </div>
    </div>
  );
};