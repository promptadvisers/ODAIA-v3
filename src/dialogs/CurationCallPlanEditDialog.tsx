import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';
import { useAppStore } from '../store/appStore';

type ObjectiveTab = 'objective1' | 'objective2';
type SignalLevel = 'Low' | 'Medium' | 'High';

type BucketConfigInput = {
  label: string;
  defaultPercent: string;
  defaultFrequency: number;
};

type TableRow = {
  name: string;
  score: number;
  specialty: string;
  segment: string;
  bucket?: string;
};

type EventActivityOption = {
  label: string;
  defaultChecked: boolean;
  defaultLevel: SignalLevel;
};

type SpecialtyOption = {
  name: string;
  frequency: string;
};

type SegmentOption = {
  name: string;
  frequency: string;
};

type ToggleRowProps = {
  label: string;
  description?: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  children?: React.ReactNode;
  compact?: boolean;
  indent?: number;
  toggleSize?: 'sm' | 'md';
};

type SectionHeaderProps = {
  title: string;
  description: string;
};

type LevelSelectProps = {
  value: SignalLevel;
  onChange: (level: SignalLevel) => void;
  indent?: number;
};

const SIGNAL_LEVELS: SignalLevel[] = ['Low', 'Medium', 'High'];

const REGION_OPTIONS = [
  'Median Region (100 HCPs)',
  'Top Quartile Region (80 HCPs)',
  'Bottom Quartile Region (120 HCPs)'
];

const PRIMARY_TABLE_ROWS: TableRow[] = [
  { name: 'Crystal Ball', score: 10, specialty: 'Breast Cancer', segment: 'Loyalist', bucket: 'A' },
  { name: 'Meridith Kvyst', score: 10, specialty: 'Breast Cancer', segment: 'Loyalist', bucket: 'A' },
  { name: 'George Smith', score: 10, specialty: 'Breast Cancer', segment: 'Loyalist', bucket: 'A' },
  { name: 'Samantha White', score: 9, specialty: 'Breast Cancer', segment: 'Loyalist', bucket: 'B' },
  { name: 'Alexander Lee', score: 9, specialty: 'Breast Cancer', segment: 'Grower', bucket: 'B' }
];

const SECONDARY_TABLE_ROWS: TableRow[] = [
  { name: 'Crystal Ball', score: 10, specialty: 'Odaiazol Expert', segment: 'Odaiazol Adopter' },
  { name: 'Meridith Kvyst', score: 10, specialty: 'Odaiazol Expert', segment: 'Odaiazol Expert' },
  { name: 'George Smith', score: 10, specialty: 'Lorem ipsum', segment: 'Odaiazol Adopter' },
  { name: 'Samantha White', score: 9, specialty: 'Odaiazol Expert', segment: 'Odaiazol Adopter' },
  { name: 'Alexander Lee', score: 7, specialty: 'Odaiazol Expert', segment: 'Odaiazol Adopter' },
  { name: 'Olivia Johnson', score: 7, specialty: 'Odaiazol Adopter', segment: 'Odaiazol Adopter' },
  { name: 'Ethan Brown', score: 5, specialty: 'Odaiazol Expert', segment: 'Odaiazol Expert' }
];

const BUCKET_CONFIGS: BucketConfigInput[] = [
  { label: 'Bucket A Configs', defaultPercent: '50', defaultFrequency: 72 },
  { label: 'Bucket B Configs', defaultPercent: '25', defaultFrequency: 54 },
  { label: 'Bucket C Configs', defaultPercent: '15', defaultFrequency: 40 },
  { label: 'Bucket D Configs', defaultPercent: '10', defaultFrequency: 24 }
];

const EVENT_ACTIVITY_OPTIONS: EventActivityOption[] = [
  { label: 'Phone Call', defaultChecked: true, defaultLevel: 'Medium' },
  { label: 'Email Opened', defaultChecked: true, defaultLevel: 'Medium' },
  { label: 'Website Search', defaultChecked: true, defaultLevel: 'Medium' },
  { label: 'Event Attendance', defaultChecked: true, defaultLevel: 'Medium' },
  { label: 'Request-a-rep', defaultChecked: true, defaultLevel: 'Medium' },
  { label: 'Lorem ipsum', defaultChecked: false, defaultLevel: 'Low' }
];

