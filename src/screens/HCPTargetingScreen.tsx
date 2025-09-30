import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { FileText, Plus, Edit2 } from 'lucide-react';

interface HCPTargetingScreenProps {
  onNavigate: (screen: any) => void;
}

export const HCPTargetingScreen: React.FC<HCPTargetingScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('setup');
  const [activeSection, setActiveSection] = useState('documents');

  const tabs = [
    { id: 'brand', label: 'Brand' },
    { id: 'setup', label: 'Setup' },
    { id: 'live', label: 'Live' }
  ];

  const documents = [
    {
      name: 'odaiazol_strategy_H2_2025.pdf',
      size: '3.4 MB'
    },
    {
      name: 'Notes: "Brand Strategy H2 2025 Overview".docx',
      size: '3.4 MB'
    }
  ];

  const setupItems = [
    {
      title: 'Value Engine: HCP Targeting',
      subtitle: 'Established Product',
      metrics: '70/30 Value Weighting',
      description: 'This defines how we value HCPs for scoring.',
      status: 'Ready for Review',
      action: 'View'
    },
    {
      title: 'Curation Engine: Call Plan',
      subtitle: '40 HCP/Week',
      metrics: '12 Signals',
      additionalInfo: 'Reach & Frequency',
      description: 'Define what, how and how often you would like our suggestions delivered to your sales reps.',
      status: 'Ready for Review',
      action: 'View'
    }
  ];

  const suggestions = [
    'Add Copay Card PSP',
    'Change Sales goals to NBRx increase by 10%'
  ];

  return (
    <div className="flex h-screen bg-dark">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex">
        <div className="w-[430px] bg-secondary border-r border-border-secondary">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">👋</span>
              <div>
                <h1 className="text-xl font-semibold text-text-primary">
                  I'm your Maptual<br />Configuration Assistant
                </h1>
              </div>
            </div>
            
            <p className="text-text-secondary mb-6 text-sm">
              To get started, upload any slide decks, documents, or meeting notes that outline your brand strategy.
            </p>
            
            <p className="text-text-secondary mb-6 text-sm">
              I'll extract strategic insights to suggest optimal configurations for Maptual Field.
            </p>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-text-muted" />
                <span className="text-sm text-text-secondary">2 documents uploaded</span>
              </div>
              
              {documents.map((doc, index) => (
                <div key={index} className="bg-card rounded-lg p-3 mb-2 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-text-muted mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-text-primary">{doc.name}</p>
                    <p className="text-xs text-text-muted">{doc.size}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 bg-card rounded-lg border border-border-secondary hover:bg-hover transition-colors text-sm text-text-primary"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-3 bg-card rounded-lg border border-border-secondary">
              <textarea
                className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none"
                placeholder="Ask Agent"
                rows={3}
              />
              <div className="flex items-center justify-between mt-2">
                <button className="p-1.5 hover:bg-hover rounded transition-colors">
                  <Plus className="w-4 h-4 text-text-muted" />
                </button>
                <button className="p-1.5 hover:bg-hover rounded transition-colors">
                  <Edit2 className="w-4 h-4 text-text-muted" />
                  <span className="ml-1 text-xs text-text-muted">Edit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <Header tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="p-6">
            <div className="space-y-6">
              {setupItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-text-secondary">{item.subtitle}</span>
                          <span className="text-sm text-text-muted">{item.metrics}</span>
                          {item.additionalInfo && (
                            <span className="text-sm text-text-muted">{item.additionalInfo}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant="warning">
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-secondary mb-4">{item.description}</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => item.title.includes('HCP Targeting') && onNavigate('hcp-dialog')}
                      >
                        Approve
                      </Button>
                      <Button variant="ghost" size="sm">
                        {item.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};