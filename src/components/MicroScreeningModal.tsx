import React, { useState } from 'react';
import { MicroScreeningAnswers } from '../types';
import { Stethoscope, CheckCircle2, ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';

interface MicroScreeningModalProps {
  initialData?: Partial<MicroScreeningAnswers>;
  onSave: (data: Partial<MicroScreeningAnswers>) => void;
  onClose?: () => void;
}

export const MicroScreeningModal: React.FC<MicroScreeningModalProps> = ({
  initialData = {},
  onSave,
  onClose,
}) => {
  const [lang, setLang] = useState<'en' | 'hi' | 'gu'>('hi');
  const [phq2Depressed, setPhq2Depressed] = useState<number>(initialData.phq2_depressedMood ?? 1);
  const [phq2Anhedonia, setPhq2Anhedonia] = useState<number>(initialData.phq2_anhedonia ?? 1);
  const [gad2Anxiety, setGad2Anxiety] = useState<number>(initialData.gad2_anxiety ?? 2);
  const [gad2Worry, setGad2Worry] = useState<number>(initialData.gad2_uncontrollableWorry ?? 1);
  const [pcptsdTrauma, setPcptsdTrauma] = useState<boolean>(initialData.pcptsd_nightmaresOrHyperarousal ?? true);
  const [cssrsThoughts, setCssrsThoughts] = useState<boolean>(initialData.cssrs_suicidalThoughts ?? false);
  const [cssrsPlan, setCssrsPlan] = useState<boolean>(initialData.cssrs_suicidalPlan ?? false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const translations = {
    hi: {
      title: 'क्लीनिकल माइक्रो-स्क्रीनिंग (वैधता एंकर)',
      subtitle: 'PHQ-2, GAD-2, PC-PTSD-5 और C-SSRS से अनुकूलित कोमल प्रश्न। एजेंट, चैटबॉट या IVR द्वारा पूछे जा सकते हैं।',
      q1: 'पिछले दो सप्ताह में, कितनी बार आपने उदास, निराश या बेबस महसूस किया?',
      q2: 'दैनिक कार्यों में रुचि या खुशी महसूस न होना?',
      q3: 'घबराहट, अत्यधिक चिंता या बेचैनी महसूस होना?',
      q4: 'चिंता को रोकने या नियंत्रित करने में असमर्थ महसूस करना?',
      q5: 'अत्याचार की घटना के बुरे सपने या डरावनी यादें बार-बार आना?',
      q6: 'क्या मन में ऐसा विचार आया कि काश आप जीवित न होते या खुद को नुकसान पहुंचा लें?',
      q7: 'क्या आपने ऐसा करने का कोई तरीका या योजना सोची है?',
      opts: ['बिल्कुल नहीं (0)', 'कुछ दिन (1)', 'आधे से अधिक दिन (2)', 'लगभग हर दिन (3)'],
      yes: 'हाँ',
      no: 'नहीं',
    },
    gu: {
      title: 'ક્લિનિકલ માઇક્રો-સ્ક્રીનિંગ (વેલિડિટી એન્કર)',
      subtitle: 'PHQ-2, GAD-2, PC-PTSD-5 અને C-SSRS પરથી અનુકૂલિત સૌમ્ય પ્રશ્નો.',
      q1: 'છેલ્લા બે અઠવાડિયામાં, કેટલી વાર તમે ઉદાસ અથવા નિરાશ અનુભવ્યું?',
      q2: 'રોજિંદા કામમાં રસ કે આનંદનો અભાવ?',
      q3: 'બેચેની, વધુ પડતી ચિંતા અથવા ગભરાટ?',
      q4: 'ચિંતા પર કાબૂ રાખવામાં મુશ્કેલી?',
      q5: 'બનેલી ઘટનાના ખરાબ સપના અથવા ડરામણા વિચારો વારંવાર આવે છે?',
      q6: 'શું જીવવાની ઇચ્છા ન થવાના કે જાતને નુકસાન પહોંચાડવાના વિચારો આવ્યા છે?',
      q7: 'શું તે અંગે કોઈ ચોક્કસ રીત કે યોજના વિચારી છે?',
      opts: ['બિલકુલ નહીં (0)', 'કેટલાક દિવસો (1)', 'અડધાથી વધુ દિવસો (2)', 'લગભગ રોજ (3)'],
      yes: 'હા',
      no: 'ના',
    },
    en: {
      title: 'Clinical Micro-Screening (Anchor Channel B)',
      subtitle: 'Gentle, trauma-informed items adapted from PHQ-2, GAD-2, PC-PTSD-5, and C-SSRS screener. Provides clinical grounding for calibrated fusion.',
      q1: 'Over the last 2 weeks, how often have you felt down, depressed, or hopeless?',
      q2: 'Little interest or pleasure in doing everyday things?',
      q3: 'Feeling nervous, anxious, or on edge?',
      q4: 'Not being able to stop or control worrying?',
      q5: 'Repeated nightmares, intrusive memories, or feeling on guard since the incident?',
      q6: 'In the past few days, have you wished you were dead or thought about hurting yourself?',
      q7: 'Have you had any thoughts of how you might do that?',
      opts: ['Not at all (0)', 'Several days (1)', 'More than half the days (2)', 'Nearly every day (3)'],
      yes: 'Yes',
      no: 'No',
    },
  };

  const t = translations[lang];

  const handleSave = () => {
    const data: Partial<MicroScreeningAnswers> = {
      phq2_depressedMood: phq2Depressed,
      phq2_anhedonia: phq2Anhedonia,
      gad2_anxiety: gad2Anxiety,
      gad2_uncontrollableWorry: gad2Worry,
      pcptsd_nightmaresOrHyperarousal: pcptsdTrauma,
      cssrs_suicidalThoughts: cssrsThoughts,
      cssrs_suicidalPlan: cssrsPlan,
    };
    onSave(data);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onClose) onClose();
    }, 1500);
  };

  const phqTotal = phq2Depressed + phq2Anhedonia;
  const gadTotal = gad2Anxiety + gad2Worry;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{t.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 text-xs rounded font-medium ${lang === 'hi' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLang('gu')}
              className={`px-2.5 py-1 text-xs rounded font-medium ${lang === 'gu' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              ગુજરાતી
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-xs rounded font-medium ${lang === 'en' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}
            >
              English
            </button>
          </div>
        </div>

        {/* Clinical Instrument Scores Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400">PHQ-2 Depression</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {phqTotal}/6 {phqTotal >= 3 && <span className="text-xs text-rose-400 font-semibold">(Positive)</span>}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400">GAD-2 Anxiety</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {gadTotal}/6 {gadTotal >= 3 && <span className="text-xs text-amber-400 font-semibold">(Positive)</span>}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400">PC-PTSD Trauma</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {pcptsdTrauma ? <span className="text-rose-400">Indicated</span> : <span className="text-slate-400">None</span>}
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <div className="text-[11px] text-slate-400">C-SSRS Suicidality</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {cssrsPlan ? <span className="text-rose-400 font-bold">Plan / Severe</span> : cssrsThoughts ? <span className="text-amber-400">Ideation</span> : <span className="text-slate-400">Negative</span>}
            </div>
          </div>
        </div>

        {/* Form Questions */}
        <div className="space-y-4">
          {/* PHQ-2 Item 1 */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">
              1. {t.q1}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {t.opts.map((opt, val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPhq2Depressed(val)}
                  className={`py-1.5 px-2 rounded text-xs transition-colors cursor-pointer border ${
                    phq2Depressed === val
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* PHQ-2 Item 2 */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">
              2. {t.q2}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {t.opts.map((opt, val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPhq2Anhedonia(val)}
                  className={`py-1.5 px-2 rounded text-xs transition-colors cursor-pointer border ${
                    phq2Anhedonia === val
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* GAD-2 Item 3 */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">
              3. {t.q3}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {t.opts.map((opt, val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setGad2Anxiety(val)}
                  className={`py-1.5 px-2 rounded text-xs transition-colors cursor-pointer border ${
                    gad2Anxiety === val
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* GAD-2 Item 4 */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">
              4. {t.q4}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {t.opts.map((opt, val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setGad2Worry(val)}
                  className={`py-1.5 px-2 rounded text-xs transition-colors cursor-pointer border ${
                    gad2Worry === val
                      ? 'bg-amber-600 text-white border-amber-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* PC-PTSD-5 Item 5 */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-200 block">
                5. {t.q5}
              </label>
              <span className="text-[11px] text-slate-400">Post-traumatic intrusive symptoms</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPcptsdTrauma(true)}
                className={`px-4 py-1.5 rounded text-xs font-medium border ${
                  pcptsdTrauma ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                {t.yes}
              </button>
              <button
                type="button"
                onClick={() => setPcptsdTrauma(false)}
                className={`px-4 py-1.5 rounded text-xs font-medium border ${
                  !pcptsdTrauma ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                {t.no}
              </button>
            </div>
          </div>

          {/* C-SSRS Item 6 & 7 */}
          <div className="bg-rose-950/20 border border-rose-800/40 p-4 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>C-SSRS Crisis Suicide Screener</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-200">6. {t.q6}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCssrsThoughts(true)}
                  className={`px-4 py-1.5 rounded text-xs font-medium border ${
                    cssrsThoughts ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  {t.yes}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCssrsThoughts(false);
                    setCssrsPlan(false);
                  }}
                  className={`px-4 py-1.5 rounded text-xs font-medium border ${
                    !cssrsThoughts ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  {t.no}
                </button>
              </div>
            </div>

            {cssrsThoughts && (
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-rose-800/30">
                <span className="text-xs text-rose-200 font-semibold">7. {t.q7}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCssrsPlan(true)}
                    className={`px-4 py-1.5 rounded text-xs font-medium border ${
                      cssrsPlan ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    {t.yes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCssrsPlan(false)}
                    className={`px-4 py-1.5 rounded text-xs font-medium border ${
                      !cssrsPlan ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    {t.no}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-800 mt-6">
          <span className="text-xs text-slate-400">
            Answers automatically calibrate ED &amp; SH sub-scores without replacing narrative cues.
          </span>
          <button
            onClick={handleSave}
            className="py-2 px-5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Scores Calibrated!</span>
              </>
            ) : (
              <span>Commit Micro-Screening to SVI Engine</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
