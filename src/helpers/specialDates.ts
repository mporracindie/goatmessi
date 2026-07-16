import { Locale } from '../i18n/translations';

type SpecialDateMessage = {
  en: string;
  es: string;
};

// Special dates in Messi's career
// Format: "DD-MM-YYYY" - full date with year
export const SPECIAL_DATES: Record<string, SpecialDateMessage> = {
  '24-06-1987': {
    en: 'Birth of Lionel Messi in Rosario, Argentina',
    es: 'Nacimiento de Lionel Messi en Rosario, Argentina',
  },
  '16-10-2004': {
    en: 'Professional debut with FC Barcelona against Espanyol',
    es: 'Debut profesional con el FC Barcelona ante el Espanyol',
  },
  '01-05-2005': {
    en: 'First official goal with Barcelona against Albacete',
    es: 'Primer gol oficial con el Barcelona ante el Albacete',
  },
  '17-08-2005': {
    en: 'Full debut with the Argentine national team against Hungary',
    es: 'Debut oficial con la selección argentina ante Hungría',
  },
  '02-11-2005': {
    en: 'Scores his first Champions League goal against Panathinaikos',
    es: 'Marca su primer gol en Champions League ante el Panathinaikos',
  },
  '01-03-2006': {
    en: 'Scores his first goal for Argentina against Croatia',
    es: 'Marca su primer gol con Argentina ante Croacia',
  },
  '10-03-2007': {
    en: 'Scores his first career hat-trick in El Clásico against Real Madrid',
    es: 'Marca su primer hat-trick en El Clásico ante el Real Madrid',
  },
  '29-09-2009': {
    en: 'Scores his 100th career goal against Dynamo Kyiv in the Champions League',
    es: 'Marca su gol número 100 ante el Dinamo de Kiev en Champions League',
  },
  '17-08-2011': {
    en: 'Scores his 200th career goal against Real Madrid in the Spanish Super Cup',
    es: 'Marca su gol número 200 ante el Real Madrid en la Supercopa de España',
  },
  '07-03-2012': {
    en: 'Scores five goals in a single Champions League match against Bayer Leverkusen',
    es: 'Marca cinco goles en un mismo partido de Champions League ante el Bayer Leverkusen',
  },
  '27-10-2012': {
    en: 'Scores his 300th career goal against Rayo Vallecano',
    es: 'Marca su gol número 300 ante el Rayo Vallecano',
  },
  '27-09-2014': {
    en: 'Scores his 400th career goal against Granada',
    es: 'Marca su gol número 400 ante el Granada',
  },
  '17-04-2016': {
    en: 'Scores his 500th career goal against Valencia',
    es: 'Marca su gol número 500 ante el Valencia',
  },
  '04-03-2018': {
    en: 'Scores his 600th career goal against Atlético Madrid',
    es: 'Marca su gol número 600 ante el Atlético de Madrid',
  },
  '30-06-2020': {
    en: 'Scores his 700th career goal against Atlético Madrid',
    es: 'Marca su gol número 700 ante el Atlético de Madrid',
  },
  '16-05-2021': {
    en: 'Scores his last goal for FC Barcelona against Celta de Vigo',
    es: 'Marca su último gol con el FC Barcelona ante el Celta de Vigo',
  },
  '30-06-2021': {
    en: 'End of contract with FC Barcelona',
    es: 'Fin de contrato con el FC Barcelona',
  },
  '10-07-2021': {
    en: 'Wins Copa América 2021 with Argentina at the Maracaná',
    es: 'Gana la Copa América 2021 con Argentina en el Maracaná',
  },
  '11-07-2021': {
    en: 'Named best player (MVP) of Copa América 2021',
    es: 'Elegido mejor jugador (MVP) de la Copa América 2021',
  },
  '05-08-2021': {
    en: 'Announces official departure from FC Barcelona',
    es: 'Anuncia su salida oficial del FC Barcelona',
  },
  '10-08-2021': {
    en: 'Signs two-year contract with Paris Saint-Germain',
    es: 'Firma contrato por dos años con el Paris Saint-Germain',
  },
  '29-08-2021': {
    en: 'Debut with PSG against Stade de Reims',
    es: 'Debut con el PSG ante el Stade de Reims',
  },
  '09-09-2021': {
    en: "Scores his 750th career goal against Bolivia and becomes South America's all-time top international scorer",
    es: 'Marca su gol número 750 ante Bolivia y se convierte en el máximo goleador internacional de Sudamérica',
  },
  '28-09-2021': {
    en: 'Scores his first PSG goal in Champions League against Manchester City',
    es: 'Marca su primer gol con el PSG en Champions League ante el Manchester City',
  },
  '20-11-2021': {
    en: 'Scores his first Ligue 1 goal against Nantes',
    es: 'Marca su primer gol en Ligue 1 ante el Nantes',
  },
  '01-06-2022': {
    en: 'Wins Finalissima against Italy at Wembley',
    es: 'Gana la Finalissima ante Italia en Wembley',
  },
  '05-06-2022': {
    en: 'Scores five goals for Argentina against Estonia',
    es: 'Marca cinco goles con Argentina ante Estonia',
  },
  '18-12-2022': {
    en: 'Wins 2022 Qatar World Cup with Argentina and receives the Golden Ball award',
    es: 'Gana el Mundial de Qatar 2022 con Argentina y recibe el Balón de Oro',
  },
  '24-03-2023': {
    en: 'Scores his 800th career goal against Panama',
    es: 'Marca su gol número 800 ante Panamá',
  },
  '21-07-2023': {
    en: 'Debuts with Inter Miami against Cruz Azul in Leagues Cup, scoring a free-kick goal',
    es: 'Debuta con Inter Miami ante Cruz Azul en la Leagues Cup, con un gol de tiro libre',
  },
  '19-08-2023': {
    en: 'Wins Leagues Cup 2023 with Inter Miami against Nashville SC',
    es: 'Gana la Leagues Cup 2023 con Inter Miami ante Nashville SC',
  },
  '14-07-2024': {
    en: 'Wins Copa América 2024 with Argentina against Colombia',
    es: 'Gana la Copa América 2024 con Argentina ante Colombia',
  },
  '09-11-2024': {
    en: 'Scores his 850th career goal against Atlanta United',
    es: 'Marca su gol número 850 ante el Atlanta United',
  },
  '18-03-2026': {
    en: 'Scores his 900th career goal against Nashville SC',
    es: 'Marca su gol número 900 ante el Nashville SC',
  },
};

const pickMessage = (message: SpecialDateMessage | undefined, locale: Locale = 'en') =>
  message ? message[locale] || message.en : null;

// Function to get special date message for a day/month/year combination
// If year is provided, checks for exact match. If not, returns the first match for day+month
export const getSpecialDateMessage = (
  day?: number,
  month?: number,
  year?: number,
  locale: Locale = 'en',
): string | null => {
  if (!day || !month) return null;

  const dayStr = String(day).padStart(2, '0');
  const monthStr = String(month).padStart(2, '0');

  if (year) {
    const key = `${dayStr}-${monthStr}-${year}`;
    return pickMessage(SPECIAL_DATES[key], locale);
  }

  const matchingKey = Object.keys(SPECIAL_DATES).find((key) => {
    const [d, m] = key.split('-');
    return d === dayStr && m === monthStr;
  });

  return matchingKey ? pickMessage(SPECIAL_DATES[matchingKey], locale) : null;
};

// Function to check if a specific date (DD-MM-YYYY) is special
export const isSpecialDate = (date: string, locale: Locale = 'en'): string | null => {
  return pickMessage(SPECIAL_DATES[date], locale);
};
