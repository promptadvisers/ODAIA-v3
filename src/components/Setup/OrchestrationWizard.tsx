import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../Button';
import { Toggle } from '../Toggle';
import './OrchestrationWizard.css';

export interface OrchestrationWizardState {
  objective: string;
  personas: string[];
  stages: string[];
  tactics: string[];
  sellingTeams: string[];
  campaignLength: number;
  adjustForMarket: boolean;
}

interface OrchestrationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (payload: OrchestrationWizardState) => void;
  initialState?: OrchestrationWizardState | null;
}

const OBJECTIVE_OPTIONS = ['Odaiazol Objective', 'Vectoral Objective'];

const PERSONA_OPTIONS = [
  'Dabbler Persona',
  'New Writer Persona',
  'Loyalist Persona',
  'Defector Persona',
  'New Grad Persona'
];

const STAGE_OPTIONS = ['Awareness', 'Interested', 'Deciding', 'Writing', 'Advocating'];

const TACTIC_OPTIONS = [
  'sales rep - driven email',
  'sales rep - face to face',
  'sales rep - phone call',
  'sales rep - virtual call',
  'sales rep - sample drop',
  'sales rep - lunch and learn',
  'marketer - trade desk ctv advanced tv',
  'marketer - trade desk display',
  'marketer - dependent ctv advanced tv',
  'marketer - dependent display',
  'marketer - dependent pre roll video',
  'marketer - medscape display',
  'marketer - medscape email',
  'marketer - pulsepoint ctv advanced tv',
  'marketer - pulsepoint display',
  'marketer - pulsepoint pre roll video',
  'marketer - medscape advanced learning center'
];

const SELLING_TEAM_OPTIONS: Array<{ id: string; defaultChecked?: boolean }> = [
  { id: 'P0 MARKETING: RESP' },
  { id: 'P1 SALES: RESP COPD' },
  { id: 'P2 SALES: RESP ASTHMA' },
  { id: 'P3 SALES: DIABETES' },
  { id: 'P4 SALES: IMMUNOLOGY', defaultChecked: true },
  { id: 'P5 SALES: VACCINE' },
  { id: 'P6 SALES: ONCOLOGY', defaultChecked: true }
];

const DEFAULT_STATE: OrchestrationWizardState = {
  objective: OBJECTIVE_OPTIONS[0],
  personas: [...PERSONA_OPTIONS],
  stages: [...STAGE_OPTIONS],
  tactics: [...TACTIC_OPTIONS],
  sellingTeams: SELLING_TEAM_OPTIONS.filter((team) => team.defaultChecked).map((team) => team.id),
  campaignLength: 1,
  adjustForMarket: false
};

const PersonaPill: React.FC<{ label: string }> = ({ label }) => <span className="wizard-chip">{label}</span>;

