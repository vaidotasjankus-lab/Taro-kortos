import { TarotCard } from "./tarotData";

export type ThemeId = "mystic" | "cosmic" | "minimal";

export type CategoryId = "meile" | "darbas" | "finansai" | "sveikata" | "santykiai" | "situacija";

export type SpreadId = "viena_korta" | "trys_kortos" | "keltu_kryzius";

export interface SpreadPosition {
  id: number;
  name: string;
  description: string;
  // Relative grid position coordinates for visual map representation
  gridArea?: string; 
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionId: number;
  positionName: string;
  positionDesc: string;
}

export interface CardReadingItem {
  cardId: string;
  positionName: string;
  meaning: string;
}

export interface TarotReadingResponse {
  summary: string;
  cardsInterpretation: CardReadingItem[];
  guidance: string;
  outlook: string;
  error?: string;
}

export interface CategoryPreset {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
  presets: string[];
}

export const SPREADS: Record<SpreadId, { name: string; description: string; positions: SpreadPosition[] }> = {
  viena_korta: {
    name: "Viena Korta (Greitas atsakymas)",
    description: "Suteikia aiškų dienos patarimą arba tiesų atsakymą į konkretų klausimą.",
    positions: [
      { id: 1, name: "Likimo žinia", description: "Esminė jūsų situacijos pamoka, tiesus atsakymas arba svarbiausias patarimas." }
    ]
  },
  trys_kortos: {
    name: "Trys Kortos (Praeitis–Dabartis–Ateitis)",
    description: "Populiari klasikinė dėlionė, atskleidžianti įvykių seką ir tendencijas.",
    positions: [
      { id: 1, name: "Praeitis", description: "Įvykiai ir praeities sprendimai, padėję pamatus šiai situacijai." },
      { id: 2, name: "Dabartis", description: "Dabartinė būsena, einamosios aplinkybės ir tiesioginiai iššūkiai." },
      { id: 3, name: "Ateitis", description: "Labiausiai tikėtina įvykių kryptis arba rezultatas, jei niekas nesikeis." }
    ]
  },
  keltu_kryzius: {
    name: "Keltų Kryžius (10 kortų gilus tyrimas)",
    description: "Išsami tradicinė dėlionė, tirianti visas situacijos puses, baimes, aplinką ir perspektyvas.",
    positions: [
      { id: 1, name: "Dabartinė situacija", description: "Bendra energija ir įvykių šviesa jūsų klausime." },
      { id: 2, name: "Iššūkis / Kliūtis", description: "Kas trukdo arba su kuo tiesiogiai tenka susidurti (gali padėti arba trukdyti)." },
      { id: 3, name: "Sąmonė / Tikslai", description: "Tai, ką aiškiai suprantate, jūsų tikslai ir geriausi lūkesčiai." },
      { id: 4, name: "Pasąmonė / Pagrindas", description: "Giliai slypintys motyvai, praeities šaknys ir pasąmoningos jėgos." },
      { id: 5, name: "Praeities įtaka", description: "Praeities įvykiai, kurie vis dar daro tiesioginę įtaką klausimui." },
      { id: 6, name: "Artima ateitis", description: "Kitas žingsnis, kuris įvyks artimiausiu metu." },
      { id: 7, name: "Tavo galia / Požiūris", description: "Kaip pats matai save, kokia tavo vidinė pozicija ir turimos jėgos." },
      { id: 8, name: "Aplinka / Kiti žmonės", description: "Išorinės jėgos, draugai, šeima, įvykiai ir reakcijos jūsų atžvilgiu." },
      { id: 9, name: "Viltys ir baimės", description: "Jūsų vidiniai troškimai ir didžiausi nuogąstavimai šiuo klausimu." },
      { id: 10, name: "Galutinis rezultatas", description: "Ilgesnio laikotarpio atomazga ir visos kelionės išvada." }
    ]
  }
};

export const CATEGORIES: CategoryPreset[] = [
  {
    id: "meile",
    label: "Meilė",
    icon: "❤️",
    color: "from-pink-500 to-rose-600",
    presets: [
      "Kokie meilės santykiai manęs laukia artimiausiu metu?",
      "Ką jaučia mano partneris (-ė) mano atžvilgiu?",
      "Kaip galėčiau pagerinti mūsų tarpusavio ryšį?",
      "Ar aš šiemet sutiksiu savo tikrąją meilę?",
      "Kas trukdo mums susitaikyti po konflikto?"
    ]
  },
  {
    id: "darbas",
    label: "Darbas",
    icon: "💼",
    color: "from-amber-500 to-yellow-600",
    presets: [
      "Ar laukia teigiami profesiniai pokyčiai?",
      "Kaip elgtis su esamu darbdaviu / kolegomis?",
      "Kokia veiklos sritis man padėtų geriausiai realizuoti save?",
      "Ar saugu dabar keisti darbo vietą?",
      "Kokios karjeros galimybės atsivers per ateinančius 6 mėnesius?"
    ]
  },
  {
    id: "finansai",
    label: "Finansai",
    icon: "🪙",
    color: "from-emerald-500 to-teal-600",
    presets: [
      "Kokia mano finansinė perspektyva ateinančiais mėnesiais?",
      "Kaip pritaupyti arba padidinti savo pajamas?",
      "Ar dabar geras metas investuoti ar pirkti būstą?",
      "Kas stabdo mano finansinę gerovę?",
      "Kokių finansinių staigmenų galiu tikėtis netrukus?"
    ]
  },
  {
    id: "sveikata",
    label: "Sveikata",
    icon: "🌱",
    color: "from-cyan-500 to-green-600",
    presets: [
      "Kaip susigrąžinti vidinę energiją ir jėgas?",
      "Į ką turėčiau atkreipti dėmesį savo kūno sveikatoje?",
      "Kaip sumažinti jaučiamą stresą ir pagerinti miegą?",
      "Kokios dvasinės praktikos man padėtų emociškai išgyti?",
      "Kas yra mano dabartinio nuovargio tikroji priežastis?"
    ]
  },
  {
    id: "santykiai",
    label: "Santykiai",
    icon: "🤝",
    color: "from-purple-500 to-indigo-600",
    presets: [
      "Kokie iššūkiai kyla mano santykiuose su šeima?",
      "Ar mano draugystė su pasirinktu žmogumi yra nuoširdi?",
      "Kaip išspręsti pasikartojančius konfliktus?",
      "Kaip kiti žmonės vertina mano elgesį ir energetiką?",
      "Ko mane moko šiuo metu gyvenime esantys ryšiai?"
    ]
  },
  {
    id: "situacija",
    label: "Situacija",
    icon: "🔍",
    color: "from-blue-500 to-sky-600",
    presets: [
      "Kokia yra gilesnė esamos gyvenimo situacijos priežastis?",
      "Kokių paslėptų tiesų ar pusių aš nepastebiu?",
      "Kokį svarbiausią žingsnį turėčiau žengti dabar?",
      "Kaip išspręsti šiuo metu kylančius neaiškumus?",
      "Kas bus, jei pasirinksiu alternatyvų kelio variantą?"
    ]
  }
];
