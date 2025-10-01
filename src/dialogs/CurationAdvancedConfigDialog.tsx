import React, { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, User, Settings, Grid3X3, Users, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppStore } from '../store/appStore';

// Mock HCP data with names - Regional variations
const mockHCPDataRepository = {
  'Median Region (100 HCPs)': [
    { id: 47248002, name: 'Crystal Ball', powerScore: 10, specialty: 'Odaiazol Adopter', segment: 'Odaiazol Adopter' },
    { id: 47248003, name: 'Meridith Kvyst', powerScore: 10, specialty: 'Odaiazol Expert', segment: 'Odaiazol Expert' },
    { id: 47248004, name: 'George Smith', powerScore: 10, specialty: 'Lorem ipsum', segment: 'Grower' },
    { id: 47248005, name: 'Samantha White', powerScore: 9, specialty: 'Odaiazol Adopter', segment: 'Starter' },
    { id: 47248006, name: 'Alexander Lee', powerScore: 9, specialty: 'Odaiazol Expert', segment: 'Lorem ipsum' },
    { id: 47248007, name: 'Olivia Johnson', powerScore: 9, specialty: 'Lorem ipsum', segment: 'Odaiazol...' },
    { id: 47248008, name: 'Ethan Brown', powerScore: 9, specialty: 'Odaiazol Adopter', segment: 'near_term_shrinker' },
    { id: 47248009, name: 'Crystal Ball', powerScore: 8, specialty: 'Odaiazol Adopter', segment: 'growers' },
    { id: 47248010, name: 'Meridith Kvyst', powerScore: 8, specialty: 'Lorem ipsum', segment: 'Odaiazol Adopter' },
    { id: 47248011, name: 'George Smith', powerScore: 7, specialty: 'Odaiazol Adopter', segment: 'Odaiazol Expert' },
  ],
  'Top Region (65 HCPs)': [
    { id: 47248012, name: 'Crystal Ball', powerScore: 10, specialty: 'Odaiazol Adopter', segment: 'Odaiazol Adopter' },
    { id: 47248013, name: 'Meridith Kvyst', powerScore: 10, specialty: 'Odaiazol Expert', segment: 'Grower' },
    { id: 47248014, name: 'George Smith', powerScore: 9, specialty: 'Lorem ipsum', segment: 'Starter' },
    { id: 47248015, name: 'Samantha White', powerScore: 9, specialty: 'Odaiazol Adopter', segment: 'Odaiazol Expert' },
    { id: 47248016, name: 'Alexander Lee', powerScore: 8, specialty: 'Odaiazol Expert', segment: 'growers' },
    { id: 47248017, name: 'Olivia Johnson', powerScore: 8, specialty: 'Lorem ipsum', segment: 'Lorem ipsum' },
    { id: 47248018, name: 'Ethan Brown', powerScore: 7, specialty: 'Odaiazol Adopter', segment: 'Odaiazol...' },
  ]
};

const generateMockHCPs = (count: number, region: string = 'Median Region (100 HCPs)') => {
  const baseData = mockHCPDataRepository[region as keyof typeof mockHCPDataRepository] || mockHCPDataRepository['Median Region (100 HCPs)'];

  // Repeat pattern to reach desired count
  const result: any[] = [];
  for (let i = 0; i < count; i++) {
    const base = baseData[i % baseData.length];
    result.push({
      ...base,
      id: 47248002 + i
    });
  }
  return result;
};

// Helper function to calculate frequency in weeks from slider value
const calculateFrequency = (sliderValue: string | number): number => {
  const value = typeof sliderValue === 'string' ? parseInt(sliderValue) : sliderValue;
  return Math.max(1, Math.round(8 - (value / 100) * 7));
};

// Helper function to get bucket color
const getBucketColor = (bucket: string): string => {
  const colors: Record<string, string> = {
    'A': '#3b82f6', // Blue
    'B': '#10b981', // Green
    'C': '#f59e0b', // Yellow/Orange
    'D': '#ef4444'  // Red
  };
  return colors[bucket] || '#6b7280';
};

