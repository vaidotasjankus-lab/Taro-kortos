import md5 from 'js-md5';

export interface TarotCard {
  id: string;
  name: string;
  originalName: string;
  type: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  value: number;
  keywords: string[];
  element?: string;
  symbol: string; // Emoji symbols reflecting the theme
}

export const MAJOR_ARCANA: TarotCard[] = [
  { id: 'major-0', name: 'Kvailys', originalName: 'The Fool', type: 'major', value: 0, keywords: ['Nauja pradžia', 'Spontaniškumas', 'Tikėjimas', 'Laisvė'], element: 'Oras', symbol: '🎒' },
  { id: 'major-1', name: 'Magas', originalName: 'The Magician', type: 'major', value: 1, keywords: [' Manifestacija', 'Valia', 'Asmeninė jėga', 'Kūrybiškumas'], element: 'Oras', symbol: '🪄' },
  { id: 'major-2', name: 'Vyriausioji Žynė', originalName: 'The High Priestess', type: 'major', value: 2, keywords: ['Intuicija', 'Paslaptis', 'Pasąmonė', 'Vidinė išmintis'], element: 'Vanduo', symbol: '🌙' },
  { id: 'major-3', name: 'Imperatorė', originalName: 'The Empress', type: 'major', value: 3, keywords: ['Gausa', 'Gamtos galia', 'Kūryba', 'Motinystė'], element: 'Žemė', symbol: '👑' },
  { id: 'major-4', name: 'Imperatorius', originalName: 'The Emperor', type: 'major', value: 4, keywords: ['Struktūra', 'Autoritetas', 'Kontrolė', 'Apsauga'], element: 'Ugnis', symbol: '🏛️' },
  { id: 'major-5', name: 'Vyriausiasis Kunigas', originalName: 'The Hierophant', type: 'major', value: 5, keywords: ['Tradicijos', 'Mokymas', 'Dvasingumas', 'Sąjunga'], element: 'Žemė', symbol: '⛪' },
  { id: 'major-6', name: 'Mylimieji', originalName: 'The Lovers', type: 'major', value: 6, keywords: ['Pasirinkimas', 'Harmonija', 'Meilė', 'Suderinamumas'], element: 'Oras', symbol: '❤️' },
  { id: 'major-7', name: 'Vežimas', originalName: 'The Chariot', type: 'major', value: 7, keywords: ['Valia', 'Pergalė', 'Ryžtas', 'Savikontrolė'], element: 'Vanduo', symbol: '🛒' },
  { id: 'major-8', name: 'Jėga', originalName: 'Strength', type: 'major', value: 8, keywords: ['Vidinė jėga', 'Drąsa', 'Atjauta', 'Kantrybė'], element: 'Ugnis', symbol: '🦁' },
  { id: 'major-9', name: 'Atsiskyrėlis', originalName: 'The Hermit', type: 'major', value: 9, keywords: ['Savianalizė', 'Vienatvė', 'Vidinė šviesa', 'Išmintis'], element: 'Žemė', symbol: '🏮' },
  { id: 'major-10', name: 'Likimo Ratas', originalName: 'Wheel of Fortune', type: 'major', value: 10, keywords: ['Pokyčiai', 'Sėkmė', 'Likimas', 'Karminiai įvykiai'], element: 'Ugnis', symbol: '🎡' },
  { id: 'major-11', name: 'Teisingumas', originalName: 'Justice', type: 'major', value: 11, keywords: ['Tiesa', 'Sąžiningumas', 'Atsakomybė', 'Teisėtumas'], element: 'Oras', symbol: '⚖️' },
  { id: 'major-12', name: 'Pakabintasis', originalName: 'The Hanged Man', type: 'major', value: 12, keywords: ['Sustojimas', 'Naujas požiūris', 'Pasiaukojimas', 'Paleidimas'], element: 'Vanduo', symbol: '🪵' },
  { id: 'major-13', name: 'Mirtis', originalName: 'Death', type: 'major', value: 13, keywords: ['Transformacija', 'Pabaiga', 'Gilus pokytis', 'Atgimimas'], element: 'Vanduo', symbol: '💀' },
  { id: 'major-14', name: 'Saikingumas', originalName: 'Temperance', type: 'major', value: 14, keywords: ['Balansas', 'Harmonija', 'Alchemija', 'Kantrybė'], element: 'Ugnis', symbol: '🏺' },
  { id: 'major-15', name: 'Velnias', originalName: 'The Devil', type: 'major', value: 15, keywords: ['Šešėlis', 'Gundymas', 'Priklausomybė', 'Materializmas'], element: 'Žemė', symbol: '😈' },
  { id: 'major-16', name: 'Bokštas', originalName: 'The Tower', type: 'major', value: 16, keywords: ['Staigi griūtis', 'Prabudimas', 'Apsivalymas', 'Netikėtumas'], element: 'Ugnis', symbol: '⚡' },
  { id: 'major-17', name: 'Žvaigždė', originalName: 'The Star', type: 'major', value: 17, keywords: ['Viltis', 'Įkvėpimas', 'Gijimas', 'Ramybė'], element: 'Oras', symbol: '⭐' },
  { id: 'major-18', name: 'Mėnulis', originalName: 'The Moon', type: 'major', value: 18, keywords: ['Sapnai', 'Iliuzijos', 'Baimė', 'Pasąmonės tiesa'], element: 'Vanduo', symbol: '🌌' },
  { id: 'major-19', name: 'Saulė', originalName: 'The Sun', type: 'major', value: 19, keywords: ['Sėkmė', 'Vitališkumas', 'Šviesa', 'Džiaugsmas'], element: 'Ugnis', symbol: '☀️' },
  { id: 'major-20', name: 'Teismas', originalName: 'Judgement', type: 'major', value: 20, keywords: ['Pašaukimas', 'Atgimimas', 'Verdikto tiesa', 'Atleidimas'], element: 'Ugnis', symbol: '🔔' },
  { id: 'major-21', name: 'Pasaulis', originalName: 'The World', type: 'major', value: 21, keywords: ['Išsipildymas', 'Sėkmė', 'Integracija', 'Kelionės pabaiga'], element: 'Žemė', symbol: '🌍' }
];

