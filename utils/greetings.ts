import { SupportedLanguage, TimeOfDay } from '../types';

type GreetingDictionary = Record<SupportedLanguage, Record<TimeOfDay, string>>;

const GREETINGS: GreetingDictionary = {
  en: {
    morning: "Hello, Good Morning!",
    afternoon: "Hello, Good Afternoon!",
    evening: "Hello, Good Evening!",
    night: "Hello, Good Night!",
  },
  fr: {
    morning: "Bonjour, Good Morning!",
    afternoon: "Bonjour, Good Afternoon!",
    evening: "Bonsoir, Good Evening!",
    night: "Bonne nuit, Good Night!",
  },
  es: {
    morning: "¡Hola, Buenos días!",
    afternoon: "¡Hola, Buenas tardes!",
    evening: "¡Hola, Buenas noches!",
    night: "¡Hola, Buenas noches!",
  },
  ar: {
    morning: "مرحبا، صباح الخير!",
    afternoon: "مرحبا، طاب مساؤك!",
    evening: "مرحبا، مساء الخير!",
    night: "مرحبا، تصبح على خير!",
  },
  si: {
    morning: "ආයුබෝවන්, සුභ උදෑසනක්!",
    afternoon: "ආයුබෝවන්, සුභ දහවලක්!",
    evening: "ආයුබෝවන්, සුභ සැන්දෑවක්!",
    night: "ආයුබෝවන්, සුභ රාත්‍රියක්!",
  },
};

export const getLocalizedGreeting = (lang: SupportedLanguage, timeOfDay: TimeOfDay): string => {
  return GREETINGS[lang]?.[timeOfDay] || GREETINGS['en'][timeOfDay];
};

const COUNTRY_GREETINGS: Record<string, string> = {
  LK: "Ayubowan!",
  AE: "Marhaba!",
  SA: "Marhaba!",
  FR: "Bonjour!",
  ES: "¡Hola!",
  MX: "¡Hola!",
  DE: "Hallo!",
  IT: "Ciao!",
  JP: "Konnichiwa!",
  CN: "Nǐ hǎo!",
  IN: "Namaste!",
  BR: "Olá!",
  RU: "Zdravstvuyte!",
  ZA: "Sawubona!",
  KE: "Jambo!",
  NG: "Bawo ni!",
  US: "Hello!",
  GB: "Hello!",
  AU: "G'day!",
  CA: "Hello!",
  NZ: "Kia ora!",
  IE: "Dia dhuit!",
  NL: "Hallo!",
  SE: "Hej!",
  NO: "Hei!",
  DK: "Hej!",
  FI: "Hei!",
  PT: "Olá!",
  GR: "Yassas!",
  TR: "Merhaba!",
  KR: "Annyeonghaseyo!",
  VN: "Xin chào!",
  TH: "Sawasdee!",
  ID: "Halo!",
  MY: "Halo!",
  PH: "Mabuhay!",
  EG: "Marhaba!",
  MA: "Marhaba!",
  PK: "Assalam-o-alaikum!",
  BD: "Nomoshkar!",
  IL: "Shalom!",
  PL: "Cześć!",
  UA: "Pryvit!",
  CZ: "Ahoj!",
  HU: "Szia!",
  RO: "Salut!",
  CH: "Grüezi!",
  AT: "Servus!",
  BE: "Bonjour!",
  AR: "¡Hola!",
  CO: "¡Hola!",
  CL: "¡Hola!",
  PE: "¡Hola!",
  VE: "¡Hola!",
  SG: "Hello!",
};

export const getCountryGreeting = (countryCode: string | undefined, lang: SupportedLanguage, timeOfDay: TimeOfDay): string => {
  if (countryCode && COUNTRY_GREETINGS[countryCode]) {
    return COUNTRY_GREETINGS[countryCode];
  }
  return getLocalizedGreeting(lang, timeOfDay);
};

const COUNTRY_AFFECTIONATE_NAMES: Record<string, string> = {
  LK: "the Pearl of the Indian Ocean",
  AE: "the heart of the Emirates",
  SA: "the Kingdom",
  FR: "the heart of Europe",
  ES: "sunny Spain",
  MX: "vibrant Mexico",
  DE: "the heart of Germany",
  IT: "beautiful Italy",
  JP: "the Land of the Rising Sun",
  CN: "the Middle Kingdom",
  IN: "incredible India",
  BR: "vibrant Brazil",
  ZA: "the Rainbow Nation",
  US: "the States",
  GB: "the UK",
  AU: "the Land Down Under",
  CA: "the Great White North",
  NZ: "Aotearoa",
  IE: "the Emerald Isle",
  NL: "the Netherlands",
  CH: "the Swiss Alps",
  EG: "the Land of the Pharaohs",
  TH: "the Land of Smiles",
  PH: "the Pearl of the Orient Seas",
};

export const getCountryAffectionateName = (countryCode: string | undefined, countryName: string): string => {
  if (countryCode && COUNTRY_AFFECTIONATE_NAMES[countryCode]) {
    return COUNTRY_AFFECTIONATE_NAMES[countryCode];
  }
  return countryName;
};