const SPECIALTY_OPTIONS: SpecialtyOption[] = [
  { name: 'Specialty A', frequency: 'Estimated frequency: Every 4 weeks' },
  { name: 'Specialty B', frequency: 'Estimated frequency: Every 6 weeks' },
  { name: 'Specialty C', frequency: 'Estimated frequency: Every 8 weeks' },
  { name: 'Specialty D', frequency: 'Estimated frequency: Every 8 weeks' },
  { name: 'Specialty E', frequency: 'Estimated frequency: Every 8 weeks' },
  { name: 'Specialty F', frequency: 'Estimated frequency: Every 8 weeks' }
];

const SEGMENT_OPTIONS: SegmentOption[] = [
  { name: 'Segment A', frequency: 'Estimated frequency: Every 8 weeks' },
  { name: 'Segment B', frequency: 'Estimated frequency: Every 8 weeks' },
  { name: 'Segment C', frequency: 'Estimated frequency: Every 8 weeks' },
  { name: 'Segment D', frequency: 'Estimated frequency: Every 8 weeks' },
  { name: 'Segment E', frequency: 'Estimated frequency: Every 8 weeks' },
  { name: 'Segment F', frequency: 'Estimated frequency: Every 8 weeks' }
];

const ToggleRow: React.FC<ToggleRowProps> = ({
  label,
  description,
  checked,
  onToggle,
  children,
  compact,
  indent = 0,
  toggleSize = 'md'
}) => {
  return (
    <div style={{ marginBottom: children ? (compact ? '6px' : '10px') : compact ? '4px' : '12px' }}>
      <div
        style={{
            display: 'flex',
            alignItems: 'center',
          gap: '12px',
          padding: compact ? '6px 0' : '8px 0',
          marginLeft: indent
        }}
      >
        <Toggle checked={checked} onChange={onToggle} size={toggleSize} ariaLabel={label} />
        <div
                style={{
          display: 'flex',
          flexDirection: 'column',
            gap: description ? '4px' : '0',
            lineHeight: 1.3
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#f8fafc', letterSpacing: '0.02em' }}>{label}</span>
          {description && <span style={{ fontSize: '12px', color: '#94a3b8', letterSpacing: '0.01em' }}>{description}</span>}
            </div>
        {children && (
          <div
            style={{
              marginLeft: 'auto',
            display: 'flex',
              alignItems: 'center'
            }}
          >
            {children}
            </div>
        )}
          </div>
          </div>
  );
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => (
  <div style={{ marginBottom: '20px' }}>
    <h3
              style={{
                fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#e2e8f0',
        marginBottom: '6px'
      }}
    >
      {title}
    </h3>
    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>{description}</p>
  </div>
);

const LevelSelect: React.FC<LevelSelectProps> = ({ value, onChange, indent = 32 }) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value as SignalLevel)}
              style={{
      marginLeft: `${indent}px`,
      marginTop: '6px',
      padding: '8px 12px',
      backgroundColor: '#101829',
      color: '#e2e8f0',
      borderRadius: '6px',
      border: '1px solid rgba(148, 163, 184, 0.35)',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
                cursor: 'pointer',
      outline: 'none',
      minWidth: '130px'
    }}
  >
    {SIGNAL_LEVELS.map((level) => (
      <option key={level} value={level} style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>
        {level}
      </option>
    ))}
  </select>
);

const getScoreColor = (score: number): string => {
  if (score >= 10) return 'var(--curation-score-orange)';
  if (score >= 9) return 'var(--curation-score-yellow)';
  if (score >= 7) return '#38bdf8';
  return '#818cf8';
};