export const MINOR_ARCANA_SUITS = [
  {
    suit: 'wands' as const,
    nameLt: 'Lazdos',
    nameEn: 'Wands',
    element: 'Ugnis',
    symbol: '🪵',
    keywords: ['Aistra', 'Veiksmas', 'Kūrybiškumas', 'Valia', 'Ryžtas']
  },
  {
    suit: 'cups' as const,
    nameLt: 'Taurės',
    nameEn: 'Cups',
    element: 'Vanduo',
    symbol: '🍷',
    keywords: ['Emocijos', 'Meilė', 'Santykių gyliai', 'Intuicija', 'Sapnai']
  },
  {
    suit: 'swords' as const,
    nameLt: 'Kardai',
    nameEn: 'Swords',
    element: 'Oras',
    symbol: '⚔️',
    keywords: ['Intelektas', 'Sprendimai', 'Konfliktai', 'Tiesa', 'Mintys']
  },
  {
    suit: 'pentacles' as const,
    nameLt: 'Pentakliai',
    nameEn: 'Pentacles',
    element: 'Žemė',
    symbol: '🪙',
    keywords: ['Finansai', 'Darbas', 'Atsakomybė', 'Stabilumas', 'Kūnas']
  }
];

const rankMapLt: Record<number, string> = {
  1: 'Tūzas',
  2: 'Dvejetas',
  3: 'Trejetas',
  4: 'Ketvertas',
  5: 'Penketas',
  6: 'Šešetas',
  7: 'Septynetas',
  8: 'Aštuonetas',
  9: 'Devynetas',
  10: 'Dešimtukas',
  11: 'Pažas',
  12: 'Riteris',
  13: 'Karalienė',
  14: 'Karalius'
};

const rankMapEn: Record<number, string> = {
  1: 'Ace',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Page',
  12: 'Knight',
  13: 'Queen',
  14: 'King'
};

const generateMinorArcana = (): TarotCard[] => {
  const cards: TarotCard[] = [];
  MINOR_ARCANA_SUITS.forEach(suitInfo => {
    for (let val = 1; val <= 14; val++) {
      const isCourt = val >= 11;
      const rankLt = rankMapLt[val];
      const rankEn = rankMapEn[val];
      
      const cardName = `${rankLt} ${suitInfo.nameLt}`;
      const origName = `${rankEn} of ${suitInfo.nameEn}`;
      
      let customKeywords: string[] = [];
      if (val === 1) customKeywords = ['Nauja galimybė', 'Pradinis impulsas', 'Potencialas'];
      else if (val === 10) customKeywords = ['Sėkmė', 'Išsipildymas', 'Kolektyvinis džiaugsmas'];
      else if (isCourt) customKeywords = ['Asmenybė', 'Pranešėjas', 'Energijos įkūnijimas'];
      else customKeywords = [`Pakopa ${val}`, suitInfo.keywords[val % suitInfo.keywords.length]];

      cards.push({
        id: `minor-${suitInfo.suit}-${val}`,
        name: cardName,
        originalName: origName,
        type: 'minor',
        suit: suitInfo.suit,
        value: val,
        keywords: customKeywords,
        element: suitInfo.element,
        symbol: suitInfo.symbol
      });
    }
  });
  return cards;
};

export const TAROT_DECK: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...generateMinorArcana()
];

export function getRiderWaiteImageUrl(card: TarotCard): string {
  let displayName = "";
  if (card.type === 'major') {
    displayName = card.originalName;
  } else {
    const ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
    const rankName = ranks[card.value - 1];
    const suitName = card.suit ? card.suit.charAt(0).toUpperCase() + card.suit.slice(1) : "";
    
    if (card.suit === 'swords' && card.value === 1) {
      displayName = 'One of Swords';
    } else if (card.suit === 'pentacles' && card.value === 1) {
      displayName = 'One of Pentacles';
    } else {
      displayName = `${rankName} of ${suitName}`;
    }
  }
  
  const rawFilename = `${displayName} (Rider-Waite Smith tarot deck).png`;
  const filename = rawFilename.replace(/ /g, '_');
  
  const hash = (md5 as any)(filename);
  const c1 = hash[0];
  const c2 = hash.substring(0, 2);
  return `https://upload.wikimedia.org/wikipedia/commons/${c1}/${c2}/${filename}`;
}
