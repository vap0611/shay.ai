import { LanguageCode } from '../types';

export interface LexiconEntry {
  term: string;
  category: 'threat' | 'boycott' | 'caste_abuse' | 'self_harm' | 'retaliation' | 'vulnerability';
  severity: 'moderate' | 'severe' | 'critical';
  languages: LanguageCode[];
  englishMeaning: string;
}

export const ATROCITY_LEXICON: LexiconEntry[] = [
  // Imminent Danger / Severe Threats
  {
    term: 'मार डालेंगे',
    category: 'threat',
    severity: 'critical',
    languages: ['hi'],
    englishMeaning: 'Will kill us / death threat'
  },
  {
    term: 'जान से मार',
    category: 'threat',
    severity: 'critical',
    languages: ['hi'],
    englishMeaning: 'Threat to kill'
  },
  {
    term: 'ઘર બાળી નાખીશું',
    category: 'threat',
    severity: 'critical',
    languages: ['gu'],
    englishMeaning: 'Will burn the house down'
  },
  {
    term: 'જીવથી મારી નાખશે',
    category: 'threat',
    severity: 'critical',
    languages: ['gu'],
    englishMeaning: 'Will kill / death threat'
  },
  {
    term: 'they will kill us tonight',
    category: 'threat',
    severity: 'critical',
    languages: ['en'],
    englishMeaning: 'Imminent nocturnal death threat'
  },
  {
    term: 'घर के बाहर खड़े हैं',
    category: 'threat',
    severity: 'critical',
    languages: ['hi'],
    englishMeaning: 'Perpetrators are standing outside the house right now'
  },
  {
    term: 'બહાર ઊભા છે',
    category: 'threat',
    severity: 'critical',
    languages: ['gu'],
    englishMeaning: 'Standing outside right now'
  },
  {
    term: 'हथियार लेकर',
    category: 'threat',
    severity: 'critical',
    languages: ['hi'],
    englishMeaning: 'Carrying deadly weapons'
  },
  {
    term: 'હથિયાર સાથે',
    category: 'threat',
    severity: 'critical',
    languages: ['gu'],
    englishMeaning: 'Armed with weapons'
  },
  {
    term: 'आग लगा देंगे',
    category: 'threat',
    severity: 'critical',
    languages: ['hi'],
    englishMeaning: 'Will set fire / arson threat'
  },

  // Retaliation & Compromise Pressure
  {
    term: 'केस वापस लो',
    category: 'retaliation',
    severity: 'severe',
    languages: ['hi'],
    englishMeaning: 'Withdraw the FIR/case immediately'
  },
  {
    term: 'પાછો ખેંચો',
    category: 'retaliation',
    severity: 'severe',
    languages: ['gu'],
    englishMeaning: 'Withdraw complaint under duress'
  },
  {
    term: 'फैसला करो',
    category: 'retaliation',
    severity: 'severe',
    languages: ['hi'],
    englishMeaning: 'Forced compromise / extra-legal settlement'
  },
  {
    term: 'સમાધાન કરી લો',
    category: 'retaliation',
    severity: 'severe',
    languages: ['gu'],
    englishMeaning: 'Coerced settlement out of court'
  },
  {
    term: 'झूठा केस',
    category: 'retaliation',
    severity: 'severe',
    languages: ['hi'],
    englishMeaning: 'Threat of fabricated counter-case'
  },
  {
    term: 'ખોટો કેસ',
    category: 'retaliation',
    severity: 'severe',
    languages: ['gu'],
    englishMeaning: 'Threat of false counter-case'
  },
  {
    term: 'withdraw complaint',
    category: 'retaliation',
    severity: 'severe',
    languages: ['en'],
    englishMeaning: 'Coerced withdrawal of legal case'
  },

  // Social Boycott & Deprivation
  {
    term: 'हुक्का-पानी बंद',
    category: 'boycott',
    severity: 'severe',
    languages: ['hi'],
    englishMeaning: 'Traditional total social boycott'
  },
  {
    term: 'પાણી બંધ',
    category: 'boycott',
    severity: 'severe',
    languages: ['gu'],
    englishMeaning: 'Denial of drinking water access'
  },
  {
    term: 'कुएं से पानी',
    category: 'boycott',
    severity: 'severe',
    languages: ['hi'],
    englishMeaning: 'Prohibited from public drinking well'
  },
  {
    term: 'સમાજ બહિષ્કાર',
    category: 'boycott',
    severity: 'severe',
    languages: ['gu'],
    englishMeaning: 'Village social boycott'
  },
  {
    term: 'सामाजिक बहिष्कार',
    category: 'boycott',
    severity: 'severe',
    languages: ['hi'],
    englishMeaning: 'Social boycott decreed by community'
  },
  {
    term: 'दुकान से राशन',
    category: 'boycott',
    severity: 'severe',
    languages: ['hi'],
    englishMeaning: 'Denial of rations/groceries from village shop'
  },
  {
    term: 'કરિયાણું આપવાની ના',
    category: 'boycott',
    severity: 'severe',
    languages: ['gu'],
    englishMeaning: 'Prohibited from purchasing food/rations'
  },
  {
    term: 'cremation ground',
    category: 'boycott',
    severity: 'severe',
    languages: ['en'],
    englishMeaning: 'Denial of cremation ground access'
  },

  // Self-Harm & Severe Hopelessness
  {
    term: 'जीने का कोई मतलब नहीं',
    category: 'self_harm',
    severity: 'critical',
    languages: ['hi'],
    englishMeaning: 'No reason left to live / suicidal despair'
  },
  {
    term: 'જીવવાનો કોઈ અર્થ નથી',
    category: 'self_harm',
    severity: 'critical',
    languages: ['gu'],
    englishMeaning: 'Life has no meaning / suicidal ideation'
  },
  {
    term: 'सब खत्म करने का',
    category: 'self_harm',
    severity: 'critical',
    languages: ['hi'],
    englishMeaning: 'Desire to end everything'
  },
  {
    term: 'હું મરી જઈશ',
    category: 'self_harm',
    severity: 'critical',
    languages: ['gu'],
    englishMeaning: 'I will die / suicidal statement'
  },
  {
    term: 'मर जाना चाहता',
    category: 'self_harm',
    severity: 'critical',
    languages: ['hi'],
    englishMeaning: 'Wanting to die'
  },
  {
    term: 'better off without me',
    category: 'self_harm',
    severity: 'critical',
    languages: ['en'],
    englishMeaning: 'Passive suicidal ideation'
  },
  {
    term: 'आत्महत्या',
    category: 'self_harm',
    severity: 'critical',
    languages: ['hi', 'gu'],
    englishMeaning: 'Suicide reference'
  },
  {
    term: 'suicide',
    category: 'self_harm',
    severity: 'critical',
    languages: ['en'],
    englishMeaning: 'Suicide intent'
  },

  // Humiliation & Caste-Based Abuse
  {
    term: 'जातिसूचक गाली',
    category: 'caste_abuse',
    severity: 'moderate',
    languages: ['hi'],
    englishMeaning: 'Derogatory casteist slurs under PoA Act'
  },
  {
    term: 'જ્ઞાતિવાચક અપમાન',
    category: 'caste_abuse',
    severity: 'moderate',
    languages: ['gu'],
    englishMeaning: 'Caste-based verbal humiliation'
  },
  {
    term: 'कपड़े फाड़ दिए',
    category: 'caste_abuse',
    severity: 'severe',
    languages: ['hi'],
    englishMeaning: 'Physical stripping / public humiliation'
  },
  {
    term: 'માથા પર મૂકીને ફેરવ્યા',
    category: 'caste_abuse',
    severity: 'severe',
    languages: ['gu'],
    englishMeaning: 'Public parading / degradation'
  }
];