export const CurationAdvancedConfigDialog: React.FC = () => {
  const { activeModal, setActiveModal } = useAppStore();
  const isOpen = activeModal === 'curation-edit';

  // Visual feedback state
  const [isFiltering, setIsFiltering] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);
  const [countChange, setCountChange] = useState<number | null>(null);
  const [changeMessage, setChangeMessage] = useState<string | null>(null);
  const [highlightedRows, setHighlightedRows] = useState<Set<number>>(new Set());

  // Active tab state
  const [activeTab, setActiveTab] = useState<'objective1' | 'objective2'>('objective1');

  // Collapsible sections state
  const [curationSignalsExpanded, setCurationSignalsExpanded] = useState(true);
  const [bucketConfigsExpanded, setBucketConfigsExpanded] = useState(false);
  const [specialtiesExpanded, setSpecialtiesExpanded] = useState(false);

  // Curation Signals
  const [nearbyAnchor, setNearbyAnchor] = useState(true);
  const [nearbyAnchorLevel, setNearbyAnchorLevel] = useState('Medium');
  const [includeAppointments, setIncludeAppointments] = useState(false);

  const [powerScore, setPowerScore] = useState(true);
  const [powerScoreLevel, setPowerScoreLevel] = useState('Medium');

  // Reach and Frequency Signals
  const [last7Days, setLast7Days] = useState(true);
  const [last7DaysLevel, setLast7DaysLevel] = useState('Medium');
  const [lastMonth, setLastMonth] = useState(true);
  const [lastMonthLevel, setLastMonthLevel] = useState('Medium');
  const [lastQuarter, setLastQuarter] = useState(true);
  const [lastQuarterLevel, setLastQuarterLevel] = useState('Medium');

  // Segment Scores Signal
  const [starters, setStarters] = useState(true);
  const [startersLevel, setStartersLevel] = useState('Medium');
  const [shrinkers, setShrinkers] = useState(false);
  const [switchIn, setSwitchIn] = useState(false);
  const [switchOut, setSwitchOut] = useState(false);
  const [believer, setBeleiver] = useState(false);
  const [loremSegment, setLoremSegment] = useState(false);
  const [reliever, setReliever] = useState(false);

  // Event Activity Signal
  const [lookbackPeriod, setLookbackPeriod] = useState('1');
  const [enableAttribution, setEnableAttribution] = useState(false);
  const [phoneCall, setPhoneCall] = useState(true);
  const [phoneCallLevel, setPhoneCallLevel] = useState('Medium');
  const [emailOpened, setEmailOpened] = useState(true);
  const [emailOpenedLevel, setEmailOpenedLevel] = useState('Medium');
  const [websiteSearch, setWebsiteSearch] = useState(true);
  const [websiteSearchLevel, setWebsiteSearchLevel] = useState('Medium');
  const [eventAttendance, setEventAttendance] = useState(true);
  const [eventAttendanceLevel, setEventAttendanceLevel] = useState('Medium');
  const [requestSrep, setRequestSrep] = useState(true);
  const [requestSrepLevel, setRequestSrepLevel] = useState('Medium');
  const [loremEvent, setLoremEvent] = useState(true);
  const [loremEventLevel, setLoremEventLevel] = useState('Medium');

  // Bucket Configs
  const [maxListSize, setMaxListSize] = useState('30');
  const [bucketASize, setBucketASize] = useState('50');
  const [bucketAFreq, setBucketAFreq] = useState('50');
  const [bucketBSize, setBucketBSize] = useState('25');
  const [bucketBFreq, setBucketBFreq] = useState('25');
  const [bucketCSize, setBucketCSize] = useState('15');
  const [bucketCFreq, setBucketCFreq] = useState('15');
  const [bucketDSize, setBucketDSize] = useState('10');
  const [bucketDFreq, setBucketDFreq] = useState('10');

  // Overflow Bucket
  const [overflowFreq, setOverflowFreq] = useState('0');
  const [assignZeroPowerScore, setAssignZeroPowerScore] = useState(false);
  const [includeAppointmentsOverflow, setIncludeAppointmentsOverflow] = useState(false);

  // Specialties
  const [specialtyA, setSpecialtyA] = useState(true);
  const [specialtyB, setSpecialtyB] = useState(true);
  const [specialtyC, setSpecialtyC] = useState(true);
  const [specialtyD, setSpecialtyD] = useState(true);
  const [specialtyE, setSpecialtyE] = useState(true);
  const [specialtyF, setSpecialtyF] = useState(true);

  // Segments
  const [segmentA, setSegmentA] = useState(false);
  const [segmentB, setSegmentB] = useState(false);
  const [segmentC, setSegmentC] = useState(false);
  const [segmentD, setSegmentD] = useState(false);
  const [segmentE, setSegmentE] = useState(false);
  const [segmentF, setSegmentF] = useState(false);

  // Region selection state
  const [selectedRegion, setSelectedRegion] = useState('Median Region (100 HCPs)');

  // Generate HCP lists based on selected region
  const mockHCPsAll = useMemo(() => {
    const count = selectedRegion === 'Median Region (100 HCPs)' ? 100 : 65;
    console.log('Generating HCPs for region:', selectedRegion, 'count:', count);
    return generateMockHCPs(count, selectedRegion);
  }, [selectedRegion]);

  // Calculate curated list size
  const curatedListSize = useMemo(() => {
    const max = parseInt(maxListSize) || 30;
    const bucketA = parseInt(bucketASize) || 0;
    const bucketB = parseInt(bucketBSize) || 0;
    const bucketC = parseInt(bucketCSize) || 0;
    const bucketD = parseInt(bucketDSize) || 0;
    const totalPercentage = Math.min(100, bucketA + bucketB + bucketC + bucketD);
    return Math.round((totalPercentage / 100) * max);
  }, [maxListSize, bucketASize, bucketBSize, bucketCSize, bucketDSize]);

  // Filter curated HCPs with specialty and segment filtering
  const mockHCPsCurated = useMemo(() => {
    let baseHCPs = generateMockHCPs(100, selectedRegion);

    // Apply PowerScore signal filter
    if (powerScore) {
      const minScore = powerScoreLevel === 'High' ? 8 : powerScoreLevel === 'Medium' ? 6 : 4;
      baseHCPs = baseHCPs.filter(hcp => hcp.powerScore >= minScore);
    }

    // Apply Nearby Anchor filter
    if (nearbyAnchor && nearbyAnchorLevel === 'High') {
      baseHCPs = baseHCPs.filter((_, i) => i % 2 === 0);
    }

    // Apply Reach and Frequency filters
    const activeTimeSignals = [last7Days, lastMonth, lastQuarter].filter(Boolean).length;
    if (activeTimeSignals > 0) {
      baseHCPs = baseHCPs.slice(0, Math.max(10, baseHCPs.length - (3 - activeTimeSignals) * 5));
    }

    // Apply Segment Scores filter
    if (starters && startersLevel === 'High') {
      baseHCPs = baseHCPs.filter(hcp => hcp.segment.includes('Starter') || hcp.segment.includes('growers'));
    }

    // Apply Specialty filters (if any checked)
    const activeSpecialties = [
      specialtyA && 'Specialty A',
      specialtyB && 'Specialty B',
      specialtyC && 'Specialty C',
      specialtyD && 'Specialty D',
      specialtyE && 'Specialty E',
      specialtyF && 'Specialty F'
    ].filter(Boolean);

    if (activeSpecialties.length > 0 && activeSpecialties.length < 6) {
      // Only filter if not all specialties are selected (partial selection means user wants to filter)
      baseHCPs = baseHCPs.filter(hcp => {
        // For demo purposes, map actual specialties to checkbox letters
        const specialtyMap: any = {
          'Odaiazol Adopter': 'Specialty A',
          'Odaiazol Expert': 'Specialty B',
          'Lorem ipsum': 'Specialty C'
        };
        return activeSpecialties.includes(specialtyMap[hcp.specialty] || 'Specialty A');
      });
    }

    // Apply Segment filters (if any checked)
    const activeSegments = [
      segmentA && 'Segment A',
      segmentB && 'Segment B',
      segmentC && 'Segment C',
      segmentD && 'Segment D',
      segmentE && 'Segment E',
      segmentF && 'Segment F'
    ].filter(Boolean);

    if (activeSegments.length > 0) {
      baseHCPs = baseHCPs.filter(hcp => {
        // For demo purposes, map actual segments to checkbox letters
        const segmentMap: any = {
          'Odaiazol Adopter': 'Segment A',
          'Odaiazol Expert': 'Segment B',
          'Grower': 'Segment C',
          'Starter': 'Segment D',
          'growers': 'Segment E'
        };
        return activeSegments.includes(segmentMap[hcp.segment] || 'Segment A');
      });
    }

      console.log('Curated HCPs after filtering:', baseHCPs.length, 'target size:', curatedListSize);
    return baseHCPs.slice(0, Math.max(1, curatedListSize));
  }, [
    selectedRegion, nearbyAnchor, nearbyAnchorLevel, powerScore, powerScoreLevel,
    last7Days, lastMonth, lastQuarter, starters, startersLevel, curatedListSize,
    specialtyA, specialtyB, specialtyC, specialtyD, specialtyE, specialtyF,
    segmentA, segmentB, segmentC, segmentD, segmentE, segmentF
  ]);

  // Assign buckets to curated HCPs based on bucket size percentages
  const mockHCPsWithBuckets = useMemo(() => {
    return mockHCPsCurated.map((hcp, index) => {
      const bucketSizes = [
        parseInt(bucketASize) || 0,
        parseInt(bucketBSize) || 0,
        parseInt(bucketCSize) || 0,
        parseInt(bucketDSize) || 0
      ];

      let bucket = 'A';
      let cumulative = 0;
      const percentile = (index / Math.max(1, mockHCPsCurated.length)) * 100;

      for (let i = 0; i < bucketSizes.length; i++) {
        cumulative += bucketSizes[i];
        if (percentile < cumulative) {
          bucket = String.fromCharCode(65 + i); // A, B, C, D
          break;
        }
      }

      return { ...hcp, bucket };
    });
  }, [mockHCPsCurated, bucketASize, bucketBSize, bucketCSize, bucketDSize]);

  // Trigger visual feedback when curated list changes
  React.useEffect(() => {
    if (previousCount > 0) {
      const change = mockHCPsCurated.length - previousCount;
      if (change !== 0) {
        setCountChange(change);
        setIsFiltering(true);

        // Highlight all rows temporarily
        const rowIndices = new Set(mockHCPsCurated.map((_, i) => i));
        setHighlightedRows(rowIndices);

        // Generate change message
        const absChange = Math.abs(change);
        if (change > 0) {
          setChangeMessage(`+${absChange} HCP${absChange > 1 ? 's' : ''} added`);
        } else {
          setChangeMessage(`${absChange} HCP${absChange > 1 ? 's' : ''} removed`);
        }

        // Clear feedback after animation
        const timer1 = setTimeout(() => setIsFiltering(false), 600);
        const timer2 = setTimeout(() => {
          setCountChange(null);
          setChangeMessage(null);
          setHighlightedRows(new Set());
        }, 2000);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    }
    setPreviousCount(mockHCPsCurated.length);
  }, [mockHCPsCurated.length]);

  // Trigger visual feedback when bucket configurations change
  React.useEffect(() => {
    setIsFiltering(true);

    // Highlight all rows to show bucket reassignment
    const rowIndices = new Set(mockHCPsWithBuckets.map((_, i) => i));
    setHighlightedRows(rowIndices);
    setChangeMessage('Bucket assignments updated');

    // Clear feedback after animation
    const timer1 = setTimeout(() => setIsFiltering(false), 600);
    const timer2 = setTimeout(() => {
      setHighlightedRows(new Set());
      setChangeMessage(null);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [bucketASize, bucketBSize, bucketCSize, bucketDSize, bucketAFreq, bucketBFreq, bucketCFreq, bucketDFreq, maxListSize, overflowFreq]);

  // Helper to get PowerScore badge color
  const getPowerScoreColor = (score: number) => {
    if (score === 10) return '#f97316'; // Orange
    if (score === 9) return '#eab308'; // Yellow
    if (score === 8) return '#84cc16'; // Lime
    if (score === 7) return '#3b82f6'; // Blue
    if (score === 6) return '#8b5cf6'; // Purple
    if (score === 5) return '#ec4899'; // Pink
    return '#6b7280'; // Gray for lower scores
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && setActiveModal(null)}>
      <Dialog.Portal>
        <Dialog.Overlay style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000
        }} />
        <Dialog.Content style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--bg-modal)',
          borderRadius: '12px',
          padding: 0,
          width: '95vw',
          maxWidth: '1400px',
          height: '90vh',
          zIndex: 1001,
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User size={18} style={{ color: 'var(--text-secondary)' }} />
              <Dialog.Title style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0
              }}>
                Curation Configuration / [Product Line] Configs
              </Dialog.Title>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setActiveModal(null)}>
                Save Configs
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left Sidebar Navigation */}
            <div style={{
              width: '60px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px 0',
              gap: '20px'
            }}>
              <Settings size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
              <Grid3X3 size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
              <Users size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
              <FileText size={20} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
            </div>

            {/* Left Panel - Controls */}
            <div style={{
              width: '400px',
              borderRight: '1px solid var(--border-subtle)',
              overflow: 'auto',
              padding: '20px'
            }}>

              {/* Objective Tabs */}
              <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', borderBottom: '2px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setActiveTab('objective1')}
                  style={{
                    padding: '8px 0',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: activeTab === 'objective1' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    borderBottom: activeTab === 'objective1' ? '2px solid var(--accent-blue)' : 'none',
                    marginBottom: '-2px',
                    cursor: 'pointer'
                  }}
                >
                  Objective 1 Name
                </button>
                <button
                  onClick={() => setActiveTab('objective2')}
                  style={{
                    padding: '8px 0',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '500',
                    color: activeTab === 'objective2' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    borderBottom: activeTab === 'objective2' ? '2px solid var(--accent-blue)' : 'none',
                    marginBottom: '-2px',
                    cursor: 'pointer'
                  }}
                >
                  Objective 2 Name
                </button>
              </div>

              {/* Curation Signals - Collapsible */}
              <details open={curationSignalsExpanded} onToggle={(e) => setCurationSignalsExpanded((e.target as HTMLDetailsElement).open)} style={{ marginBottom: '20px' }}>
                <summary style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  listStyle: 'none'
                }}>
                  {curationSignalsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  Curation Signals
                </summary>

                <div style={{ padding: '16px 12px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Specifies the impact of anchor appointments on the curated list.
                  </p>

                  {/* Nearby Anchor Signal */}
                  <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px' }}>
                    Nearby Anchor Signal
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Specifies the impact of anchor appointments on the curated list.
                  </p>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={nearbyAnchor} onChange={(e) => setNearbyAnchor(e.target.checked)} style={{ cursor: 'pointer' }} />
                        Nearby Anchor
                      </label>
                      <select value={nearbyAnchorLevel} onChange={(e) => setNearbyAnchorLevel(e.target.value)} disabled={!nearbyAnchor} style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: 'pointer' }}>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={includeAppointments} onChange={(e) => setIncludeAppointments(e.target.checked)} style={{ cursor: 'pointer' }} />
                      Include upcoming appointments in curation
                    </label>
                  </div>

                  {/* PowerScore Signal */}
                  <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px', marginTop: '20px' }}>
                    PowerScore Signal
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Specifies how much an HCPs overall score influences the curated list.
                  </p>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={powerScore} onChange={(e) => setPowerScore(e.target.checked)} style={{ cursor: 'pointer' }} />
                        PowerScore
                      </label>
                      <select value={powerScoreLevel} onChange={(e) => setPowerScoreLevel(e.target.value)} disabled={!powerScore} style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: 'pointer' }}>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  {/* Reach and Frequency Signals */}
                  <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px', marginTop: '20px' }}>
                    Reach and Frequency Signals
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Specifies the impact of reach and frequency across different timeframes on the curated list.
                  </p>

                  {[
                    { label: 'Last 7 Days', checked: last7Days, setChecked: setLast7Days, level: last7DaysLevel, setLevel: setLast7DaysLevel },
                    { label: 'Last Month', checked: lastMonth, setChecked: setLastMonth, level: lastMonthLevel, setLevel: setLastMonthLevel },
                    { label: 'Last Quarter', checked: lastQuarter, setChecked: setLastQuarter, level: lastQuarterLevel, setLevel: setLastQuarterLevel }
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                          <input type="checkbox" checked={item.checked} onChange={(e) => item.setChecked(e.target.checked)} style={{ cursor: 'pointer' }} />
                          {item.label}
                        </label>
                        <select value={item.level} onChange={(e) => item.setLevel(e.target.value)} disabled={!item.checked} style={{ padding: '6px 10px', fontSize: '11px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: 'pointer' }}>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {/* Segment Scores Signal */}
                  <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px', marginTop: '20px' }}>
                    Segment Scores Signal
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Specifies how much a segment score influences the curated list.
                  </p>

                  {[
                    { label: 'Starters', checked: starters, setChecked: setStarters, level: startersLevel, setLevel: setStartersLevel },
                    { label: 'Shrinkers', checked: shrinkers, setChecked: setShrinkers },
                    { label: 'Switch-In', checked: switchIn, setChecked: setSwitchIn },
                    { label: 'Switch-Out', checked: switchOut, setChecked: setSwitchOut },
                    { label: 'Believer', checked: believer, setChecked: setBeleiver },
                    { label: 'Lorem ipsum', checked: loremSegment, setChecked: setLoremSegment },
                    { label: 'Reliever', checked: reliever, setChecked: setReliever }
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                          <input type="checkbox" checked={item.checked} onChange={(e) => item.setChecked(e.target.checked)} style={{ cursor: 'pointer' }} />
                          {item.label}
                        </label>
                        {i === 0 && (
                          <select value={item.level} onChange={(e) => item.setLevel && item.setLevel(e.target.value)} disabled={!item.checked} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: 'pointer' }}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                          </select>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Event Activity Signal */}
                  <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '12px', marginTop: '20px' }}>
                    Event Activity Signal
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Specifies how much recent activity influences the curated list.
                  </p>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Lookback Period
                    </label>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Number of weeks to include activities from
                    </p>
                    <input
                      type="number"
                      value={lookbackPeriod}
                      onChange={(e) => setLookbackPeriod(e.target.value)}
                      min="1"
                      style={{
                        width: '80px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={enableAttribution} onChange={(e) => setEnableAttribution(e.target.checked)} style={{ cursor: 'pointer' }} />
                      Enable attribution to override pre-set impact
                    </label>
                  </div>

                  {[
                    { label: 'Phone Call', checked: phoneCall, setChecked: setPhoneCall, level: phoneCallLevel, setLevel: setPhoneCallLevel },
                    { label: 'Email Opened', checked: emailOpened, setChecked: setEmailOpened, level: emailOpenedLevel, setLevel: setEmailOpenedLevel },
                    { label: 'Website Search', checked: websiteSearch, setChecked: setWebsiteSearch, level: websiteSearchLevel, setLevel: setWebsiteSearchLevel },
                    { label: 'Event Attendance', checked: eventAttendance, setChecked: setEventAttendance, level: eventAttendanceLevel, setLevel: setEventAttendanceLevel },
                    { label: 'Request s-rep', checked: requestSrep, setChecked: setRequestSrep, level: requestSrepLevel, setLevel: setRequestSrepLevel },
                    { label: 'Lorem ipsum', checked: loremEvent, setChecked: setLoremEvent, level: loremEventLevel, setLevel: setLoremEventLevel }
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                          <input type="checkbox" checked={item.checked} onChange={(e) => item.setChecked(e.target.checked)} style={{ cursor: 'pointer' }} />
                          {item.label}
                        </label>
                        <select value={item.level} onChange={(e) => item.setLevel(e.target.value)} disabled={!item.checked} style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: 'pointer' }}>
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </details>

              {/* Bucket Configs - Collapsible */}
              <details open={bucketConfigsExpanded} onToggle={(e) => setBucketConfigsExpanded((e.target as HTMLDetailsElement).open)} style={{ marginBottom: '20px' }}>
                <summary style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  listStyle: 'none'
                }}>
                  {bucketConfigsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  Bucket Configs
                </summary>

                <div style={{ padding: '16px 12px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Maximum List Size
                    </label>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Number of HCPs in weekly curated list
                    </p>
                    <input
                      type="number"
                      value={maxListSize}
                      onChange={(e) => setMaxListSize(e.target.value)}
                      min="1"
                      style={{
                        width: '80px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>

                  {/* Bucket A-D Configs */}
                  {[
                    { label: 'Bucket A Configs', size: bucketASize, setSize: setBucketASize, freq: bucketAFreq, setFreq: setBucketAFreq },
                    { label: 'Bucket B Configs', size: bucketBSize, setSize: setBucketBSize, freq: bucketBFreq, setFreq: setBucketBFreq },
                    { label: 'Bucket C Configs', size: bucketCSize, setSize: setBucketCSize, freq: bucketCFreq, setFreq: setBucketCFreq },
                    { label: 'Bucket D Configs', size: bucketDSize, setSize: setBucketDSize, freq: bucketDFreq, setFreq: setBucketDFreq }
                  ].map((bucket, i) => (
                    <div key={i} style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '12px' }}>
                        {bucket.label}
                      </h4>

                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Bucket Size
                        </label>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          Percentage of total list size
                        </p>
                        <input
                          type="number"
                          value={bucket.size}
                          onChange={(e) => bucket.setSize(e.target.value)}
                          min="0"
                          max="100"
                          style={{
                            width: '80px',
                            padding: '6px 10px',
                            fontSize: '12px',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px'
                          }}
                        />
                        <span style={{ marginLeft: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>%</span>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Relative Frequency
                        </label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                          <span>Never</span>
                          <span>Most often</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={bucket.freq}
                          onChange={(e) => bucket.setFreq(e.target.value)}
                          style={{ width: '100%' }}
                        />
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Estimated frequency: Every {calculateFrequency(bucket.freq)} weeks
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Overflow Bucket Configs */}
                  <div style={{ marginBottom: '20px', marginTop: '24px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '12px' }}>
                      Overflow Bucket Configs
                    </h4>

                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Relative Frequency
                      </label>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span>Never</span>
                        <span>Most often</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={overflowFreq}
                        onChange={(e) => setOverflowFreq(e.target.value)}
                        style={{ width: '100%' }}
                      />
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Estimated frequency: {parseInt(overflowFreq) === 0 ? 'Never' : `Every ${calculateFrequency(overflowFreq)} weeks`}
                      </p>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={assignZeroPowerScore} onChange={(e) => setAssignZeroPowerScore(e.target.checked)} style={{ cursor: 'pointer' }} />
                        Assign 0-PowerScore HCPs to overflow bucket
                      </label>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={includeAppointmentsOverflow} onChange={(e) => setIncludeAppointmentsOverflow(e.target.checked)} style={{ cursor: 'pointer' }} />
                        Include upcoming appointments in curation
                      </label>
                    </div>
                  </div>
                </div>
              </details>

              {/* Specialties & Segments - Collapsible */}
              <details open={specialtiesExpanded} onToggle={(e) => setSpecialtiesExpanded((e.target as HTMLDetailsElement).open)} style={{ marginBottom: '20px' }}>
                <summary style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  listStyle: 'none'
                }}>
                  {specialtiesExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  Specialties & Segments
                </summary>

                <div style={{ padding: '16px 12px' }}>
                  {/* Specialties */}
                  <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Specialties
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    All specialties included by default; exclude any you don't want
                  </p>

                  {[
                    { label: 'Specialty A', checked: specialtyA, setChecked: setSpecialtyA, freq: 4 },
                    { label: 'Specialty B', checked: specialtyB, setChecked: setSpecialtyB, freq: 4 },
                    { label: 'Specialty C', checked: specialtyC, setChecked: setSpecialtyC, freq: 4 },
                    { label: 'Specialty D', checked: specialtyD, setChecked: setSpecialtyD, freq: 4 },
                    { label: 'Specialty E', checked: specialtyE, setChecked: setSpecialtyE, freq: 4 },
                    { label: 'Specialty F', checked: specialtyF, setChecked: setSpecialtyF, freq: 4 }
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={item.checked} onChange={(e) => item.setChecked(e.target.checked)} style={{ cursor: 'pointer' }} />
                        {item.label}
                      </label>
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '24px' }}>
                        Estimated frequency: Every {item.freq} weeks
                      </p>
                    </div>
                  ))}

                  {/* Segments */}
                  <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px', marginTop: '20px' }}>
                    Segments
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    All segments included by default; exclude specific segments to filter the list
                  </p>

                  {[
                    { label: 'Segment A', checked: segmentA, setChecked: setSegmentA, freq: 4 },
                    { label: 'Segment B', checked: segmentB, setChecked: setSegmentB, freq: 4 },
                    { label: 'Segment C', checked: segmentC, setChecked: setSegmentC, freq: 4 },
                    { label: 'Segment D', checked: segmentD, setChecked: setSegmentD, freq: 4 },
                    { label: 'Segment E', checked: segmentE, setChecked: setSegmentE, freq: 4 },
                    { label: 'Segment F', checked: segmentF, setChecked: setSegmentF, freq: 4 }
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={item.checked} onChange={(e) => item.setChecked(e.target.checked)} style={{ cursor: 'pointer' }} />
                        {item.label}
                      </label>
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '24px' }}>
                        Estimated frequency: Every {item.freq} weeks
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            {/* Right Panel - Live Preview */}
            <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
              <div style={{ marginBottom: '20px' }}>
                {/* Region Dropdown - Moved inside table card header */}
                {/* All HCPs Table */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                    {selectedRegion}
                  </h4>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '12px',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Median Region (100 HCPs)">Median Region (100 HCPs)</option>
                    <option value="Top Region (65 HCPs)">Top Region (65 HCPs)</option>
                  </select>
                </div>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-table-header)' }}>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Name
                        </th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          PowerScore
                        </th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Specialty
                        </th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Segment
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockHCPsAll.slice(0, 10).map((hcp, i) => (
                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'var(--bg-table-row-alt)', borderTop: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>
                            {hcp.name}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: getPowerScoreColor(hcp.powerScore),
                              color: '#ffffff',
                              fontSize: '13px',
                              fontWeight: '700'
                            }}>
                              {hcp.powerScore}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {hcp.specialty}
                          </td>
                          <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {hcp.segment}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sample Curated List */}
                <h4 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: isFiltering ? 'var(--accent-blue)' : 'var(--text-primary)',
                  marginBottom: '12px',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  Sample Curated List ({mockHCPsCurated.length} HCPs)
                  {isFiltering && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '500',
                      color: 'var(--accent-blue)',
                      padding: '2px 6px',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '4px'
                    }}>
                      Updating...
                    </span>
                  )}
                  {changeMessage && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: countChange && countChange > 0 ? '#10b981' : '#ef4444',
                      padding: '3px 8px',
                      backgroundColor: countChange && countChange > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      borderRadius: '6px',
                      animation: 'slideIn 0.3s ease-out',
                      border: `1px solid ${countChange && countChange > 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}>
                      {changeMessage}
                    </span>
                  )}
                </h4>
                <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-table-header)' }}>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Name
                        </th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          PowerScore
                        </th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Specialty
                        </th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Segment
                        </th>
                        <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Bucket
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockHCPsWithBuckets.map((hcp, i) => {
                        const isHighlighted = highlightedRows.has(i);
                        const baseColor = i % 2 === 0 ? 'transparent' : 'var(--bg-table-row-alt)';
                        const highlightColor = countChange && countChange > 0
                          ? 'rgba(16, 185, 129, 0.15)' // Green for added
                          : 'rgba(239, 68, 68, 0.15)'; // Red for removed

                        return (
                          <tr key={i} style={{
                            backgroundColor: isHighlighted ? highlightColor : baseColor,
                            borderTop: '1px solid var(--border-subtle)',
                            transition: 'background-color 0.4s ease',
                            animation: isHighlighted ? 'rowFlash 0.6s ease-out' : 'none'
                          }}>
                            <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>
                              {hcp.name}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: getPowerScoreColor(hcp.powerScore),
                                color: '#ffffff',
                                fontSize: '13px',
                                fontWeight: '700'
                              }}>
                                {hcp.powerScore}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {hcp.specialty}
                            </td>
                            <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {hcp.segment}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                backgroundColor: getBucketColor(hcp.bucket),
                                color: '#ffffff',
                                fontSize: '11px',
                                fontWeight: '700',
                                letterSpacing: '0.02em'
                              }}>
                                {hcp.bucket}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* CSS Animations */}
          <style>{`
            @keyframes rowFlash {
              0% {
                box-shadow: inset 0 0 20px rgba(59, 130, 246, 0.4);
              }
              100% {
                box-shadow: none;
              }
            }

            @keyframes slideIn {
              0% {
                opacity: 0;
                transform: translateX(-10px);
              }
              100% {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
