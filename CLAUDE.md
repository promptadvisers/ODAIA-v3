# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (runs on port 5173)
npm run dev

# Type-check and build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Architecture Overview

### Technology Stack
- **React 19.1.1** with TypeScript 5.8.3
- **Vite 7.1.2** for build tooling
- **Zustand 5.0.8** for state management
- **Tailwind CSS 4.1.13** for styling
- **React Router DOM 7.9.1** for routing
- **Radix UI** components for accessible primitives
- **Recharts** for data visualization

### Application Structure

ODAIA is a pharmaceutical brand configuration platform with a three-tab main interface (Brand/Setup/Report) and a persistent AI assistant chat panel. The application follows a modal-driven configuration workflow.

#### Core Components:

**App.tsx**: Main entry point managing routing, tab state, and modal visibility. Handles navigation between sidebar screens and main dashboard tabs.

**Sidebar Navigation**: Provides access to Team, Documents, Settings, and Profile screens. Clicking the logo returns to the Brand dashboard.

**Header**: Tab navigation for Brand, Setup, and Report sections.

**MainDashboard**: Left panel contains AI chat assistant; right panel shows configuration cards. Active on Brand and Setup tabs.

#### State Management (Zustand)

**appStore.ts** manages:
- File uploads and processing state
- Brand configuration (brand identity, access strategy, sales goals, competitive landscape, medical objectives)
- Product configuration (baskets, metrics, therapeutic areas, indications)
- UI state (active modals, editing card types, theme, sidebar selection)

**chatStore.ts** manages:
- Chat messages and pre-prompted suggestions
- AI assistant demo flow with multi-step conversations
- Task execution states (thinking, typing, executing)
- Simulation triggering and navigation

### Key Architectural Patterns

**Modal Workflow**: Configuration is done through context-aware dialogs triggered by card interactions. Each card has View/Approve buttons that open detailed configuration modals.

**Card Interaction Pattern**:
- Click card body → Quick review dialog
- Click Approve/View button → Detailed configuration dialog

**Demo Flow System**: The chat assistant implements a scripted demo flow (steps 0-7) that guides users through configuration, metric adjustment, and simulation execution. Uses realistic loading states with randomized timing.

**Theme System**: Dark/light theme switching via CSS custom properties stored in localStorage. Theme applied to `data-theme` attribute on document root.

**Tab Navigation with Assistant**: The chat assistant can programmatically navigate between tabs by dispatching custom events (e.g., 'navigateToReport').

### Screen Components

Located in `src/screens/`:
- **MainDashboard.tsx**: Brand/Setup tab content with configuration cards
- **ReportTab.tsx**: Simulation runner, results visualization, and final report generation
- **TeamScreen.tsx**: Team management interface
- **DocumentsScreen.tsx**: Document library
- **SettingsScreen.tsx**: Application settings
- **ProfileScreen.tsx**: User profile

### Dialog Components

Located in `src/dialogs/`:
- **ProjectObjectiveDialog.tsx**: Multi-purpose, context-aware dialog for medical objectives, brand access, sales goals, and competitive landscape
- **SetupDetailDialog.tsx**: Quick review interface for setup cards
- **HCPTargetingDialog.tsx**: Healthcare professional targeting configuration
- **CallPlanDialog.tsx**: Call plan configuration
- **BrandAccessDialog.tsx**: PSP programs, copay cards, market access
- **EditBrandDialog.tsx**: Brand identity editing
- **NewProjectDialog.tsx**: New project creation

### Chat System

Located in `src/components/Chat/`:
- **ChatInterface.tsx**: Main chat panel with file upload, messages, and pre-prompted buttons
- **ChatMessage.tsx**: Individual message rendering with thinking/typing states
- **PrePromptedButton.tsx**: Suggested action buttons below chat

The chat system implements a demo flow that simulates AI-driven configuration assistance, including:
- Document processing simulation
- Configuration gap identification
- Metric weight adjustment
- Simulation setup and execution
- Results application

### Report & Simulation System

Located in `src/components/Report/`:
- **SimulationRunner.tsx**: Progress tracking for multi-scenario simulations
- **SimulationResults.tsx**: Comparison visualization between scenarios
- **FinalReportView.tsx**: Comprehensive report generation

Simulations can be triggered from chat assistant and run multiple scenarios to compare configuration parameters.

### Setup Components

Located in `src/components/Setup/`:
- **BasketSection.tsx**: Market basket configuration
- **MetricsTable.tsx**: Metric weight management
- **ProductTreeModal.tsx**: Product/therapeutic area selection
- **TotalMarketTreeModal.tsx**: Total market product selection
- **TreeSelector.tsx**: Reusable tree selection component

## Styling

**Primary CSS**: `src/index.css` contains theme variables and global styles
**Theme Variables**: `--bg-main`, `--bg-secondary`, `--bg-card`, `--text-primary`, `--text-secondary`, `--accent-blue`, `--accent-teal`
**Tailwind**: Used alongside CSS variables for utility styling
**Dark Theme**: Default theme; light theme available via toggle

## Data Persistence

- Uploaded files stored in localStorage as `uploadedFiles`
- Theme preference stored in localStorage as `theme`
- Most application state managed in-memory via Zustand stores

## Important Development Notes

1. **Modal Management**: Active modal controlled by `activeModal` in appStore. Set to null to close all modals.

2. **Card Type Editing**: `editingCardType` state tracks which configuration card is being edited, enabling context-aware modal content.

3. **Simulation Flow**: Simulations set `simulationTriggered` flag in chatStore and dispatch 'navigateToReport' event to navigate to Report tab.

4. **File Processing**: File uploads trigger a 3-second simulated processing state (`isProcessingFile`).

5. **Demo Steps**: Chat assistant follows a numbered step flow (0-7). Each step updates state, shows loading states, and presents next action prompts.

6. **TypeScript Strict Mode**: Enabled via tsconfig.json. All components should be fully typed.

7. **Component Reusability**: Prefer context-aware components over duplication (e.g., ProjectObjectiveDialog adapts based on card type).

## Configuration Objects

**BrandConfig Structure**:
- brand: status, tags, description, approved
- brandAccess: status, pspProgram, finicalSupport, webPortal, marketAccess, approved
- salesGoals: status, description, approved
- competitiveLandscape: status, tags, description, approved
- medicalObjectives: status, basketName, basketScore, therapeuticArea, product, indications, scoringWeights, approved

**ProductConfiguration Structure**:
- basketName, basketWeight, therapeuticArea, product, indication
- specialties
- metrics: array of {name, weight, visualize}
- competitiveOpportunities, precursor, analog arrays

## Common Tasks

**Add new configuration card**: Update MainDashboard, create corresponding dialog, add to appStore's editingCardType union

**Add chat demo step**: Extend executeDemoStep switch statement in chatStore with new step number and logic

**Add new metric**: Update metrics array in productConfig via updateProductConfig action

**Theme modification**: Edit CSS custom properties in index.css for both [data-theme="dark"] and [data-theme="light"]

**Navigation between sections**: Use setActiveSidebarItem for sidebar screens, setActiveTab for Brand/Setup/Report tabs