export const CurationCallPlanEditDialog: React.FC = () => {
  const { activeModal, setActiveModal, selectedWorkflow } = useAppStore();
  const isOpen = selectedWorkflow === 'sales' && activeModal === 'curation-call-plan-edit';

  const [activeTab, setActiveTab] = useState<ObjectiveTab>('objective1');

  const [nearbyAnchorLevel, setNearbyAnchorLevel] = useState<SignalLevel>('Medium');
  const [includeUpcomingAppointments, setIncludeUpcomingAppointments] = useState(false);

  const [powerScore, setPowerScore] = useState(true);
  const [powerScoreLevel, setPowerScoreLevel] = useState<SignalLevel>('Medium');

  const [last7Days, setLast7Days] = useState(true);
  const [last7DaysLevel, setLast7DaysLevel] = useState<SignalLevel>('Medium');
  const [lastMonth, setLastMonth] = useState(true);
  const [lastMonthLevel, setLastMonthLevel] = useState<SignalLevel>('Medium');
  const [lastQuarter, setLastQuarter] = useState(true);
  const [lastQuarterLevel, setLastQuarterLevel] = useState<SignalLevel>('Medium');

  const [selectedSegment, setSelectedSegment] = useState<string>('Starters');
  const [segmentLevel, setSegmentLevel] = useState<SignalLevel>('Medium');

  const [lookbackPeriod, setLookbackPeriod] = useState('1');

  const [eventChecks, setEventChecks] = useState<Record<string, boolean>>(() =>
    EVENT_ACTIVITY_OPTIONS.reduce((acc, option) => {
      acc[option.label] = option.defaultChecked;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [eventLevels, setEventLevels] = useState<Record<string, SignalLevel>>(() =>
    EVENT_ACTIVITY_OPTIONS.reduce((acc, option) => {
      acc[option.label] = option.defaultLevel;
      return acc;
    }, {} as Record<string, SignalLevel>)
  );

  const [bucketConfigsExpanded, setBucketConfigsExpanded] = useState(true);
  const [specialtiesExpanded, setSpecialtiesExpanded] = useState(true);

  const [bucketPercents, setBucketPercents] = useState(() =>
    BUCKET_CONFIGS.map((config) => config.defaultPercent)
  );

  const [bucketFrequencies, setBucketFrequencies] = useState(() =>
    BUCKET_CONFIGS.map((config) => config.defaultFrequency)
  );

  const [maxListSize, setMaxListSize] = useState('30');
  const [overflowFrequency, setOverflowFrequency] = useState(12);
  const [assignZeroPowerScore, setAssignZeroPowerScore] = useState(true);
  const [includeAppointmentsInOverflow, setIncludeAppointmentsInOverflow] = useState(true);

  const [selectedSpecialties, setSelectedSpecialties] = useState<Record<string, boolean>>(() =>
    SPECIALTY_OPTIONS.reduce((acc, option) => {
      acc[option.name] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [selectedSegments, setSelectedSegments] = useState<Record<string, boolean>>(() =>
    SEGMENT_OPTIONS.reduce((acc, option) => {
      acc[option.name] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const specialtyList = useMemo(() => SPECIALTY_OPTIONS, []);
  const segmentList = useMemo(() => SEGMENT_OPTIONS, []);

  const handleSave = () => {
    setActiveModal(null);
  };

  const handleCancel = () => {
    setActiveModal('curation-call-plan-review');
  };

  const calculateFrequencyLabel = (value: number): string => {
    const weeks = Math.max(1, Math.round(8 - (value / 100) * 7));
    return `Estimated frequency: Every ${weeks} week${weeks > 1 ? 's' : ''}`;
  };

  const renderTable = (title: string, rows: TableRow[], showBucket?: boolean) => (
    <div
                      style={{
        background: 'rgba(12, 19, 33, 0.82)',
        border: '1px solid rgba(148, 163, 184, 0.18)',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '24px'
      }}
    >
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
          justifyContent: 'space-between'
                      }}
                    >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>{title}</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Reference view for configured cohort</span>
                    </div>
                    <select
          defaultValue={REGION_OPTIONS[0]}
                      style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            backgroundColor: '#0f172a',
            color: '#e2e8f0',
                        fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.03em',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          {REGION_OPTIONS.map((option) => (
            <option key={option} value={option} style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>
              {option}
            </option>
          ))}
                    </select>
                </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: 'rgba(10, 16, 28, 0.95)' }}>
            <th style={headerCellStyle}>Name</th>
            <th style={headerCellStyle}>PowerScore</th>
            <th style={headerCellStyle}>Specialty</th>
            <th style={headerCellStyle}>Segment</th>
            {showBucket && <th style={headerCellStyle}>Bucket</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
              <td style={bodyCellStyle}>{row.name}</td>
              <td style={bodyCellStyleScore}>
                <div
                      style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: getScoreColor(row.score),
                    color: '#0f172a',
                    fontSize: '14px',
                    fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    boxShadow: '0 6px 12px rgba(249, 115, 22, 0.25)'
                      }}
                    >
                  {row.score}
                    </div>
              </td>
              <td style={{ ...bodyCellStyle }}>
                <div
                      style={{
                    display: 'inline-flex',
                        alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      backgroundColor: 'var(--curation-product-pill-bg)',
                      color: 'var(--curation-product-pill-text)',
                      fontSize: '11px',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}
                  >
                    Odaiazol
                    </span>
                  <span style={{ color: '#f8fafc', fontWeight: 500 }}>{row.specialty}</span>
                  </div>
              </td>
              <td style={{ ...bodyCellStyle }}>
                <span
                      style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--curation-segment-pill-bg)',
                    color: 'var(--curation-segment-pill-text)',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}
                >
                  {row.segment}
                </span>
              </td>
              {showBucket && (
                <td style={bodyCellStyle}>
                  <div
                      style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      border: '1px solid rgba(148, 163, 184, 0.22)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#f8fafc'
                      }}
                    >
                    {row.bucket}
                    </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
                  </div>
  );

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && setActiveModal(null)}>
      <Dialog.Portal>
        <Dialog.Overlay
                      style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 17, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000
          }}
        />
        <Dialog.Content
                      style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '94vw',
            maxWidth: '1440px',
            height: '92vh',
            background: 'linear-gradient(160deg, #0f172a 0%, #020617 55%, #0b1120 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            boxShadow: '0 30px 90px rgba(2, 6, 23, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1001
          }}
        >
          <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
              justifyContent: 'space-between',
              padding: '26px 36px',
              borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
              background: 'rgba(10, 16, 28, 0.8)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <button
                onClick={() => setActiveModal('curation-call-plan-review')}
                      style={{
                  background: 'rgba(148, 163, 184, 0.16)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '999px',
                  color: '#e2e8f0',
                  fontSize: '18px',
                  width: '36px',
                  height: '36px',
                        cursor: 'pointer'
                      }}
                    >
                ←
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Dialog.Title
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: '#f8fafc',
                    margin: 0
                  }}
                >
                  Curation Configuration / [Product Line] Configs
                </Dialog.Title>
                <span style={{ fontSize: '12px', color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Sales · Call Plan Objective
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Configs
              </Button>
            </div>
                </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
              gap: '0',
              padding: '0 36px',
              borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
              background: 'rgba(12, 20, 31, 0.65)'
            }}
          >
            {[{ id: 'objective1', label: 'Objective 1 Name' }, { id: 'objective2', label: 'Objective 2 Name' }].map((tab) => {
              const isActive = activeTab === (tab.id as ObjectiveTab);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ObjectiveTab)}
                      style={{
                    padding: '16px 32px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                    color: isActive ? '#3b82f6' : '#64748b',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                        cursor: 'pointer'
                      }}
                    >
                  {tab.label}
                </button>
              );
            })}
              </div>

          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    <div
                          style={{
                width: '460px',
                background: 'linear-gradient(185deg, rgba(12, 19, 33, 0.9) 0%, rgba(2, 6, 17, 0.95) 80%)',
                borderRight: '1px solid rgba(148, 163, 184, 0.16)',
                padding: '32px 32px 40px',
                overflowY: 'auto'
              }}
            >
              <SectionHeader title="Curation Signals" description="Specifies the impact of anchor appointments on the curated list" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '6px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#f8fafc', letterSpacing: '0.02em' }}>Nearby Anchor</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', letterSpacing: '0.01em', marginTop: '4px' }}>
                      Medium sensitivity to anchor appointments affecting curated list
                        </div>
                      </div>
                        <select
                    value={nearbyAnchorLevel}
                    onChange={(event) => setNearbyAnchorLevel(event.target.value as SignalLevel)}
                          style={{
                      padding: '8px 14px',
                      backgroundColor: '#10131a',
                      border: '1px solid rgba(148, 163, 184, 0.28)',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                      fontSize: '12px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                            cursor: 'pointer'
                          }}
                        >
                    {SIGNAL_LEVELS.map((level) => (
                      <option key={level} value={level} style={{ background: '#10131a' }}>
                        {level}
                      </option>
                    ))}
                        </select>
                    </div>
                </div>
              <ToggleRow
                label="Include upcoming appointments in curation"
                checked={includeUpcomingAppointments}
                onToggle={(active) => setIncludeUpcomingAppointments(active)}
                compact
                indent={0}
              />

              <div style={{ marginTop: '32px' }}>
                <SectionHeader
                  title="PowerScore Signal"
                  description="Specifies how much an HCP's overall score influences the curated list"
                />
                <ToggleRow
                  label="PowerScore"
                  checked={powerScore}
                  onToggle={(active) => setPowerScore(active)}
                  indent={0}
                >
                  {powerScore && <LevelSelect value={powerScoreLevel} onChange={setPowerScoreLevel} />}
                </ToggleRow>
              </div>

              <div style={{ marginTop: '32px' }}>
                <SectionHeader
                  title="Reach and Frequency Signals"
                  description="Impact of reach and frequency across different timeframes"
                />
                <ToggleRow
                  label="Last 7 Days"
                  checked={last7Days}
                  onToggle={(active) => setLast7Days(active)}
                  indent={0}
                >
                  {last7Days && <LevelSelect value={last7DaysLevel} onChange={setLast7DaysLevel} />}
                </ToggleRow>
                <ToggleRow
                  label="Last Month"
                  checked={lastMonth}
                  onToggle={(active) => setLastMonth(active)}
                  indent={0}
                >
                  {lastMonth && <LevelSelect value={lastMonthLevel} onChange={setLastMonthLevel} />}
                </ToggleRow>
                <ToggleRow
                  label="Last Quarter"
                  checked={lastQuarter}
                  onToggle={(active) => setLastQuarter(active)}
                  indent={0}
                >
                  {lastQuarter && <LevelSelect value={lastQuarterLevel} onChange={setLastQuarterLevel} />}
                </ToggleRow>
                      </div>

              <div style={{ marginTop: '32px' }}>
                <SectionHeader
                  title="Segment Scores Signal"
                  description="Specifies how much segment scores influence the curated list"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Starters', 'Believers', 'Growers', 'Current Value Defenders'].map((segment) => {
                  const isSelected = selectedSegment === segment;
                  return (
                    <ToggleRow
                      key={segment}
                      label={segment}
                      checked={isSelected}
                      onToggle={(active) => setSelectedSegment(active ? segment : selectedSegment)}
                      indent={8}
                      toggleSize="sm"
                    >
                      {isSelected && <LevelSelect value={segmentLevel} onChange={setSegmentLevel} indent={0} />}
                    </ToggleRow>
                  );
                })}
                </div>
              </div>

              <div style={{ marginTop: '32px' }}>
                <SectionHeader
                  title="Event Activity Signal"
                  description="Specifies how much recent activity influences the curated list"
                />
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.04em' }}>Lookback Period</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <input
                      type="number"
                      value={lookbackPeriod}
                      onChange={(event) => setLookbackPeriod(event.target.value)}
                      style={{
                        width: '64px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(148, 163, 184, 0.35)',
                        background: '#0b1220',
                        color: '#f8fafc',
                        fontSize: '12px',
                        textAlign: 'center'
                      }}
                    />
                    <span style={{ fontSize: '12px', color: '#94a3b8', letterSpacing: '0.04em' }}>week(s)</span>
                  </div>
                </div>

                {EVENT_ACTIVITY_OPTIONS.map((option) => (
                  <ToggleRow
                    key={option.label}
                    label={option.label}
                    checked={eventChecks[option.label]}
                    onToggle={(active) =>
                      setEventChecks((prev) => ({ ...prev, [option.label]: active }))
                    }
                    indent={0}
                  >
                    {eventChecks[option.label] && (
                      <LevelSelect
                        value={eventLevels[option.label]}
                        onChange={(level) =>
                          setEventLevels((prev) => ({ ...prev, [option.label]: level }))
                        }
                      />
                    )}
                  </ToggleRow>
                ))}
              </div>

              <div style={{ marginTop: '36px' }}>
                <div
                  onClick={() => setBucketConfigsExpanded((prev) => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    marginBottom: '14px'
                  }}
                >
                  {bucketConfigsExpanded ? <ChevronDown size={18} color="#94a3b8" /> : <ChevronRight size={18} color="#94a3b8" />}
                  <h3 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.16em', color: '#e2e8f0', margin: 0 }}>
                    Bucket Configs
                  </h3>
                </div>

                {bucketConfigsExpanded && (
                  <div style={{ paddingLeft: '6px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  <div>
                      <label style={{ fontSize: '12px', color: '#94a3b8', letterSpacing: '0.04em', fontWeight: 500 }}>Maximum List Size</label>
                      <input
                        type="number"
                        value={maxListSize}
                        onChange={(event) => setMaxListSize(event.target.value)}
                        style={{
                          width: '94px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(148, 163, 184, 0.35)',
                          background: '#0b1220',
                          color: '#f8fafc',
                          fontSize: '12px',
                          marginTop: '8px'
                        }}
                      />
                    </div>

                    {BUCKET_CONFIGS.map((config, index) => (
                      <div key={config.label} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>{config.label}</h4>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ flex: '0 0 120px' }}>
                            <label style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.06em' }}>Bucket Size (%)</label>
                        <input
                          type="number"
                              value={bucketPercents[index]}
                              onChange={(event) =>
                                setBucketPercents((prev) => {
                                  const clone = [...prev];
                                  clone[index] = event.target.value;
                                  return clone;
                                })
                              }
                          style={{
                            width: '100%',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                border: '1px solid rgba(148, 163, 184, 0.35)',
                                background: '#0b1220',
                                color: '#f8fafc',
                                fontSize: '12px',
                          marginTop: '6px'
                          }}
                        />
                      </div>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.06em' }}>Relative Frequency</label>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                          <span>Never</span>
                          <span>Most often</span>
                        </div>
                        <input
                          type="range"
                              min={0}
                              max={100}
                              value={bucketFrequencies[index]}
                              onChange={(event) =>
                                setBucketFrequencies((prev) => {
                                  const clone = [...prev];
                                  clone[index] = parseInt(event.target.value, 10);
                                  return clone;
                                })
                              }
                              style={{ width: '100%', accentColor: '#3b82f6' }}
                            />
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{calculateFrequencyLabel(bucketFrequencies[index])}</span>
                        </div>
                      </div>
                    </div>
                    ))}

                      <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', margin: 0, marginBottom: '8px' }}>
                        Overflow Bucket Configs
                      </h4>
                      <label style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.06em' }}>Relative Frequency</label>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#475569', marginTop: '4px' }}>
                          <span>Never</span>
                          <span>Most often</span>
                        </div>
                        <input
                          type="range"
                        min={0}
                        max={100}
                        value={overflowFrequency}
                        onChange={(event) => setOverflowFrequency(parseInt(event.target.value, 10))}
                        style={{ width: '100%', accentColor: '#3b82f6' }}
                      />
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{calculateFrequencyLabel(overflowFrequency)}</span>
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <ToggleRow
                          label="Assign 0 PowerScore HCPs to overflow bucket"
                          checked={assignZeroPowerScore}
                          onToggle={() => setAssignZeroPowerScore((prev) => !prev)}
                          compact
                        />
                        <ToggleRow
                          label="Include upcoming appointments in curation"
                          checked={includeAppointmentsInOverflow}
                          onToggle={() => setIncludeAppointmentsInOverflow((prev) => !prev)}
                          compact
                        />
                        </div>
                      </div>
                  </div>
                )}
                    </div>

              <div style={{ marginTop: '36px', paddingBottom: '16px' }}>
                <div
                  onClick={() => setSpecialtiesExpanded((prev) => !prev)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '14px' }}
                >
                  {specialtiesExpanded ? <ChevronDown size={18} color="#94a3b8" /> : <ChevronRight size={18} color="#94a3b8" />}
                  <h3 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.16em', color: '#e2e8f0', margin: 0 }}>
                    Specialties & Segments
                  </h3>
                </div>
                {specialtiesExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', margin: '0 0 8px 0' }}>Specialties</h4>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px 0' }}>
                        All specialties included by default; exclude any you don’t want in the list.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {specialtyList.map((specialty) => {
                          const isChecked = selectedSpecialties[specialty.name];
                          return (
                            <div key={specialty.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div
                                onClick={() =>
                                  setSelectedSpecialties((prev) => ({ ...prev, [specialty.name]: !prev[specialty.name] }))
                                }
                            style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '4px',
                                  border: isChecked ? 'none' : '1px solid rgba(148, 163, 184, 0.35)',
                                  background: isChecked ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                {isChecked && <Check size={12} color="#ffffff" strokeWidth={2.6} />}
                          </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 500, color: '#f8fafc' }}>{specialty.name}</span>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>{specialty.frequency}</span>
                        </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', margin: '0 0 8px 0' }}>Segments</h4>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px 0' }}>
                        All segments included by default; select specific segments to filter their list.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {segmentList.map((segment) => {
                          const isChecked = selectedSegments[segment.name];
                          return (
                            <div key={segment.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div
                                onClick={() =>
                                  setSelectedSegments((prev) => ({ ...prev, [segment.name]: !prev[segment.name] }))
                                }
                            style={{
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '4px',
                                  border: isChecked ? 'none' : '1px solid rgba(148, 163, 184, 0.35)',
                                  background: isChecked ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                              >
                                {isChecked && <Check size={12} color="#ffffff" strokeWidth={2.6} />}
                          </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 500, color: '#f8fafc' }}>{segment.name}</span>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>{segment.frequency}</span>
                        </div>
                      </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              </div>

                <div
                  style={{
                flex: 1,
                padding: '34px 40px',
                background: 'radial-gradient(circle at top left, rgba(14, 20, 35, 0.9) 0%, rgba(8, 11, 21, 0.95) 70%)',
                overflowY: 'auto'
              }}
            >
              <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px'
                            }}
                          >
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['Odaiazol', 'Median Region', 'Call Plan'].map((label) => (
                    <span
                      key={label}
                            style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        background: 'rgba(12, 23, 43, 0.6)',
                        color: '#e2e8f0',
                        fontSize: '11px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {label}
                          </span>
                  ))}
                        </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', letterSpacing: '0.04em' }}>Hue: Median Region</div>
                      </div>
                    </div>

              {renderTable('Median Region (100 HCPs)', PRIMARY_TABLE_ROWS, true)}

              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8' }} />
                <span style={{ fontSize: '12px', color: '#64748b' }}>PS - PowerScore</span>
                    </div>

              <div
                            style={{
                  background: 'rgba(12, 19, 33, 0.82)',
                  border: '1px solid rgba(148, 163, 184, 0.18)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <div
                            style={{
                    padding: '18px 20px',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
                              display: 'flex',
                              alignItems: 'center',
                    justifyContent: 'space-between'
                            }}
                          >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', margin: 0 }}>Sample Curated List (30 HCPs)</h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Derived from current configuration</span>
                          </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                  style={{
                        padding: '8px 14px',
                        borderRadius: '999px',
                        border: '1px solid rgba(148, 163, 184, 0.25)',
                        background: 'rgba(15, 24, 42, 0.72)',
                        color: '#cbd5f5',
                        fontSize: '12px',
                        letterSpacing: '0.04em',
                    cursor: 'pointer'
                  }}
                >
                      Export CSV
                    </button>
              </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(10, 16, 28, 0.95)' }}>
                      <th style={headerCellStyle}>PS</th>
                      <th style={headerCellStyle}>Name</th>
                      <th style={headerCellStyle}>Specialty</th>
                      <th style={headerCellStyle}>Segment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SECONDARY_TABLE_ROWS.map((row) => (
                      <tr key={row.name} style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
                        <td style={bodyCellStyleScore}>
                          <div
                            style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                              backgroundColor: getScoreColor(row.score),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                              fontWeight: 700,
                              color: '#0f172a'
                            }}
                          >
                            {row.score}
                          </div>
                        </td>
                        <td style={bodyCellStyle}>{row.name}</td>
                        <td style={{ ...bodyCellStyle }}>
                          <div
                            style={{
                              display: 'inline-flex',
                            alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: '999px',
                                border: '1px solid rgba(148, 163, 184, 0.25)',
                                backgroundColor: 'var(--curation-product-pill-bg)',
                                color: 'var(--curation-product-pill-text)',
                                fontSize: '11px',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase'
                              }}
                            >
                              Odaiazol
                            </span>
                            <span style={{ color: '#f8fafc', fontWeight: 500 }}>{row.specialty}</span>
                          </div>
                        </td>
                        <td style={{ ...bodyCellStyle }}>
                          <span
                            style={{
                              padding: '4px 12px',
                              borderRadius: '999px',
                              backgroundColor: 'var(--curation-segment-pill-bg)',
                              color: 'var(--curation-segment-pill-text)',
                              fontSize: '11px',
                              fontWeight: 500,
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase'
                            }}
                          >
                            {row.segment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const headerCellStyle: React.CSSProperties = {
  padding: '14px 18px',
  textAlign: 'left',
  fontSize: '11px',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: '#94a3b8'
};

const bodyCellStyle: React.CSSProperties = {
  padding: '14px 18px',
  fontSize: '13px',
  color: '#e2e8f0'
};

const bodyCellStyleScore: React.CSSProperties = {
  ...bodyCellStyle,
  width: '80px'
};
