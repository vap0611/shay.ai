import React, { useState, useEffect, useRef } from 'react';
import {
  AcousticFeatures,
  HelplineCase,
  MicroScreeningAnswers,
  RiskLevel,
  SVIResult
} from '../types';
import { PRELOADED_SCENARIOS, PreloadedScenario } from '../data/scenarios';
import { calculateSVI } from '../utils/sviEngine';
import {
  Phone,
  PhoneOff,
  AlertOctagon,
  ShieldAlert,
  Play,
  RotateCcw,
  Sparkles,
  Activity,
  Mic,
  Volume2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneForwarded,
  Info,
  ChevronRight,
  Sliders,
  AlertTriangle,
  MapPin,
  Navigation,
  PhoneCall,
  Copy,
  Check,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { WarmHandoffModal } from './WarmHandoffModal';
import { ResourceLocatorModal } from './ResourceLocatorModal';

interface LiveHelplineAssistProps {
  onCaseCreatedOrUpdated?: (c: HelplineCase) => void;
  onOpenScreening?: () => void;
  onOpenConsent?: () => void;
  screeningData?: Partial<MicroScreeningAnswers>;
}

export const LiveHelplineAssist: React.FC<LiveHelplineAssistProps> = ({
  onCaseCreatedOrUpdated,
  onOpenScreening,
  onOpenConsent,
  screeningData = {},
}) => {
  const [selectedScenario, setSelectedScenario] = useState<PreloadedScenario>(PRELOADED_SCENARIOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [activeTranscript, setActiveTranscript] = useState<string>('');
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(0);
  const [supervisorCountdown, setSupervisorCountdown] = useState<number | null>(null);
  const [supervisorEscalated, setSupervisorEscalated] = useState<boolean>(false);
  const [isWarmHandoffOpen, setIsWarmHandoffOpen] = useState<boolean>(false);
  const [isResourceLocatorOpen, setIsResourceLocatorOpen] = useState<boolean>(false);
  const [acknowledgedAlert, setAcknowledgedAlert] = useState<boolean>(false);
  const [dialNotice, setDialNotice] = useState<string | null>(null);
  const [copiedHelpline, setCopiedHelpline] = useState<boolean>(false);
  const [isQuickCallCardOpen, setIsQuickCallCardOpen] = useState<boolean>(false);
  const [customInputMode, setCustomInputMode] = useState<boolean>(false);
  const [customText, setCustomText] = useState<string>('');
  const [customAcousticAffect, setCustomAcousticAffect] = useState<'agitated' | 'baseline' | 'flat_numbed' | 'hesitant'>('baseline');
  const [liveSVI, setLiveSVI] = useState<SVIResult>(() =>
    calculateSVI({
      transcript: PRELOADED_SCENARIOS[0].transcriptSteps[0].text,
      acoustic: PRELOADED_SCENARIOS[0].acousticProfile,
      confidence: PRELOADED_SCENARIOS[0].confidence,
    })
  );

  // Auto-play interval for scenario simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < selectedScenario.transcriptSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const next = prev + 1;
          const fullText = selectedScenario.transcriptSteps
            .slice(0, next + 1)
            .map((s) => s.text)
            .join(' ');
          setActiveTranscript(fullText);

          // Recalculate SVI rolling window
          const result = calculateSVI({
            transcript: fullText,
            acoustic: selectedScenario.acousticProfile,
            screening: selectedScenario.microScreening || screeningData,
            confidence: selectedScenario.confidence,
            asrFailed: selectedScenario.asrFailed,
            unsupportedLanguage: selectedScenario.unsupportedLanguage,
          });
          setLiveSVI(result);

          return next;
        });
      }, 4000);
    } else if (currentStepIndex >= selectedScenario.transcriptSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, selectedScenario, screeningData]);

  // Call timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // 30-second Supervisor Escalation Countdown when Critical is detected
  useEffect(() => {
    if (liveSVI.finalCategory === 'Critical' && !acknowledgedAlert && supervisorCountdown === null && !supervisorEscalated) {
      setSupervisorCountdown(30);
    }
  }, [liveSVI.finalCategory, acknowledgedAlert, supervisorCountdown, supervisorEscalated]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    if (supervisorCountdown !== null && supervisorCountdown > 0 && !acknowledgedAlert) {
      countdownInterval = setInterval(() => {
        setSupervisorCountdown((prev) => {
          if (prev === null || prev <= 1) {
            setSupervisorEscalated(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [supervisorCountdown, acknowledgedAlert]);

  const handleSelectScenario = (scenario: PreloadedScenario) => {
    setSelectedScenario(scenario);
    setCustomInputMode(false);
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setCallDurationSeconds(0);
    setAcknowledgedAlert(false);
    setSupervisorCountdown(null);
    setSupervisorEscalated(false);

    const initialText = scenario.transcriptSteps[0].text;
    setActiveTranscript(initialText);
    setLiveSVI(
      calculateSVI({
        transcript: initialText,
        acoustic: scenario.acousticProfile,
        screening: scenario.microScreening || screeningData,
        confidence: scenario.confidence,
        asrFailed: scenario.asrFailed,
        unsupportedLanguage: scenario.unsupportedLanguage,
      })
    );
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setCallDurationSeconds(0);
    setAcknowledgedAlert(false);
    setSupervisorCountdown(null);
    setSupervisorEscalated(false);
    const initialText = selectedScenario.transcriptSteps[0].text;
    setActiveTranscript(initialText);
    setLiveSVI(
      calculateSVI({
        transcript: initialText,
        acoustic: selectedScenario.acousticProfile,
        screening: selectedScenario.microScreening || screeningData,
        confidence: selectedScenario.confidence,
        asrFailed: selectedScenario.asrFailed,
        unsupportedLanguage: selectedScenario.unsupportedLanguage,
      })
    );
  };

  const handleAcknowledgeCritical = () => {
    setAcknowledgedAlert(true);
    setSupervisorCountdown(null);
  };

  const handleCustomTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const acoustic: AcousticFeatures = {
      pitchHz: customAcousticAffect === 'agitated' ? 240 : customAcousticAffect === 'flat_numbed' ? 120 : 160,
      jitterPercent: customAcousticAffect === 'agitated' ? 2.5 : 0.6,
      shimmerPercent: 1.2,
      speechRateWpm: customAcousticAffect === 'agitated' ? 150 : 85,
      pauseRatio: 0.3,
      energyDb: 45,
      affectType: customAcousticAffect,
      contributionPct: 15,
    };

    setActiveTranscript(customText);
    const result = calculateSVI({
      transcript: customText,
      acoustic,
      screening: screeningData,
      confidence: 0.90,
    });
    setLiveSVI(result);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleQuickDial = (e?: React.MouseEvent) => {
    setDialNotice('Dialing NHAA Helpline 14566 (Toll-Free)... Forwarding click-to-dial to device telephony.');
    if (typeof window !== 'undefined') {
      window.location.href = 'tel:14566';
    }
    setTimeout(() => {
      setDialNotice(null);
    }, 4500);
  };

  const handleCopyHelpline = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('14566');
    setCopiedHelpline(true);
    setTimeout(() => setCopiedHelpline(false), 2200);
  };

  // Mock case data for handoff modal
  const currentCaseForHandoff: HelplineCase = {
    id: `CALL-${Date.now().toString().slice(-6)}`,
    callerAlias: selectedScenario.callerAlias,
    district: selectedScenario.district,
    state: selectedScenario.state,
    language: selectedScenario.language,
    channel: '14566_telephony',
    timestamp: 'Just now',
    lastContactDate: 'Now',
    sviHistory: [{ date: 'Today', score: liveSVI.sviScore, category: liveSVI.finalCategory, contactType: 'Live Call' }],
    currentSVI: liveSVI,
    restrictedRouting: selectedScenario.restrictedRouting || false,
    perpetratorInfluence: selectedScenario.perpetratorInfluence || 'local_panchayat',
    consent: {
      analysisConsent: true,
      agencySharingConsent: false,
      verbalConsentLogged: true,
      emergencyExceptionActive: liveSVI.finalCategory === 'Critical',
    },
    reviewStatus: 'pending',
    transcript: activeTranscript,
    slaMinutesRemaining: liveSVI.finalCategory === 'Critical' ? 15 : 240,
    slaBreached: false,
  };

  return (
    <div className="space-y-5">
      {/* 30-Second Supervisor Escalation Banner */}
      {liveSVI.finalCategory === 'Critical' && !acknowledgedAlert && (
        <div className="bg-rose-950/80 border-2 border-rose-500 rounded-xl p-4 shadow-lg animate-pulse flex flex-col md:flex-row items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-8 h-8 text-rose-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-rose-200">
                  CRITICAL ATROCITY / LIFE-SAFETY TRIGGER MID-CALL
                </span>
                {supervisorCountdown !== null && (
                  <span className="bg-rose-600 px-2 py-0.5 rounded font-mono text-xs font-bold tabular-nums">
                    Auto-Escalate in {supervisorCountdown}s
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-100 mt-0.5">
                {liveSVI.overrides[0]?.ruleName || 'High-Risk Trigger'}: {liveSVI.overrides[0]?.evidence || 'Caller in acute crisis.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAcknowledgeCritical}
              className="py-1.5 px-3 bg-rose-800 hover:bg-rose-700 text-white text-xs font-medium rounded border border-rose-600 transition-colors"
            >
              Acknowledge Alert
            </button>
            <button
              onClick={() => setIsWarmHandoffOpen(true)}
              className="py-1.5 px-4 bg-white text-rose-900 hover:bg-rose-100 text-xs font-bold rounded shadow transition-colors flex items-center gap-1.5"
            >
              <PhoneForwarded className="w-4 h-4" />
              <span>1-Click Warm Handoff</span>
            </button>
          </div>
        </div>
      )}

      {supervisorEscalated && (
        <div className="bg-amber-950/80 border border-amber-500 rounded-lg p-3 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>
              <strong>Supervisor Escalated:</strong> Alert was unacknowledged for 30 seconds. Paged Shift Supervisor Desk &amp; Crisis Room.
            </span>
          </div>
          <span className="text-[11px] text-amber-300 font-mono">AUTOMATED SAFETY NET §7</span>
        </div>
      )}

      {/* Scenario Preset Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Test Scenario / Live Input Stream
            </h2>
            <p className="text-xs text-slate-400">
              Demonstrates real-time rolling SVI, 8kHz telephony robustness, and hard overrides.
            </p>
          </div>
          <button
            onClick={() => setCustomInputMode(!customInputMode)}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 self-start sm:self-auto"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{customInputMode ? 'Switch to Scenario Presets' : 'Custom Narrative & Microphone Mode'}</span>
          </button>
        </div>

        {!customInputMode ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {PRELOADED_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedScenario.id === sc.id
                    ? 'bg-rose-950/40 border-rose-500 text-white'
                    : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="text-[11px] font-bold text-rose-400 truncate">{sc.badge}</div>
                <div className="text-xs font-semibold text-white mt-0.5 line-clamp-1">{sc.title}</div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="uppercase font-mono">{sc.language}</span>
                  <span>·</span>
                  <span className="truncate">{sc.callerAlias}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleCustomTextSubmit} className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Type or paste call transcript in Hindi, Gujarati, or English (e.g. 'मार डालेंगे, आग लगा देंगे' or 'water cut off by panchayat')..."
                  className="w-full h-20 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div className="w-full sm:w-64 space-y-2">
                <label className="text-[11px] text-slate-400 block font-medium">Acoustic Affect Profile (openSMILE):</label>
                <select
                  value={customAcousticAffect}
                  onChange={(e) => setCustomAcousticAffect(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200"
                >
                  <option value="flat_numbed">Flat / Numbed (Stoic Trauma)</option>
                  <option value="agitated">Agitated / High Tremor</option>
                  <option value="hesitant">Hesitant / Pause-heavy</option>
                  <option value="baseline">Baseline Calm</option>
                </select>
                <button
                  type="submit"
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded transition-colors"
                >
                  Score Live Input
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Main Live Assist Workspace: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Live Call Streaming & Transcript (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Call Status Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isPlaying ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{selectedScenario.callerAlias}</span>
                    <span className="text-[11px] text-slate-400">({selectedScenario.district}, {selectedScenario.state})</span>
                    {selectedScenario.restrictedRouting && (
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded">
                        Restricted Routing
                      </span>
                    )}
                    <button
                      onClick={() => setIsResourceLocatorOpen(true)}
                      className="text-[10px] bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-sm ml-1"
                      title="Open Geo-Fenced Resource Locator"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Legal Aid &amp; Shelters ({selectedScenario.district})</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>Telephony 8kHz (AI4Bharat IndicConformer)</span>
                    <span>·</span>
                    <span className="font-mono text-emerald-400">{formatSeconds(callDurationSeconds)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`py-1.5 px-3 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isPlaying
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isPlaying ? 'Pause' : 'Stream Call'}</span>
                </button>
                <button
                  onClick={handleReset}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  title="Reset Scenario"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Streaming Transcript with Keyword Highlighting */}
            <div className="p-4 space-y-3 min-h-[220px] max-h-[320px] overflow-y-auto font-sans text-xs">
              <div className="text-[11px] text-slate-400 flex items-center justify-between pb-1 border-b border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  <span>Channel A: Real-time Streaming ASR (5s Window)</span>
                </span>
                <span className="text-slate-500 font-mono">
                  Confidence: {Math.round(selectedScenario.confidence * 100)}%
                </span>
              </div>

              {selectedScenario.transcriptSteps.slice(0, currentStepIndex + 1).map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border leading-relaxed ${
                    step.speaker === '14566 Agent'
                      ? 'bg-slate-800/40 border-slate-800 text-slate-300'
                      : step.isKeyMoment
                      ? 'bg-rose-950/30 border-rose-800/50 text-rose-100 font-medium'
                      : 'bg-slate-900 border-slate-800/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold">{step.speaker}</span>
                    <span className="font-mono">{step.timestampSec}s</span>
                  </div>
                  <div>{step.text}</div>
                </div>
              ))}

              {isPlaying && currentStepIndex < selectedScenario.transcriptSteps.length - 1 && (
                <div className="flex items-center gap-2 text-slate-500 text-[11px] italic py-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Transcribing speech in real-time...</span>
                </div>
              )}
            </div>

            {/* Channel C: Acoustic & Prosodic Telephony Features */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Channel C: Acoustic Features (openSMILE eGeMAPS)</span>
                </span>
                <span className="text-[10px] text-amber-400">
                  Capped at ≤15% · Baseline-Relative
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500">Pitch (F0)</div>
                  <div className="font-mono text-xs font-semibold text-slate-200 mt-0.5">
                    {selectedScenario.acousticProfile.pitchHz} Hz
                  </div>
                </div>

                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500">Jitter</div>
                  <div className="font-mono text-xs font-semibold text-slate-200 mt-0.5">
                    {selectedScenario.acousticProfile.jitterPercent}%
                  </div>
                </div>

                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500">Shimmer</div>
                  <div className="font-mono text-xs font-semibold text-slate-200 mt-0.5">
                    {selectedScenario.acousticProfile.shimmerPercent}%
                  </div>
                </div>

                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500">Speech Rate</div>
                  <div className="font-mono text-xs font-semibold text-slate-200 mt-0.5">
                    {selectedScenario.acousticProfile.speechRateWpm} wpm
                  </div>
                </div>

                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500">Pause Ratio</div>
                  <div className="font-mono text-xs font-semibold text-slate-200 mt-0.5">
                    {selectedScenario.acousticProfile.pauseRatio}
                  </div>
                </div>

                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500">Affect Type</div>
                  <div className="text-[11px] font-semibold text-sky-300 mt-0.5 truncate capitalize">
                    {selectedScenario.acousticProfile.affectType.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {selectedScenario.acousticProfile.affectType === 'flat_numbed' && liveSVI.finalCategory === 'Critical' && (
                <div className="mt-2 text-[11px] bg-sky-950/40 border border-sky-800/40 rounded p-2 text-sky-200">
                  <span className="font-semibold text-sky-300">Trauma Numbing Rule Active:</span> Caller sounds flat/stoic (Pitch: {selectedScenario.acousticProfile.pitchHz}Hz), but narrative discloses severe threat. Acoustics intentionally precluded from overriding narrative danger!
                </div>
              )}
            </div>
          </div>

          {/* Scripted Trauma-Informed Agent Guidance */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Trauma-Informed Agent Script (§7 Call Guidance)</span>
            </h3>
            <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-200 italic leading-relaxed border border-slate-700/50">
              {liveSVI.finalCategory === 'Critical' ? (
                liveSVI.overrides.some(o => o.ruleName.includes('SH Override')) ? (
                  <span>
                    &ldquo;सुनीता जी, मैं आपके साथ लाइन पर हूँ और कहीं नहीं जा रहा। आप सुरक्षित महसूस नहीं कर रही हैं, मुझे इसकी बहुत चिंता है। क्या आप इस समय किसी सुरक्षित कमरे में हैं? मैं हमारी वरिष्ठ संकट काउंसलर को भी इसी कॉल पर जोड़ रहा हूँ...&rdquo;
                  </span>
                ) : (
                  <span>
                    &ldquo;रमेश्वर जी, आपकी सुरक्षा हमारी पहली प्राथमिकता है। आप घर के अंदर रहें, दरवाजा बंद रखें। हम आपकी कॉल को वरिष्ठ सुरक्षा नोडल टीम से जोड़ रहे हैं और आपकी स्थिति नोट कर ली गई है। फोन मत काटिए।&rdquo;
                  </span>
                )
              ) : selectedScenario.language === 'gu' ? (
                <span>
                  &ldquo;વાલજીભાઈ, સામાજિક બહિષ્કાર એ એટ્રોસિટી એક્ટ હેઠળ ગંભીર ગુનો છે. અમે તમારો કાયદાકીય સહાય કેસ નોંધીએ છીએ. શું તમે અથવા તમારા પરિવારજનો આ ક્ષણે સુરક્ષિત જગ્યાએ છો?&rdquo;
                </span>
              ) : (
                <span>
                  &ldquo;हम आपकी बात समझ रहे हैं। आपकी शिकायत और अधिकारों की रक्षा के लिए विधिक सेवा प्राधिकरण (DLSA) और नोडल अधिकारी को सूचना दी जा रही है। कृपया अपनी स्थिति बताएं।&rdquo;
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: SVI Gauge, 4 Sub-Scores, Overrides & Live Action (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* SVI Gauge Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Stress Vulnerability Index
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                    {liveSVI.sviScore}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded text-xs font-bold tracking-wide uppercase ${
                  liveSVI.finalCategory === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                  liveSVI.finalCategory === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  liveSVI.finalCategory === 'Moderate' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {liveSVI.finalCategory}
                </span>
                {liveSVI.isOverridden && (
                  <div className="text-[10px] text-rose-400 font-medium mt-1">
                    Deterministic Override Active
                  </div>
                )}
              </div>
            </div>

            {/* Formula Breakdown Indicator */}
            <div className="text-[10px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800 flex items-center justify-between font-mono">
              <span>W (mean): {liveSVI.weightedMean}</span>
              <span>·</span>
              <span>M (peak): {liveSVI.peakComponent}</span>
              <span>·</span>
              <span>Formula: 0.5·W + 0.5·M</span>
            </div>

            {/* Four Sub-Scores */}
            <div className="space-y-2.5 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Emotional Distress (ED)</span>
                  <span className="font-mono text-white font-semibold">{liveSVI.subScores.ED}/100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${liveSVI.subScores.ED}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Self-Harm Risk (SH)</span>
                  <span className="font-mono text-white font-semibold">{liveSVI.subScores.SH}/100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${liveSVI.subScores.SH}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">External Threat &amp; Retaliation (TH)</span>
                  <span className="font-mono text-white font-semibold">{liveSVI.subScores.TH}/100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${liveSVI.subScores.TH}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Isolation &amp; Support Deficit (SI)</span>
                  <span className="font-mono text-white font-semibold">{liveSVI.subScores.SI}/100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${liveSVI.subScores.SI}%` }} />
                </div>
              </div>
            </div>

            {/* Overrides & Evidence List */}
            {liveSVI.explanationBullets.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Explainable Evidence Attribution
                </span>
                <div className="space-y-1">
                  {liveSVI.explanationBullets.map((bullet, i) => (
                    <div key={i} className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2 rounded border border-slate-800/80">
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setIsResourceLocatorOpen(true)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Resource Locator: Legal Aid &amp; Shelters ({selectedScenario.district})</span>
              </button>

              <button
                onClick={() => setIsWarmHandoffOpen(true)}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <PhoneForwarded className="w-4 h-4" />
                <span>Trigger Live Warm Handoff (§8 Protocol)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {onOpenScreening && (
                  <button
                    onClick={onOpenScreening}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium rounded border border-slate-700 transition-colors"
                  >
                    Clinical Micro-Screening
                  </button>
                )}
                {onOpenConsent && (
                  <button
                    onClick={onOpenConsent}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium rounded border border-slate-700 transition-colors"
                  >
                    Consent Gateway
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Locator Modal */}
      <ResourceLocatorModal
        isOpen={isResourceLocatorOpen}
        onClose={() => setIsResourceLocatorOpen(false)}
        caseLocation={{
          district: selectedScenario.district,
          state: selectedScenario.state,
          callerAlias: selectedScenario.callerAlias,
        }}
      />

      {/* Warm Handoff Modal */}
      <WarmHandoffModal
        caseData={currentCaseForHandoff}
        isOpen={isWarmHandoffOpen}
        onClose={() => setIsWarmHandoffOpen(false)}
        onHandoffComplete={(target) => {
          setAcknowledgedAlert(true);
        }}
      />

      {/* Floating 'Quick-Call' Button for 14566 Helpline */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 print:hidden">
        {/* Active Dialing Notification Toast */}
        {dialNotice && (
          <div className="bg-emerald-950/95 border-2 border-emerald-500 rounded-xl p-3.5 shadow-2xl text-white max-w-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 animate-pulse">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-200">
                    Click-to-Dial Triggered
                  </p>
                  <p className="text-[11px] text-emerald-100/90 leading-tight mt-0.5">
                    {dialNotice}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDialNotice(null)}
                className="text-emerald-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                title="Dismiss"
                aria-label="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[11px]">
              <span className="text-emerald-300 font-medium">Active Case: {selectedScenario.callerAlias}</span>
              <span className="bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold">14566</span>
            </div>
          </div>
        )}

        {/* Quick-Call Detailed Telephony Popover */}
        {isQuickCallCardOpen && (
          <div className="bg-slate-900/95 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl text-slate-200 w-84 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">NHAA 14566 Helpline</h4>
                  <p className="text-[10px] text-slate-400">National Helpline Against Atrocities</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuickCallCardOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Current Assessment</span>
                  <span className="text-emerald-400 font-mono font-medium">{liveSVI.finalCategory} ({liveSVI.sviScore}/100)</span>
                </div>
                <div className="font-semibold text-white">{selectedScenario.callerAlias}</div>
                <div className="text-[11px] text-slate-400">{selectedScenario.district}, {selectedScenario.state} · {selectedScenario.language}</div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block">Toll-Free Helpline</span>
                  <span className="text-lg font-mono font-bold text-white tracking-wider">14566</span>
                </div>
                <button
                  onClick={handleCopyHelpline}
                  className="py-1.5 px-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded text-xs font-medium flex items-center gap-1.5 border border-emerald-700/60 transition-colors cursor-pointer"
                  title="Copy 14566"
                >
                  {copiedHelpline ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedHelpline ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed px-0.5">
                Direct click-to-dial opens device telephony / SIP client to patch into 14566. Toll-free 24x7 crisis response.
              </div>

              <div className="pt-1">
                <a
                  href="tel:14566"
                  onClick={handleQuickDial}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
                >
                  <PhoneCall className="w-4 h-4 animate-bounce" />
                  <span>Click-to-Dial 14566 Now</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Floating Trigger Button Pill */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full border border-emerald-500/50 shadow-2xl shadow-emerald-950/80">
          <a
            href="tel:14566"
            onClick={handleQuickDial}
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2.5 px-4 rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
            title="Click to dial 14566 Helpline"
            aria-label="Click to dial 14566 Helpline"
          >
            {/* Live Pulsing Beacon */}
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>

            <PhoneCall className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-200 shrink-0" />

            <div className="flex flex-col items-start leading-none text-left">
              <span className="text-[10px] text-emerald-100 font-medium tracking-wide uppercase">Quick-Call</span>
              <span className="text-sm font-black tracking-wider">14566</span>
            </div>
          </a>

          {/* Quick Copy Number Action Button */}
          <button
            onClick={handleCopyHelpline}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            title={copiedHelpline ? "Copied 14566!" : "Copy 14566 to clipboard"}
            aria-label="Copy 14566 Helpline Number"
          >
            {copiedHelpline ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Expand / Details Toggle Button */}
          <button
            onClick={() => setIsQuickCallCardOpen(!isQuickCallCardOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            title={isQuickCallCardOpen ? "Collapse Details" : "Show Helpline Details"}
            aria-label="Toggle 14566 helpline details"
          >
            {isQuickCallCardOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
