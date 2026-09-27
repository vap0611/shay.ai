import { AcousticFeatures, HelplineCase, LanguageCode } from '../types';
import { calculateSVI } from '../utils/sviEngine';

export interface PreloadedScenario {
  id: string;
  title: string;
  badge: string;
  description: string;
  language: LanguageCode;
  callerAlias: string;
  district: string;
  state: string;
  acousticProfile: AcousticFeatures;
  transcriptSteps: Array<{
    timestampSec: number;
    text: string;
    isKeyMoment?: boolean;
    speaker: 'Caller' | '14566 Agent';
  }>;
  microScreening?: {
    phq2_depressedMood: number;
    phq2_anhedonia: number;
    gad2_anxiety: number;
    gad2_uncontrollableWorry: number;
    pcptsd_nightmaresOrHyperarousal: boolean;
    cssrs_suicidalThoughts: boolean;
    cssrs_suicidalPlan: boolean;
  };
  isMinorOrElderly?: boolean;
  confidence: number;
  asrFailed?: boolean;
  unsupportedLanguage?: boolean;
  restrictedRouting?: boolean;
  perpetratorInfluence: 'low' | 'local_panchayat' | 'locally_powerful_official' | 'organized_syndicate';
}

export const PRELOADED_SCENARIOS: PreloadedScenario[] = [
  {
    id: 'scenario-threat-override',
    title: '1. Calm Voice + Nocturnal Arson Threat (Rule Override)',
    badge: 'Acoustic Masking Test',
    description: 'Caller speaks in a flat, numbed voice (deceptively low acoustic agitation). But transcript discloses imminent nocturnal death/arson threat. Proves acoustics cannot mask severe narrative.',
    language: 'hi',
    callerAlias: 'Rameshwar K.',
    district: 'Morbi',
    state: 'Gujarat',
    acousticProfile: {
      pitchHz: 130, // Deceptively low/flat
      jitterPercent: 0.52,
      shimmerPercent: 1.1,
      speechRateWpm: 92, // Slow, flat
      pauseRatio: 0.38,
      energyDb: 42,
      affectType: 'flat_numbed',
      contributionPct: 15,
    },
    transcriptSteps: [
      { timestampSec: 0, speaker: '14566 Agent', text: 'नमस्ते, राष्ट्रीय हेल्पलाइन 14566 में आपका स्वागत है। मैं आपकी क्या सहायता कर सकता हूँ?' },
      { timestampSec: 5, speaker: 'Caller', text: 'सर, हम गांव के बाहर बस्ति में रहते हैं... कल शाम को मुखिया के कुछ लड़के आए थे।' },
      { timestampSec: 12, speaker: '14566 Agent', text: 'जी, आप सुरक्षित हैं? कृपया विस्तार से बताएं क्या हुआ।' },
      { timestampSec: 18, speaker: 'Caller', text: 'वे कह रहे हैं कि हमने जो एफआईआर की थी, वो तुरंत वापस लो... फैसला करो।', isKeyMoment: true },
      { timestampSec: 25, speaker: 'Caller', text: 'उन्होंने धमकी दी है कि आज रात हथियार लेकर आएंगे और घर में आग लगा देंगे... हमें मार डालेंगे।', isKeyMoment: true },
      { timestampSec: 32, speaker: '14566 Agent', text: 'रमेश्वर जी, आप शांत रहें। हम लाइन पर हैं। क्या वे अभी भी बाहर दिख रहे हैं?' },
      { timestampSec: 38, speaker: 'Caller', text: 'हां, घर के बाहर खड़े हैं... बाइक की आवाज आ रही है।', isKeyMoment: true }
    ],
    confidence: 0.91,
    restrictedRouting: true,
    perpetratorInfluence: 'locally_powerful_official',
  },
  {
    id: 'scenario-self-harm',
    title: '2. Mid-Call Despair & Self-Harm (Live Safety Protocol)',
    badge: 'Safety Protocol Trigger',
    description: 'Mother of atrocity survivor experiencing acute suicidal despair. Mid-call statement triggers immediate red safety banner, trauma script & 1-click Tele-MANAS (14416) warm handoff.',
    language: 'hi',
    callerAlias: 'Sunita Devi',
    district: 'Hathras',
    state: 'Uttar Pradesh',
    acousticProfile: {
      pitchHz: 235, // High tremor
      jitterPercent: 2.8,
      shimmerPercent: 4.6,
      speechRateWpm: 68,
      pauseRatio: 0.55,
      energyDb: 35,
      affectType: 'hesitant',
      contributionPct: 15,
    },
    transcriptSteps: [
      { timestampSec: 0, speaker: '14566 Agent', text: '14566 राष्ट्रीय अत्याचार निवारण हेल्पलाइन, मैं आपकी बात सुन रहा हूँ।' },
      { timestampSec: 6, speaker: 'Caller', text: 'भैया, तीन महीने हो गए थाने के चक्कर काटते हुए... कोई सुनवाई नहीं हो रही।' },
      { timestampSec: 14, speaker: '14566 Agent', text: 'सुनीता जी, आपकी शिकायत संख्या हमारे पास है, मैं देख रहा हूँ।' },
      { timestampSec: 20, speaker: 'Caller', text: 'गांव वाले ताना मारते हैं... मेरी बेटी को न्याय नहीं मिला। अब मुझसे बर्दाश्त नहीं होता।' },
      { timestampSec: 28, speaker: 'Caller', text: 'मैंने सब कोशिश कर ली... अब लगता है मेरा होना ही बोझ है। सब खत्म करने का मन कर रहा है... जीने का कोई मतलब नहीं।', isKeyMoment: true },
      { timestampSec: 35, speaker: 'Caller', text: 'अगर मैं मर जाऊंगी तभी शायद किसी को फर्क पड़ेगा...', isKeyMoment: true }
    ],
    microScreening: {
      phq2_depressedMood: 3,
      phq2_anhedonia: 3,
      gad2_anxiety: 3,
      gad2_uncontrollableWorry: 3,
      pcptsd_nightmaresOrHyperarousal: true,
      cssrs_suicidalThoughts: true,
      cssrs_suicidalPlan: true,
    },
    confidence: 0.94,
    restrictedRouting: false,
    perpetratorInfluence: 'local_panchayat',
  },
  {
    id: 'scenario-gujarati-boycott',
    title: '3. Rural Social Boycott & Water Denial (Gujarati)',
    badge: 'PoA Sec 3(1)(za) Violation',
    description: 'Full Gujarati narrative demonstrating Indic language handling: severe community boycott, drinking water denied, shop rations blocked, duress to withdraw legal case.',
    language: 'gu',
    callerAlias: 'Valjibhai Parmar',
    district: 'Surendranagar',
    state: 'Gujarat',
    acousticProfile: {
      pitchHz: 185,
      jitterPercent: 1.4,
      shimmerPercent: 2.1,
      speechRateWpm: 125,
      pauseRatio: 0.22,
      energyDb: 58,
      affectType: 'agitated',
      contributionPct: 12,
    },
    transcriptSteps: [
      { timestampSec: 0, speaker: '14566 Agent', text: 'નમસ્તે, રાષ્ટ્રીય હેલ્પલાઇન 14566. હું તમારી શી મદદ કરી શકું?' },
      { timestampSec: 6, speaker: 'Caller', text: 'સાહેબ, અમારા ગામમાં પંચાયતે અમારો સમાજ બહિષ્કાર જાહેર કરી દીધો છે.' },
      { timestampSec: 14, speaker: '14566 Agent', text: 'વાલજીભાઈ, તમે ચિંતા ન કરો. વિગતવાર જણાવો શું સ્થિતિ છે?' },
      { timestampSec: 20, speaker: 'Caller', text: 'અમારા વાસનું પાણી બંધ કરી દીધું છે. ગામની દુકાનેથી કરિયાણું આપવાની ના પાડી દીધી છે.', isKeyMoment: true },
      { timestampSec: 28, speaker: 'Caller', text: 'તેઓ કહે છે કે પોલીસ કેસ પાછો ખેંચો નહિતર ગામમાંથી કાઢી મૂકીશું... સમાધાન કરી લો.', isKeyMoment: true },
      { timestampSec: 36, speaker: '14566 Agent', text: 'આ એટ્રોસિટી એક્ટ અંતર્ગત ગંભીર ગુનો છે. શું તમને શારીરિક સુરક્ષાનો ભય છે?' },
      { timestampSec: 42, speaker: 'Caller', text: 'હા સાહેબ, સાંજે ખેતરે જતા રોકે છે અને ધમકી આપે છે.', isKeyMoment: true }
    ],
    confidence: 0.89,
    restrictedRouting: false,
    perpetratorInfluence: 'local_panchayat',
  },
  {
    id: 'scenario-fail-up-noisy',
    title: '4. Telephony Noise & Unsupported Dialect (Fail-Up)',
    badge: 'Fail-Up Safety Gate',
    description: 'Severely degraded 8kHz audio line from remote border district. Confidence drops to 0.36. System engages Fail-Up principle: elevates to High human review, presents manual clinical checklist.',
    language: 'hi',
    callerAlias: 'Unknown Caller (Line Degraded)',
    district: 'Dungarpur',
    state: 'Rajasthan',
    acousticProfile: {
      pitchHz: 160,
      jitterPercent: 3.9,
      shimmerPercent: 5.8,
      speechRateWpm: 140,
      pauseRatio: 0.45,
      energyDb: 22,
      affectType: 'hesitant',
      contributionPct: 5,
    },
    transcriptSteps: [
      { timestampSec: 0, speaker: '14566 Agent', text: 'नमस्ते, 14566 हेल्पलाइन। क्या आप सुन पा रहे हैं?' },
      { timestampSec: 6, speaker: 'Caller', text: '[स्थैतिक शोर... अस्पष्ट बोली] ...साहब... हम... वागड़ी... मार... पुलिस... [ध्वनि कट रही है]' },
      { timestampSec: 15, speaker: '14566 Agent', text: 'आपकी आवाज कट रही है, क्या कोई खतरा है?' },
      { timestampSec: 22, speaker: 'Caller', text: '...बचाओ... घर... [8kHz telephony drop / low confidence signal]', isKeyMoment: true }
    ],
    confidence: 0.36,
    asrFailed: true,
    unsupportedLanguage: true,
    restrictedRouting: false,
    perpetratorInfluence: 'low',
  },
  {
    id: 'scenario-routine-inquiry',
    title: '5. Legal Aid & Relief Status Inquiry (Low/Moderate)',
    badge: 'Standard Workflow',
    description: 'Calm caller inquiring about the statutory SC/ST PoA compensation installment disbursement under Rule 12(4). SVI remains Low (22). Automated legal aid tracking.',
    language: 'en',
    callerAlias: 'Dr. Anand M.',
    district: 'Nagpur',
    state: 'Maharashtra',
    acousticProfile: {
      pitchHz: 140,
      jitterPercent: 0.3,
      shimmerPercent: 0.8,
      speechRateWpm: 115,
      pauseRatio: 0.18,
      energyDb: 62,
      affectType: 'baseline',
      contributionPct: 8,
    },
    transcriptSteps: [
      { timestampSec: 0, speaker: '14566 Agent', text: 'National Helpline 14566, how may I assist you today?' },
      { timestampSec: 6, speaker: 'Caller', text: 'Hello, I am calling on behalf of my family regarding the second installment of statutory PoA relief after charge-sheet filing.' },
      { timestampSec: 15, speaker: '14566 Agent', text: 'Certainly, do you have your FIR and district nodal application reference number?' },
      { timestampSec: 22, speaker: 'Caller', text: 'Yes, it is MH-NGP-2026-8812. We just need to check the DLSA verification status.' },
      { timestampSec: 30, speaker: '14566 Agent', text: 'Thank you, I can verify the DLSA nodal officer portal update right now.' }
    ],
    confidence: 0.98,
    restrictedRouting: false,
    perpetratorInfluence: 'low',
  }
];

