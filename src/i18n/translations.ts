export type Locale = 'en' | 'es';

export const translations = {
  en: {
    home: {
      kicker: "All of Messi's goals",
      headlineGoals: '{count} goals.',
      headlineGoat: 'One archive.',
      subtitle:
        "Every goal from Lionel Messi's career in one place — pick one at random, scroll the feed, or jump straight to a date or goal number.",
      statGoals: 'Goals',
      statSeasons: 'Seasons',
      statEra: 'Era',
      watchRandom: 'Watch a random goal',
      browseFeed: 'Browse the feed',
      finderTitle: 'Looking for a specific goal?',
      finderSubtitle:
        'Mix date, club, competition, opponent, or how it was scored — then jump to the clip.',
      byDate: 'By date',
      day: 'Day',
      month: 'Month',
      year: 'Year',
      byMatchDetails: 'By match details',
      team: 'Team',
      anyTeam: 'Any team',
      competition: 'Competition',
      opponent: 'Opponent',
      goalType: 'Goal type',
      anyType: 'Any type',
      scoredWith: 'Scored with',
      any: 'Any',
      searchGoals: 'Search goals',
      byGoalNumber: 'By goal number',
      goalNumberLabel: 'Goal number (1–{max})',
      goToGoal: 'Go to goal',
      invalidNumber: 'Please enter a valid number',
      numberOutOfRange: 'Please enter a number between 1 and {max}',
    },
    search: {
      kicker: 'Search results',
      happyBirthday: 'Happy Birthday Messi!',
      noGoalsFound: 'No goals found',
      searchAgain: 'Back to search',
      random: 'Watch a random goal',
      viewAll: 'Play all',
      goalLabel: 'goal found',
      goalsLabel: 'goals found',
      sortByNumber: 'By number',
      sortByDate: 'By date',
      sortBy: 'Sort by',
      day: 'day {value}',
      month: 'month {value}',
      year: 'year {value}',
      vs: 'vs {opponent}',
    },
    goal: {
      kicker: 'Goal archive',
      title: 'Goal #{number}',
      date: '{date}',
      searchAgain: 'Back to search',
      random: 'Watch a random goal',
    },
    feed: {
      goalTitle: 'Goal #{number}',
      progress: '{current} / {total}',
      autoAdvance: 'Auto advance',
      viewsPerGoal: 'Views',
      viewsPerGoalOne: '1',
      viewsPerGoalTwo: '2',
      fullscreen: 'Fullscreen',
      exitFullscreen: 'Exit fullscreen',
    },
    common: {
      language: 'Language',
      english: 'English',
      spanish: 'Español',
      builtBy: 'Built by',
      archiveBlurb:
        "Video archive of Lionel Messi's career goals (Barcelona, Argentina, PSG, Inter Miami).",
    },
    seo: {
      feedTitle: "Messi goals feed — watch every goal",
      feedDescription:
        "Scroll Lionel Messi's full goal archive in a vertical feed. Jump to any clip from the complete career collection.",
      searchTitle: 'Messi goal search results',
      searchDescription:
        'Filtered Lionel Messi goals from the video archive. Refine by date, club, competition, opponent, or finish.',
      randomTitle: 'Random Messi goal',
      randomDescription: 'Redirecting to a random Lionel Messi goal from the archive.',
      goalTitle: 'Goal #{number} · Messi · {team} vs {opponent}',
      goalDescription:
        'Watch Lionel Messi goal #{number} ({date}): {team} {result} {opponent}, {competition}, minute {minute}.',
    },
    goalMeta: {
      'Field goal': 'Field goal',
      'Free kick': 'Free kick',
      Penalty: 'Penalty',
      Rebound: 'Rebound',
      'Solo run': 'Solo run',
      Chest: 'Chest',
      Hand: 'Hand',
      Head: 'Head',
      Hip: 'Hip',
      'Left foot': 'Left foot',
      'Right foot': 'Right foot',
    },
  },
  es: {
    home: {
      kicker: 'Todos los goles de Messi',
      headlineGoals: '{count} goles.',
      headlineGoat: 'Un solo archivo.',
      subtitle:
        'Todos los goles de la carrera de Lionel Messi en un solo lugar — elegí uno al azar, recorré el feed o saltá directo a una fecha o número de gol.',
      statGoals: 'Goles',
      statSeasons: 'Temporadas',
      statEra: 'Era',
      watchRandom: 'Ver un gol al azar',
      browseFeed: 'Ver el feed',
      finderTitle: '¿Buscás un gol en particular?',
      finderSubtitle:
        'Combiná fecha, club, competencia, rival o cómo lo hizo — y saltá al video.',
      byDate: 'Por fecha',
      day: 'Día',
      month: 'Mes',
      year: 'Año',
      byMatchDetails: 'Por detalle del partido',
      team: 'Equipo',
      anyTeam: 'Cualquier equipo',
      competition: 'Competencia',
      opponent: 'Rival',
      goalType: 'Tipo de gol',
      anyType: 'Cualquier tipo',
      scoredWith: 'Anotado con',
      any: 'Cualquiera',
      searchGoals: 'Buscar goles',
      byGoalNumber: 'Por número de gol',
      goalNumberLabel: 'Número de gol (1–{max})',
      goToGoal: 'Ir al gol',
      invalidNumber: 'Ingresá un número válido',
      numberOutOfRange: 'Ingresá un número entre 1 y {max}',
    },
    search: {
      kicker: 'Resultados',
      happyBirthday: '¡Feliz cumpleaños, Messi!',
      noGoalsFound: 'No se encontraron goles',
      searchAgain: 'Volver a buscar',
      random: 'Ver un gol al azar',
      viewAll: 'Reproducir todos',
      goalLabel: 'gol encontrado',
      goalsLabel: 'goles encontrados',
      sortByNumber: 'Por número',
      sortByDate: 'Por fecha',
      sortBy: 'Ordenar por',
      day: 'día {value}',
      month: 'mes {value}',
      year: 'año {value}',
      vs: 'vs {opponent}',
    },
    goal: {
      kicker: 'Archivo',
      title: 'Gol #{number}',
      date: '{date}',
      searchAgain: 'Volver a buscar',
      random: 'Ver un gol al azar',
    },
    feed: {
      goalTitle: 'Gol #{number}',
      progress: '{current} / {total}',
      autoAdvance: 'Avance auto',
      viewsPerGoal: 'Veces',
      viewsPerGoalOne: '1',
      viewsPerGoalTwo: '2',
      fullscreen: 'Pantalla completa',
      exitFullscreen: 'Salir de pantalla completa',
    },
    common: {
      language: 'Idioma',
      english: 'English',
      spanish: 'Español',
      builtBy: 'Hecho por',
      archiveBlurb:
        'Archivo en video de los goles de Lionel Messi (Barcelona, Argentina, PSG, Inter Miami).',
    },
    seo: {
      feedTitle: 'Feed de goles de Messi — mirá todos',
      feedDescription:
        'Recorré el archivo completo de goles de Lionel Messi en un feed vertical. Saltá a cualquier clip de su carrera.',
      searchTitle: 'Resultados de goles de Messi',
      searchDescription:
        'Goles de Lionel Messi filtrados del archivo en video. Afiná por fecha, club, competencia, rival o definición.',
      randomTitle: 'Gol al azar de Messi',
      randomDescription: 'Redirigiendo a un gol al azar de Lionel Messi del archivo.',
      goalTitle: 'Gol #{number} · Messi · {team} vs {opponent}',
      goalDescription:
        'Video del gol #{number} de Lionel Messi ({date}): {team} {result} {opponent}, {competition}, minuto {minute}.',
    },
    goalMeta: {
      'Field goal': 'Jugada',
      'Free kick': 'Tiro libre',
      Penalty: 'Penal',
      Rebound: 'Rebote',
      'Solo run': 'Arrancada individual',
      Chest: 'Pecho',
      Hand: 'Mano',
      Head: 'Cabeza',
      Hip: 'Cadera',
      'Left foot': 'Pie izquierdo',
      'Right foot': 'Pie derecho',
    },
  },
} as const;

export type TranslationTree = (typeof translations)['en'];

type NestedKeyOf<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], Prefix extends '' ? K : `${Prefix}.${K}`>
        : Prefix extends ''
          ? K
          : `${Prefix}.${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationTree>;

export type TranslateVars = Record<string, string | number>;
