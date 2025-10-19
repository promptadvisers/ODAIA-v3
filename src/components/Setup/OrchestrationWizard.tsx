import React, { useMemo, useState } from 'react';
import { Button } from '../Button';
import { Toggle } from '../Toggle';

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
  'New-to-Goal Persona'
];

const STAGE_OPTIONS = ['Awareness', 'Intended', 'Deciding', 'Writing', 'Advocating'];

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

const sectionContainerStyle: React.CSSProperties = {
  borderRadius: '12px',
  border: '1px solid rgba(100,116,139,0.25)',
  background: 'rgba(10, 13, 20, 0.85)',
  overflow: 'hidden'
};

const sectionHeaderStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 18px',
  background: 'rgba(17, 24, 39, 0.9)',
  color: 'var(--text-primary)',
  borderBottom: '1px solid rgba(100,116,139,0.25)',
  cursor: 'pointer',
  fontSize: '13px'
};

const sectionSummaryStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-secondary)'
};

const dropdownTagStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: '999px',
  background: 'rgba(37,99,235,0.12)',
  border: '1px solid rgba(59,130,246,0.35)',
  fontSize: '11px',
  color: 'rgba(191,219,254,0.9)',
  textTransform: 'capitalize'
};

const PersonaPill: React.FC<{ label: string }> = ({ label }) => <span style={dropdownTagStyle}>{label}</span>;

export const OrchestrationWizard: React.FC<OrchestrationWizardProps> = ({ isOpen, onClose, onSave, initialState }) => {
  const [state, setState] = useState<OrchestrationWizardState>(initialState || DEFAULT_STATE);
  const [personasOpen, setPersonasOpen] = useState(false);
  const [stagesOpen, setStagesOpen] = useState(false);
  const [tacticsOpen, setTacticsOpen] = useState(false);
  const objectiveOptions = useMemo(() => OBJECTIVE_OPTIONS, []);

  React.useEffect(() => {
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
    <div style={sectionContainerStyle}>
      <button type="button" onClick={onToggle} style={sectionHeaderStyle}>
        <span>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={sectionSummaryStyle}>{summary}</span>
          <span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>{isOpen ? '▴' : '▾'}</span>
        </div>
      </button>
      {isOpen && (
        <div
          style={{
            padding: '18px 20px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.85) 60%, rgba(12, 18, 31, 0.92) 100%)'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );

  const renderCheckboxGrid = (options: string[], selected: string[], onToggle: (value: string) => void) => (
    <div style={{ display: 'grid', gap: '12px' }}>
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <label
            key={option}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '10px',
              border: checked ? '1px solid rgba(59,130,246,0.55)' : '1px solid rgba(100,116,139,0.35)',
              background: checked ? 'rgba(37, 99, 235, 0.18)' : 'rgba(15, 23, 42, 0.35)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <span>{option}</span>
            <input type="checkbox" checked={checked} onChange={() => onToggle(option)} style={{ width: 16, height: 16 }} />
          </label>
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(2, 6, 23, 0.78)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        style={{
          width: '94vw',
          maxWidth: '1280px',
          maxHeight: '92vh',
          background: 'linear-gradient(155deg, rgba(8, 12, 24, 0.97) 10%, rgba(13, 18, 32, 0.96) 90%)',
          borderRadius: '18px',
          border: '1px solid rgba(100,116,139,0.35)',
          boxShadow: '0 40px 90px rgba(3, 10, 26, 0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(100,116,139,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={onClose}
              aria-label="Close wizard"
              style={{
                width: 36,
                height: 36,
                borderRadius: '999px',
                border: '1px solid rgba(148,163,184,0.4)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Guided Configuration Wizard</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
                Follow these steps to configure your complete Maptual project and curation settings
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
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

        <div style={{ padding: '18px 32px', borderBottom: '1px solid rgba(100,116,139,0.18)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {['Project Template', 'Score Simulations', 'Campaign Setup', 'Review & Save'].map((step, index) => {
              const status = index < 2 ? 'complete' : index === 2 ? 'active' : 'upcoming';
              const colors =
                status === 'complete'
                  ? { bg: 'rgba(34,197,94,0.25)', border: '1px solid rgba(34,197,94,0.6)', color: '#22c55e' }
                  : status === 'active'
                  ? { bg: 'rgba(59,130,246,0.28)', border: '1px solid rgba(59,130,246,0.7)', color: '#60a5fa' }
                  : { bg: 'rgba(100,116,139,0.15)', border: '1px solid rgba(100,116,139,0.35)', color: 'rgba(148,163,184,0.9)' };
              return (
                <React.Fragment key={step}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: colors.bg,
                        border: colors.border,
                        color: colors.color,
                        fontWeight: 600
                      }}
                    >
                      {status === 'complete' ? '✓' : index + 1}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{step}</span>
                  </div>
                  {index < 3 && <div style={{ flex: 1, height: 1, background: 'rgba(71,85,105,0.35)' }} />}
                </React.Fragment>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <h3 style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>Step 3: Campaign Setup</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: 4 }}>Tactics and Sequencing settings</p>
          </div>
        </div>

        <div style={{ padding: '26px 32px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: 8 }}>Select an objective</label>
            <select
              value={state.objective}
              onChange={(event) => setState((prev) => ({ ...prev, objective: event.target.value }))}
              style={{
                width: '100%',
                maxWidth: 460,
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.4)',
                background: 'linear-gradient(135deg, rgba(17,24,39,0.92), rgba(15,23,42,0.85))',
                color: 'var(--text-primary)',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled>
                Select an objective...
              </option>
              {objectiveOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gap: '20px' }}>
            {renderSection(
              'Personas',
              personasOpen,
              () => setPersonasOpen((prev) => !prev),
              `${state.personas.length} selected`,
              <div style={{ display: 'grid', gap: '14px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {state.personas.length === 0 ? (
                    <span style={{ color: 'var(--text-secondary)' }}>No personas selected</span>
                  ) : (
                    state.personas.map((persona) => <PersonaPill key={persona} label={persona} />)
                  )}
                </div>
                {renderCheckboxGrid(PERSONA_OPTIONS, state.personas, handlePersonaToggle)}
              </div>
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
              <div style={{ maxHeight: 260, overflowY: 'auto' }}>{renderCheckboxGrid(TACTIC_OPTIONS, state.tactics, handleTacticToggle)}</div>
            )}

            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>Associated Odaiazol Selling Team</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Sequencing will be adjusted based on the following selling teams activity.
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gap: '10px',
                  padding: '18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(148,163,184,0.35)',
                  background: 'rgba(11, 17, 29, 0.85)'
                }}
              >
                {SELLING_TEAM_OPTIONS.map((team) => (
                  <label key={team.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', fontSize: '13px' }}>
                    <input type="checkbox" checked={state.sellingTeams.includes(team.id)} onChange={() => handleTeamToggle(team.id)} />
                    <span>{team.id}</span>
                  </label>
                ))}
              </div>
            </div>

            <div
              style={{
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.3)',
                background: 'rgba(13, 19, 33, 0.85)',
                padding: '20px'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
                Campaign Settings
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 8 }}>Campaign Length</div>
                  <div style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 10 }}>
                    {state.campaignLength} week{state.campaignLength > 1 ? 's' : ''}
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={26}
                    value={state.campaignLength}
                    onChange={(event) => setState((prev) => ({ ...prev, campaignLength: parseInt(event.target.value, 10) }))}
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: 6 }}>
                    <span>1 week</span>
                    <span>26 weeks</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>Adjust to changing Market Conditions</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Automatically recalibrate cadence when new signals appear.</div>
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
    </div>
  );
};