export const INITIAL_COUNSELLOR_QUEUE: HelplineCase[] = [
  {
    id: 'CASE-2026-0819',
    callerAlias: 'Rameshwar K.',
    district: 'Morbi',
    state: 'Gujarat',
    language: 'hi',
    channel: '14566_telephony',
    timestamp: '2026-09-24 07:15',
    lastContactDate: 'Today, 07:15 AM',
    restrictedRouting: true,
    perpetratorInfluence: 'locally_powerful_official',
    sviHistory: [
      { date: '2026-09-10', score: 38, category: 'Moderate', contactType: 'Portal Complaint' },
      { date: '2026-09-18', score: 54, category: 'High', contactType: 'IVRS Follow-up' },
      { date: '2026-09-24', score: 86, category: 'Critical', contactType: '14566 Live Call' }
    ],
    currentSVI: calculateSVI({
      transcript: 'सर, उन्होंने धमकी दी है कि आज रात हथियार लेकर आएंगे और घर में आग लगा देंगे... हमें मार डालेंगे। घर के बाहर खड़े हैं।',
      acoustic: {
        pitchHz: 130,
        jitterPercent: 0.52,
        shimmerPercent: 1.1,
        speechRateWpm: 92,
        pauseRatio: 0.38,
        energyDb: 42,
        affectType: 'flat_numbed',
        contributionPct: 15,
      },
      confidence: 0.91,
    }),
    consent: {
      analysisConsent: true,
      agencySharingConsent: true,
      verbalConsentLogged: true,
      emergencyExceptionActive: true,
    },
    reviewStatus: 'pending',
    transcript: 'सर, वे कह रहे हैं कि हमने जो एफआईआर की थी, वो तुरंत वापस लो... फैसला करो। धमकी दी है कि आज रात हथियार लेकर आएंगे और घर में आग लगा देंगे... हमें मार डालेंगे। घर के बाहर खड़े हैं...',
    slaMinutesRemaining: 8,
    slaBreached: false,
  },
  {
    id: 'CASE-2026-0824',
    callerAlias: 'Sunita Devi',
    district: 'Hathras',
    state: 'Uttar Pradesh',
    language: 'hi',
    channel: '14566_telephony',
    timestamp: '2026-09-24 07:32',
    lastContactDate: 'Today, 07:32 AM',
    restrictedRouting: false,
    perpetratorInfluence: 'local_panchayat',
    sviHistory: [
      { date: '2026-09-02', score: 48, category: 'Moderate', contactType: 'IVRS' },
      { date: '2026-09-15', score: 68, category: 'High', contactType: 'Counsellor Callback' },
      { date: '2026-09-24', score: 92, category: 'Critical', contactType: '14566 Live Call' }
    ],
    currentSVI: calculateSVI({
      transcript: 'मैंने सब कोशिश कर ली... अब लगता है मेरा होना ही बोझ है। सब खत्म करने का मन कर रहा है... जीने का कोई मतलब नहीं। आत्महत्या...',
      acoustic: {
        pitchHz: 235,
        jitterPercent: 2.8,
        shimmerPercent: 4.6,
        speechRateWpm: 68,
        pauseRatio: 0.55,
        energyDb: 35,
        affectType: 'hesitant',
        contributionPct: 15,
      },
      screening: {
        phq2_depressedMood: 3,
        phq2_anhedonia: 3,
        gad2_anxiety: 3,
        cssrs_suicidalThoughts: true,
        cssrs_suicidalPlan: true,
      },
      confidence: 0.94,
    }),
    consent: {
      analysisConsent: true,
      agencySharingConsent: false,
      verbalConsentLogged: true,
      emergencyExceptionActive: true,
    },
    reviewStatus: 'pending',
    transcript: 'गांव वाले ताना मारते हैं... मेरी बेटी को न्याय नहीं मिला। अब लगता है मेरा होना ही बोझ है। सब खत्म करने का मन कर रहा है...',
    slaMinutesRemaining: 4,
    slaBreached: false,
  },
  {
    id: 'CASE-2026-0790',
    callerAlias: 'Valjibhai Parmar',
    district: 'Surendranagar',
    state: 'Gujarat',
    language: 'gu',
    channel: 'portal',
    timestamp: '2026-09-24 06:40',
    lastContactDate: 'Today, 06:40 AM',
    restrictedRouting: false,
    perpetratorInfluence: 'local_panchayat',
    sviHistory: [
      { date: '2026-09-20', score: 62, category: 'High', contactType: 'Web Portal' },
      { date: '2026-09-24', score: 79, category: 'Critical', contactType: '14566 Telephony' }
    ],
    currentSVI: calculateSVI({
      transcript: 'અમારા વાસનું પાણી બંધ કરી દીધું છે. ગામની દુકાનેથી કરિયાણું આપવાની ના પાડી દીધી છે. સમાજ બહિષ્કાર. કેસ પાછો ખેંચો.',
      acoustic: {
        pitchHz: 185,
        jitterPercent: 1.4,
        shimmerPercent: 2.1,
        speechRateWpm: 125,
        pauseRatio: 0.22,
        energyDb: 58,
        affectType: 'agitated',
        contributionPct: 12,
      },
      confidence: 0.89,
    }),
    consent: {
      analysisConsent: true,
      agencySharingConsent: true,
      verbalConsentLogged: true,
      emergencyExceptionActive: false,
    },
    reviewStatus: 'pending',
    transcript: 'ગામના મુખીના માણસોએ અમારું પાણી બંધ કરી દીધું છે. કરિયાણું આપવાની ના પાડી છે. કેસ પાછો ખેંચો નહિતર બહિષ્કાર ચાલુ રહેશે.',
    slaMinutesRemaining: 110,
    slaBreached: false,
  },
  {
    id: 'CASE-2026-0755',
    callerAlias: 'Kamla Bai (Elderly, 74y)',
    district: 'Betul',
    state: 'Madhya Pradesh',
    language: 'hi',
    channel: 'ivrs',
    timestamp: '2026-09-23 18:20',
    lastContactDate: 'Yesterday, 06:20 PM',
    restrictedRouting: false,
    perpetratorInfluence: 'local_panchayat',
    sviHistory: [
      { date: '2026-09-23', score: 64, category: 'High', contactType: 'IVRS' }
    ],
    currentSVI: calculateSVI({
      transcript: 'अकेली बूढ़ी औरत हूँ... जमीन जोतने नहीं दे रहे... जातिसूचक गाली दी।',
      acoustic: {
        pitchHz: 170,
        jitterPercent: 1.1,
        shimmerPercent: 1.6,
        speechRateWpm: 88,
        pauseRatio: 0.32,
        energyDb: 40,
        affectType: 'hesitant',
        contributionPct: 10,
      },
      isMinorOrElderly: true,
      confidence: 0.86,
    }),
    consent: {
      analysisConsent: true,
      agencySharingConsent: true,
      verbalConsentLogged: true,
      emergencyExceptionActive: false,
    },
    reviewStatus: 'accepted',
    reviewDetails: {
      reviewedBy: 'Dr. Meenakshi S. (Senior Clinical Counsellor)',
      reviewTimestamp: '2026-09-23 19:10',
      originalCategory: 'High',
      assignedCategory: 'High',
      decisionReason: 'Confirmed elderly intimidation and agricultural land deprivation. DLSA legal aid and Tehsildar protection request initiated.',
    },
    transcript: 'अकेली बूढ़ी औरत हूँ... जमीन जोतने नहीं दे रहे... जातिसूचक गाली दी।',
    slaMinutesRemaining: 210,
    slaBreached: false,
  },
  {
    id: 'CASE-2026-0710',
    callerAlias: 'Unknown Caller (Static)',
    district: 'Dungarpur',
    state: 'Rajasthan',
    language: 'hi',
    channel: '14566_telephony',
    timestamp: '2026-09-24 05:50',
    lastContactDate: 'Today, 05:50 AM',
    restrictedRouting: false,
    perpetratorInfluence: 'low',
    sviHistory: [
      { date: '2026-09-24', score: 58, category: 'High', contactType: '14566 Telephony' }
    ],
    currentSVI: calculateSVI({
      transcript: 'साहब... वागड़ी... पुलिस... बचाओ...',
      acoustic: {
        pitchHz: 160,
        jitterPercent: 3.9,
        shimmerPercent: 5.8,
        speechRateWpm: 140,
        pauseRatio: 0.45,
        energyDb: 22,
        affectType: 'hesitant',
        contributionPct: 5,
      },
      confidence: 0.36,
      asrFailed: true,
      unsupportedLanguage: true,
    }),
    consent: {
      analysisConsent: true,
      agencySharingConsent: false,
      verbalConsentLogged: true,
      emergencyExceptionActive: true,
    },
    reviewStatus: 'pending',
    transcript: '[स्थैतिक शोर / 8kHz Line Loss] ...साहब... हम... वागड़ी... मार... पुलिस... बचाओ...',
    slaMinutesRemaining: 85,
    slaBreached: false,
  },
  {
    id: 'CASE-2026-0680',
    callerAlias: 'Dr. Anand M.',
    district: 'Nagpur',
    state: 'Maharashtra',
    language: 'en',
    channel: 'portal',
    timestamp: '2026-09-24 04:10',
    lastContactDate: 'Today, 04:10 AM',
    restrictedRouting: false,
    perpetratorInfluence: 'low',
    sviHistory: [
      { date: '2026-09-24', score: 22, category: 'Low', contactType: 'Portal Query' }
    ],
    currentSVI: calculateSVI({
      transcript: 'Inquiring regarding second installment of statutory PoA relief after charge-sheet filing.',
      acoustic: {
        pitchHz: 140,
        jitterPercent: 0.3,
        shimmerPercent: 0.8,
        speechRateWpm: 115,
        pauseRatio: 0.18,
        energyDb: 62,
        affectType: 'baseline',
        contributionPct: 8,
      },
      confidence: 0.98,
    }),
    consent: {
      analysisConsent: true,
      agencySharingConsent: true,
      verbalConsentLogged: false,
      emergencyExceptionActive: false,
    },
    reviewStatus: 'accepted',
    reviewDetails: {
      reviewedBy: 'Rajiv V. (Nodal Case Officer)',
      reviewTimestamp: '2026-09-24 04:45',
      originalCategory: 'Low',
      assignedCategory: 'Low',
      decisionReason: 'Verified procedural relief query. Disbursal ledger status shared with beneficiary.',
    },
    transcript: 'Inquiring regarding second installment of statutory PoA relief after charge-sheet filing.',
    slaMinutesRemaining: 4120,
    slaBreached: false,
  }
];
