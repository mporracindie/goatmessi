// Special dates in Messi's career
// Format: "DD-MM-YYYY" - full date with year
export const SPECIAL_DATES: Record<string, string> = {
  "24-06-1987": "Birth of Lionel Messi in Rosario, Argentina",
  "16-10-2004": "Professional debut with FC Barcelona against Espanyol",
  "01-05-2005": "First official goal with Barcelona against Albacete",
  "17-08-2005": "Full debut with the Argentine national team against Hungary",
  "30-06-2021": "End of contract with FC Barcelona",
  "10-07-2021": "Wins Copa América 2021 with Argentina at the Maracaná",
  "11-07-2021": "Named best player (MVP) of Copa América 2021",
  "05-08-2021": "Announces official departure from FC Barcelona",
  "10-08-2021": "Signs two-year contract with Paris Saint-Germain",
  "29-08-2021": "Debut with PSG against Stade de Reims",
  "28-09-2021": "Scores his first PSG goal in Champions League against Manchester City",
  "20-11-2021": "Scores his first Ligue 1 goal against Nantes",
  "01-06-2022": "Wins Finalissima against Italy at Wembley",
  "18-12-2022": "Wins 2022 Qatar World Cup with Argentina and receives the Golden Ball award",
  "21-07-2023": "Debuts with Inter Miami against Cruz Azul in Leagues Cup, scoring a free-kick goal",
  "19-08-2023": "Wins Leagues Cup 2023 with Inter Miami against Nashville SC",
};

// Function to get special date message for a day/month/year combination
// If year is provided, checks for exact match. If not, returns the first match for day+month
export const getSpecialDateMessage = (day?: number, month?: number, year?: number): string | null => {
  if (!day || !month) return null;
  
  const dayStr = String(day).padStart(2, '0');
  const monthStr = String(month).padStart(2, '0');
  
  // If year is provided, check for exact match
  if (year) {
    const key = `${dayStr}-${monthStr}-${year}`;
    return SPECIAL_DATES[key] || null;
  }
  
  // If no year, find any special date that matches day and month
  const matchingKey = Object.keys(SPECIAL_DATES).find(key => {
    const [d, m] = key.split('-');
    return d === dayStr && m === monthStr;
  });
  
  return matchingKey ? SPECIAL_DATES[matchingKey] : null;
};

// Function to check if a specific date (DD-MM-YYYY) is special
export const isSpecialDate = (date: string): string | null => {
  // date format is DD-MM-YYYY
  return SPECIAL_DATES[date] || null;
};