const ObjectiveSelect: React.FC<{
  value: string;
  options: string[];
  onChange: (value: string) => void;
}> = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!open) return;
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const selectedLabel = value || 'Select an objective...';

  return (
    <div className="wizard-select">
      <button
        ref={triggerRef}
        type="button"
        className={`wizard-select-trigger${open ? ' is-open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? '' : 'wizard-select-placeholder-text'}>{selectedLabel}</span>
        <span className="wizard-select-icon">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="wizard-select-menu" role="listbox" ref={menuRef}>
          {options.map((option) => {
            const isActive = option === value;
            return (
              <button
                key={option}
                type="button"
                className={`wizard-select-option${isActive ? ' is-active' : ''}`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setTimeout(() => triggerRef.current?.focus(), 0);
                }}
                role="option"
                aria-selected={isActive}
              >
                <span>{option}</span>
                {isActive && <span className="wizard-select-check">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const OrchestrationWizard: React.FC<OrchestrationWizardProps> = ({ isOpen, onClose, onSave, initialState }) => {
  const [state, setState] = useState<OrchestrationWizardState>(initialState || DEFAULT_STATE);
  const [personasOpen, setPersonasOpen] = useState(false);
  const [stagesOpen, setStagesOpen] = useState(false);
  const [tacticsOpen, setTacticsOpen] = useState(false);
  const objectiveOptions = useMemo(() => OBJECTIVE_OPTIONS, []);

  useEffect(() => {
    if (isOpen) {
      setState(initialState || DEFAULT_STATE);
      setPersonasOpen(false);
      setStagesOpen(false);
      setTacticsOpen(false);
    }
  }, [isOpen, initialState]);

  if (!isOpen) {
    return null;
  }

  const toggleValue = (collection: string[], value: string) =>
    collection.includes(value) ? collection.filter((item) => item !== value) : [...collection, value];

  const handlePersonaToggle = (value: string) =>
    setState((prev) => ({ ...prev, personas: toggleValue(prev.personas, value) }));

  const handleStageToggle = (value: string) =>
    setState((prev) => ({ ...prev, stages: toggleValue(prev.stages, value) }));

  const handleTacticToggle = (value: string) =>
    setState((prev) => ({ ...prev, tactics: toggleValue(prev.tactics, value) }));

  const handleTeamToggle = (value: string) =>
    setState((prev) => ({ ...prev, sellingTeams: toggleValue(prev.sellingTeams, value) }));

  const handleReset = () => {
    setState(initialState || DEFAULT_STATE);
    setPersonasOpen(false);
    setStagesOpen(false);
    setTacticsOpen(false);
  };

  const handleSave = () => {
    onSave?.(state);
    onClose();
  };

  const renderSection = (
    title: string,
    isOpen: boolean,
    onToggle: () => void,
    summary: string,
    content: React.ReactNode
  ) => (
    <div className="wizard-section">
      <button type="button" onClick={onToggle} className="wizard-section-toggle">
        <span>{title}</span>
        <div className="wizard-section-meta">
          <span className="wizard-section-summary">{summary}</span>
          <span className="wizard-section-chevron">{isOpen ? '▴' : '▾'}</span>
        </div>
      </button>
      {isOpen && <div className="wizard-section-content">{content}</div>}
    </div>
  );

  const renderCheckboxGrid = (options: string[], selected: string[], onToggle: (value: string) => void) => (
    <div className="wizard-checkbox-grid">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <label key={option} className={`wizard-checkbox-card${checked ? ' is-checked' : ''}`}>
            <span>{option}</span>
            <input type="checkbox" checked={checked} onChange={() => onToggle(option)} />
          </label>
        );
      })}
    </div>
  );

  return (
    <div className="wizard-overlay">
      <div className="wizard-container">
        <div className="wizard-header">
          <div className="wizard-header-start">
            <button onClick={onClose} aria-label="Close wizard" className="wizard-close-btn">
              ×
            </button>
            <div>
              <h2 className="wizard-title">Guided Configuration Wizard</h2>
              <p className="wizard-subtitle">Follow these steps to configure your complete Maptual project and curation settings</p>
            </div>
          </div>
          <div className="wizard-action-group">
            <Button variant="ghost" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="wizard-progress">
          <div className="wizard-stepper">
            {['Project Template', 'Score Simulations', 'Campaign Setup', 'Review & Save'].map((step, index) => (
              <React.Fragment key={step}>
                <div className="wizard-step">
                  <div className={`wizard-step-circle ${index < 2 ? 'complete' : index === 2 ? 'active' : 'upcoming'}`}>
                    {index < 2 ? '✓' : index + 1}
                  </div>
                  <span className="wizard-step-label">{step}</span>
                </div>
                {index < 3 && <div className="wizard-step-divider" />}
              </React.Fragment>
            ))}
          </div>
          <div className="wizard-stepper-title">
            <h3>Step 3: Campaign Setup</h3>
            <p>Tactics and Sequencing settings</p>
          </div>
        </div>

        <div className="wizard-body">
          <div className="wizard-field-group">
            <label className="wizard-label">Select an objective</label>
            <ObjectiveSelect value={state.objective} options={objectiveOptions} onChange={(value) => setState((prev) => ({ ...prev, objective: value }))} />
          </div>

          <div className="wizard-grid">
            {renderSection(
              'Personas',
              personasOpen,
              () => setPersonasOpen((prev) => !prev),
              `${state.personas.length} selected`,
              <>
                <div className="wizard-chip-row">
                  {state.personas.length === 0 ? (
                    <span className="wizard-empty-state">No personas selected</span>
                  ) : (
                    state.personas.map((persona) => <PersonaPill key={persona} label={persona} />)
                  )}
                </div>
                {renderCheckboxGrid(PERSONA_OPTIONS, state.personas, handlePersonaToggle)}
              </>
            )}

            {renderSection(
              'Global Journey Stages',
              stagesOpen,
              () => setStagesOpen((prev) => !prev),
              `${state.stages.length} stages selected`,
              renderCheckboxGrid(STAGE_OPTIONS, state.stages, handleStageToggle)
            )}

            {renderSection(
              'Campaign Tactic Events',
              tacticsOpen,
              () => setTacticsOpen((prev) => !prev),
              `${state.tactics.length} tactics selected`,
              <div className="wizard-section-scroll">{renderCheckboxGrid(TACTIC_OPTIONS, state.tactics, handleTacticToggle)}</div>
            )}

            <div>
              <div className="wizard-section-header">
                <span className="wizard-section-heading">Associated Odaiazol Selling Team</span>
                <span className="wizard-section-subtitle">Sequencing will be adjusted based on the following selling teams activity.</span>
              </div>
              <div className="wizard-selling-team">
                {SELLING_TEAM_OPTIONS.map((team) => (
                  <label key={team.id}>
                    <input type="checkbox" checked={state.sellingTeams.includes(team.id)} onChange={() => handleTeamToggle(team.id)} />
                    <span>{team.id}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="wizard-card">
              <div className="wizard-card-title">Campaign Settings</div>
              <div>
                <div className="wizard-range-label">Campaign Length</div>
                <div className="wizard-range-value">{state.campaignLength} week{state.campaignLength > 1 ? 's' : ''}</div>
                <input
                  type="range"
                  min={1}
                  max={26}
                  value={state.campaignLength}
                  onChange={(event) => setState((prev) => ({ ...prev, campaignLength: parseInt(event.target.value, 10) }))}
                  style={{ width: '100%' }}
                />
                <div className="wizard-range-scale">
                  <span>1 week</span>
                  <span>26 weeks</span>
                </div>
              </div>
              <div className="wizard-toggle-row">
                <div className="wizard-toggle-copy">
                  <span className="wizard-toggle-title">Adjust to changing Market Conditions</span>
                  <span className="wizard-toggle-subtitle">Automatically recalibrate cadence when new signals appear.</span>
                </div>
                <Toggle
                  checked={state.adjustForMarket}
                  onChange={(checked) => setState((prev) => ({ ...prev, adjustForMarket: checked }))}
                  size="md"
                  ariaLabel="Adjust to changing Market Conditions"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
