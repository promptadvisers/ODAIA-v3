import { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { useAppStore } from './store/appStore';

// Screens
import { MainDashboard } from './screens/MainDashboard';
import { TeamScreen } from './screens/TeamScreen';
import { DocumentsScreen } from './screens/DocumentsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ReportTab } from './screens/ReportTab';

// Dialogs
import { BrandAccessDialog } from './dialogs/BrandAccessDialog';
import { HCPTargetingDialog } from './dialogs/HCPTargetingDialog';
import { NewProjectDialog } from './dialogs/NewProjectDialog';
import { EditBrandDialog } from './dialogs/EditBrandDialog';
import { CallPlanDialog } from './dialogs/CallPlanDialog';
import { ProjectObjectiveDialog } from './dialogs/ProjectObjectiveDialog';
import { SetupDetailDialog } from './dialogs/SetupDetailDialog';
import { ValueEngineReviewDialog } from './dialogs/ValueEngineReviewDialog';
import { ValueEngineEditDialog } from './dialogs/ValueEngineEditDialog';
import { CurationReviewDialog } from './dialogs/CurationReviewDialog';
import { SimulationReportDialog } from './dialogs/SimulationReportDialog';
import { CurationAdvancedConfigDialog } from './dialogs/CurationAdvancedConfigDialog';

function App() {
  const [activeTab, setActiveTab] = useState('brand');
  const [editingItem, setEditingItem] = useState<any>(null);
  const { 
    activeSidebarItem, 
    setActiveSidebarItem, 
    activeModal, 
    setActiveModal,
    editingCardType,
    theme: _theme 
  } = useAppStore();

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);
  
  // Handle navigation to Report tab from chat
  useEffect(() => {
    const handleNavigateToReport = () => {
      setActiveTab('report');
    };
    
    window.addEventListener('navigateToReport', handleNavigateToReport);
    return () => window.removeEventListener('navigateToReport', handleNavigateToReport);
  }, []);

  const tabs = [
    { id: 'brand', label: 'Brand' },
    { id: 'setup', label: 'Setup' },
    { id: 'report', label: 'Report' }
  ];

  // Function to handle navigation from main dashboard
  const handleNavigate = (screen: string) => {
    setActiveModal(screen);
  };

  const renderContent = () => {
    // If sidebar item is selected, show that screen
    if (activeSidebarItem === 'team') {
      return <TeamScreen />;
    }
    if (activeSidebarItem === 'documents') {
      return <DocumentsScreen />;
    }
    if (activeSidebarItem === 'settings') {
      return <SettingsScreen />;
    }
    if (activeSidebarItem === 'profile') {
      return <ProfileScreen />;
    }

    // Show main dashboard with tabs when no sidebar item is selected
    return (
      <div style={{ flex: 1, backgroundColor: 'var(--bg-main)', display: 'flex', flexDirection: 'column' }}>
        <Header tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeTab === 'report' ? (
            <ReportTab />
          ) : (
            <MainDashboard onNavigate={handleNavigate} activeTab={activeTab} onEdit={setEditingItem} onTabChange={setActiveTab} />
          )}
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
        <Sidebar 
          activeSection={activeSidebarItem} 
          onSectionChange={setActiveSidebarItem}
          onLogoClick={() => setActiveTab('brand')} 
        />
        
        {renderContent()}

        {/* Dialogs */}
        <BrandAccessDialog 
          isOpen={activeModal === 'brand-access'} 
          onClose={() => setActiveModal(null)} 
        />
        
        <HCPTargetingDialog 
          isOpen={activeModal === 'hcp-targeting'} 
          onClose={() => setActiveModal(null)} 
        />
        
        <NewProjectDialog 
          isOpen={activeModal === 'new-project'} 
          onClose={() => setActiveModal(null)} 
        />
        
        <EditBrandDialog
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          itemKey={editingItem}
        />
        
        <CallPlanDialog
          isOpen={activeModal === 'call-plan'}
          onClose={() => setActiveModal(null)}
        />
        
        <ProjectObjectiveDialog
          isOpen={activeModal === 'project-objective'}
          onClose={() => setActiveModal(null)}
          cardType={editingCardType || undefined}
        />
        
        <SetupDetailDialog
          isOpen={activeModal === 'setup-detail'}
          onClose={() => setActiveModal(null)}
          cardType={editingCardType === 'hcp-targeting' || editingCardType === 'call-plan' ? editingCardType : undefined}
        />

        <ValueEngineReviewDialog />
        <ValueEngineEditDialog />
        <CurationReviewDialog />
        <SimulationReportDialog />
        <CurationAdvancedConfigDialog />
      </div>
    </Router>
  );
}

export default App;