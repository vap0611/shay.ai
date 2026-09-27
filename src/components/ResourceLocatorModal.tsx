import React, { useState, useMemo } from 'react';
import {
  DIRECTORY_RESOURCES,
  SupportResource,
  ResourceCategory,
  CATEGORY_METADATA
} from '../data/resources';
import {
  X,
  MapPin,
  Phone,
  PhoneCall,
  Copy,
  Check,
  Search,
  Filter,
  ShieldCheck,
  Scale,
  Home,
  HeartHandshake,
  Shield,
  Navigation,
  ExternalLink,
  MessageSquare,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  Share2,
  FileText
} from 'lucide-react';

interface ResourceLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseLocation?: {
    district: string;
    state: string;
    callerAlias?: string;
    caseId?: string;
  };
}

export const ResourceLocatorModal: React.FC<ResourceLocatorModalProps> = ({
  isOpen,
  onClose,
  caseLocation = { district: 'Morbi', state: 'Gujarat', callerAlias: 'Caller (Anonymous)' },
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(caseLocation.district || 'Morbi');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxDistanceRadius, setMaxDistanceRadius] = useState<number>(50); // km
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyFeedbackToast, setCopyFeedbackToast] = useState<string | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<'cards' | 'readout_script'>('cards');

  // Sync when caseLocation changes
  React.useEffect(() => {
    if (caseLocation.district) {
      setSelectedDistrict(caseLocation.district);
    }
  }, [caseLocation.district]);

  // Unique list of available districts from directory
  const availableDistricts = useMemo(() => {
    const list = Array.from(new Set(DIRECTORY_RESOURCES.map((r) => r.district)));
    return list.filter((d) => !d.includes('Apex') && !d.includes('Central'));
  }, []);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return DIRECTORY_RESOURCES.filter((res) => {
      // District matching: match selected district OR national/state apex fallbacks
      const isDistrictMatch =
        res.district.toLowerCase() === selectedDistrict.toLowerCase() ||
        res.district.includes('Central') ||
        res.district.includes('Apex') ||
        (res.state.toLowerCase() === (caseLocation.state || 'Gujarat').toLowerCase() && res.distanceKm <= maxDistanceRadius);

      if (!isDistrictMatch) return false;

      // Category filter
      if (selectedCategory !== 'all' && res.category !== selectedCategory) return false;

      // Distance radius filter (skip for Apex/0km)
      if (res.distanceKm > 0 && res.distanceKm > maxDistanceRadius) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = res.name.toLowerCase().includes(q);
        const matchesAddress = res.address.toLowerCase().includes(q);
        const matchesServices = res.servicesOffered.some((s) => s.toLowerCase().includes(q));
        const matchesMandate = res.statutoryMandate.toLowerCase().includes(q);
        const matchesPhone = res.phone.includes(q) || (res.emergencyHelpline && res.emergencyHelpline.includes(q));
        if (!matchesName && !matchesAddress && !matchesServices && !matchesMandate && !matchesPhone) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort: exact district matches first, then by ascending distance
      const aIsExact = a.district.toLowerCase() === selectedDistrict.toLowerCase();
      const bIsExact = b.district.toLowerCase() === selectedDistrict.toLowerCase();
      if (aIsExact && !bIsExact) return -1;
      if (!aIsExact && bIsExact) return 1;
      return a.distanceKm - b.distanceKm;
    });
  }, [selectedDistrict, selectedCategory, searchQuery, maxDistanceRadius, caseLocation.state]);

  // Helper for safe clipboard copy
  const copyToClipboard = (text: string, label: string, targetId?: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopyTextToClipboard(text);
      });
    } else {
      fallbackCopyTextToClipboard(text);
    }

    if (targetId) {
      setCopiedId(targetId);
      setTimeout(() => setCopiedId(null), 2200);
    }
    setCopyFeedbackToast(`Copied to clipboard: ${label}`);
    setTimeout(() => setCopyFeedbackToast(null), 3000);
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy error', err);
    }
    document.body.removeChild(textArea);
  };

  // Format single resource for SMS / WhatsApp / notes
  const formatResourceForSMS = (res: SupportResource) => {
    return [
      `🏛️ ${res.name}`,
      `📍 Address: ${res.address} ${res.landmark ? `(Near ${res.landmark})` : ''}`,
      `📞 Phone: ${res.phone} ${res.emergencyHelpline ? `| Emergency: ${res.emergencyHelpline}` : ''}`,
      `🕒 Hours: ${res.operatingHours}`,
      `🗣️ Languages: ${res.languages.join(', ')}`,
      `⚖️ Key Services: ${res.servicesOffered.slice(0, 2).join('; ')}`,
      `[National Helpline 14566 Referral]`
    ].join('\n');
  };

  // Format referral bundle for multiple selected resources
  const handleCopyReferralBundle = () => {
    const targets = selectedResourceIds.length > 0
      ? filteredResources.filter((r) => selectedResourceIds.includes(r.id))
      : filteredResources.slice(0, 3);

    const message = [
      `==============================`,
      `📋 NHAA 14566 ATROCITY RELIEF & LEGAL AID REFERRAL BUNDLE`,
      `Case Location: ${selectedDistrict}, ${caseLocation.state || 'India'}`,
      `Issued via: National Helpline Against Atrocities (14566)`,
      `==============================\n`,
      ...targets.map((res, i) => [
        `[#${i + 1}] ${res.name} (${CATEGORY_METADATA[res.category].label})`,
        `Distance: ~${res.distanceKm > 0 ? `${res.distanceKm} km` : 'Central / Apex Node'}`,
        `Address: ${res.address}`,
        `Helpline: ${res.phone} ${res.emergencyHelpline ? `| 24/7 Helpline: ${res.emergencyHelpline}` : ''}`,
        `Hours: ${res.operatingHours}`,
        `Services: ${res.servicesOffered.join(' • ')}`,
        `Statutory Entitlement: ${res.statutoryMandate}\n`
      ].join('\n')),
      `------------------------------`,
      `Emergency Numbers: Police 112 | NHAA 14566 | NALSA 15100 | Tele-MANAS 14416`,
      `Free Legal Aid is guaranteed by law under the Legal Services Authorities Act.`
    ].join('\n');

    copyToClipboard(message, `${targets.length} Verified Crisis Resources (SMS/WhatsApp Bundle)`);
  };

  const toggleSelectResource = (id: string) => {
    setSelectedResourceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllVisible = () => {
    if (selectedResourceIds.length === filteredResources.length) {
      setSelectedResourceIds([]);
    } else {
      setSelectedResourceIds(filteredResources.map((r) => r.id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full p-5 sm:p-6 shadow-2xl relative space-y-5 my-6 max-h-[92vh] flex flex-col">
        {/* Floating Copied Toast */}
        {copyFeedbackToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-bounce border border-emerald-400/50">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{copyFeedbackToast}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Geo-Fenced Resource Locator &amp; Legal Directory
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  PoA Rule 12 / NALSA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Matched to active caller location: <strong className="text-slate-200">{caseLocation.district}, {caseLocation.state}</strong> ({caseLocation.callerAlias || 'Active Case'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveViewMode(activeViewMode === 'cards' ? 'readout_script' : 'cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border cursor-pointer ${
                activeViewMode === 'readout_script'
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{activeViewMode === 'readout_script' ? 'Directory Cards' : 'Counsellor Readout Script'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Location Matcher Bar & Filter Controls */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* District Selector & Match Status */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Target District:</span>
              </span>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-rose-500"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d} ({caseLocation.state || 'Gujarat/UP/MH'})
                  </option>
                ))}
              </select>

              {selectedDistrict.toLowerCase() === (caseLocation.district || '').toLowerCase() ? (
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Auto-Matched to Case
                </span>
              ) : (
                <button
                  onClick={() => setSelectedDistrict(caseLocation.district || 'Morbi')}
                  className="text-[10px] text-rose-400 underline hover:text-rose-300 cursor-pointer"
                >
                  Reset to Case District ({caseLocation.district})
                </button>
              )}
            </div>

            {/* Radius Slider */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Radius:</span>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg">
                {[15, 30, 50, 100].map((radius) => (
                  <button
                    key={radius}
                    onClick={() => setMaxDistanceRadius(radius)}
                    className={`px-2 py-0.5 text-[11px] rounded font-medium transition-colors cursor-pointer ${
                      maxDistanceRadius === radius
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ≤{radius}km
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search & Category Pills */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                All Resources ({filteredResources.length})
              </button>

              {(Object.keys(CATEGORY_METADATA) as ResourceCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {CATEGORY_METADATA[cat].label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lawyer, shelter, hospital..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500 placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Action Header: Bundle Copy and Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-400 px-1 shrink-0">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-white">{filteredResources.length}</strong> verified crisis facilities in &amp; around {selectedDistrict}</span>
            {filteredResources.length > 0 && (
              <button
                onClick={selectAllVisible}
                className="text-rose-400 underline hover:text-rose-300 ml-2"
              >
                {selectedResourceIds.length === filteredResources.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          <button
            onClick={handleCopyReferralBundle}
            className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            title="Copy formatted SMS text of selected or top resources to clipboard"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>
              Copy Referral Bundle {selectedResourceIds.length > 0 ? `(${selectedResourceIds.length} Selected)` : '(Top 3)'}
            </span>
          </button>
        </div>

        {/* Content Area: Cards View or Readout Script View */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
          {activeViewMode === 'readout_script' ? (
            /* Telephone Readout Script View for Active Counsellors */
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <PhoneCall className="w-4 h-4" />
                  <span>Trauma-Informed Telephone Readout Script for Caller</span>
                </div>
                <button
                  onClick={() => {
                    const scriptText = [
                      `"सर/मैडम, हम आपके साथ हैं। आपकी सुरक्षा और कानूनी मदद के लिए आपके निकटतम ${selectedDistrict} में निम्नलिखित सुविधाएं उपलब्ध हैं:"\n`,
                      ...filteredResources.slice(0, 3).map((r, i) =>
                        `${i + 1}. ${r.name}: ${r.address}। फोन नंबर है: ${r.phone} ${r.emergencyHelpline ? `(या हेल्पलाइन ${r.emergencyHelpline})` : ''}। यहाँ आपको मुफ्त कानूनी सहायता और सुरक्षा मिलेगी।`
                      ),
                      `\n"क्या मैं यह जानकारी आपको सीधे SMS या WhatsApp पर भेज दूँ?"`
                    ].join('\n');
                    copyToClipboard(scriptText, 'Counsellor Hindi Readout Script');
                  }}
                  className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Script</span>
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    Hindi Verbal Guidance (हिन्दी मार्गदर्शन)
                  </span>
                  <p className="text-slate-200 italic">
                    &ldquo;सर/मैडम, घबराइए नहीं, राष्ट्रीय हेल्पलाइन 14566 की टीम आपके साथ है। {selectedDistrict} जिले में हमारे पास सीधे सरकार द्वारा प्रमाणित मुफ्त कानूनी सहायता और सुरक्षा केंद्र हैं। मैं आपको सबसे नज़दीकी केंद्र का विवरण बता रहा हूँ:&rdquo;
                  </p>
                  <div className="space-y-2 pt-1 font-mono text-[11px] text-slate-300">
                    {filteredResources.slice(0, 3).map((r, idx) => (
                      <div key={r.id} className="bg-slate-950 p-2.5 rounded border border-slate-800">
                        <strong className="text-white">{idx + 1}. {r.name}</strong> (~{r.distanceKm} km)<br />
                        पता: {r.address}<br />
                        फोन: <span className="text-emerald-400 font-bold">{r.phone}</span> {r.emergencyHelpline && `| 24 घंटे हेल्पलाइन: ${r.emergencyHelpline}`}
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-200 italic pt-1">
                    &ldquo;क्या आप यह विवरण लिख पा रहे हैं, या मैं अभी एक क्लिक में आपके मोबाइल पर SMS भेज दूँ?&rdquo;
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                    English Verbal Guidance
                  </span>
                  <p className="text-slate-200 italic">
                    &ldquo;You are safe with us on 14566. Under the SC/ST (PoA) Act and Legal Services Authorities Act, you are entitled to free empanelled legal counsel, immediate victim compensation assistance, and safe sanctuary in {selectedDistrict}. Here are the verified contact details:&rdquo;
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Resource Cards Grid */
            <div className="space-y-3">
              {filteredResources.length === 0 ? (
                <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center space-y-2">
                  <Info className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="text-sm font-semibold text-slate-300">No facilities matched in this radius</div>
                  <p className="text-xs text-slate-500">
                    Try expanding the search radius to ≤100km or resetting category filters to show statewide apex centers.
                  </p>
                  <button
                    onClick={() => {
                      setMaxDistanceRadius(100);
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="mt-2 py-1.5 px-4 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Expand Search to Statewide
                  </button>
                </div>
              ) : (
                filteredResources.map((res) => {
                  const isSelected = selectedResourceIds.includes(res.id);
                  const isJustCopied = copiedId === res.id;
                  const catMeta = CATEGORY_METADATA[res.category];

                  return (
                    <div
                      key={res.id}
                      className={`bg-slate-950 border rounded-xl p-4 transition-all space-y-3 ${
                        isSelected
                          ? 'border-rose-500/80 bg-rose-950/10 shadow-sm'
                          : 'border-slate-800/80 hover:border-slate-750'
                      }`}
                    >
                      {/* Top Row: Name, Category, Distance, Checkbox */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectResource(res.id)}
                            className="mt-1 w-4 h-4 rounded border-slate-700 text-rose-600 focus:ring-rose-500 focus:ring-offset-slate-900 cursor-pointer"
                            id={`check-${res.id}`}
                          />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <label
                                htmlFor={`check-${res.id}`}
                                className="text-sm font-bold text-white hover:text-rose-300 transition-colors cursor-pointer"
                              >
                                {res.name}
                              </label>

                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${catMeta.badgeColor}`}>
                                {catMeta.label}
                              </span>

                              {res.is24x7 && (
                                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/80 font-mono">
                                  24/7 OPEN
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                              <span className="flex items-center gap-1 font-mono text-emerald-400">
                                <Navigation className="w-3 h-3" />
                                {res.distanceKm > 0 ? `~${res.distanceKm} km away` : 'Statewide / Apex Node'}
                              </span>
                              <span>·</span>
                              <span>{res.district}, {res.state}</span>
                              {res.landmark && (
                                <>
                                  <span>·</span>
                                  <span className="text-slate-500">Near {res.landmark}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quick 1-Click Copy Button */}
                        <div className="flex items-center gap-1.5 shrink-0 sm:self-start">
                          <button
                            onClick={() => copyToClipboard(formatResourceForSMS(res), `${res.name} (SMS Text)`, res.id)}
                            className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                              isJustCopied
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-600'
                            }`}
                            title="Copy SMS / WhatsApp formatted text to send to caller"
                          >
                            {isJustCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>Copy for SMS</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Middle Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                        <div className="space-y-1.5">
                          <div className="text-slate-300 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{res.address}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 pt-0.5">
                            <div className="text-slate-200 flex items-center gap-1.5 font-mono">
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              <strong className="text-white">{res.phone}</strong>
                            </div>

                            {res.emergencyHelpline && (
                              <div className="text-slate-200 flex items-center gap-1 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                <span className="text-rose-400">Emergency:</span>
                                <strong>{res.emergencyHelpline}</strong>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{res.operatingHours}</span>
                          </div>

                          <div className="text-[11px] text-slate-400">
                            <span>Spoken: </span>
                            <strong className="text-slate-300">{res.languages.join(', ')}</strong>
                          </div>

                          {res.contactPerson && (
                            <div className="text-[11px] text-slate-400">
                              <span>Desk: </span>
                              <strong className="text-slate-300">{res.contactPerson}</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Row: Key Services Tags & Statutory Mandate */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {res.servicesOffered.map((service, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800"
                            >
                              ✓ {service}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                          <span className="truncate max-w-md">
                            Mandate: <strong className="text-slate-400">{res.statutoryMandate}</strong>
                          </span>
                          {res.notes && (
                            <span className="italic text-slate-400 hidden sm:inline">{res.notes}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer with Quick Statutory Hotlines */}
        <div className="border-t border-slate-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>National Toll-Free Hotlines:</span>
            <span className="text-slate-300">NHAA: <strong className="text-white">14566</strong></span>
            <span>·</span>
            <span className="text-slate-300">Legal Aid: <strong className="text-emerald-400">15100</strong></span>
            <span>·</span>
            <span className="text-slate-300">Tele-MANAS: <strong className="text-sky-400">14416</strong></span>
            <span>·</span>
            <span className="text-slate-300">Police: <strong className="text-rose-400">112</strong></span>
          </div>

          <button
            onClick={onClose}
            className="py-1 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
