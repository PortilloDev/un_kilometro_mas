export interface TrainingStats {
  distance: string;
  duration: string;
  pace: string;
  heartRate: string;
  calories: string;
  elevation: string;
  date: string;
  time: string;
  temperature: string;
  location: string;
}

export interface ChallengeState {
  currentDay: number;
  totalDays: number;
  dailyGoal: string;
}

export interface PostContent {
  titleLine1: string;
  titleLine2: string;
  description: string;
  closingPhrase: string;
}

export interface ElementTransform {
  x: number;
  y: number;
  opacity: number;
}

export interface PostState {
  challenge: ChallengeState;
  stats: TrainingStats;
  content: PostContent;
  heroImage: string | null;
  mapImage: string | null;
  showCalories: boolean;
  showElevation: boolean;
  showTemperature: boolean;
  transforms: Partial<Record<LayerId, ElementTransform>>;
}

export type LayerId =
  | 'hero-image'
  | 'logo'
  | 'reto-title'
  | 'stats-card'
  | 'day-title'
  | 'day-text'
  | 'closing-phrase'
  | 'landscape';

export interface Layer {
  id: LayerId;
  name: string;
  visible: boolean;
  locked: boolean;
}

export const DEFAULT_LAYERS: Layer[] = [
  { id: 'hero-image', name: 'Fotografía principal', visible: true, locked: false },
  { id: 'landscape', name: 'Paisaje (fondo)', visible: true, locked: false },
  { id: 'stats-card', name: 'Tarjeta de estadísticas', visible: true, locked: false },
  { id: 'reto-title', name: 'Título del reto', visible: true, locked: false },
  { id: 'day-title', name: 'DÍA X/100', visible: true, locked: false },
  { id: 'day-text', name: 'Texto del día', visible: true, locked: false },
  { id: 'closing-phrase', name: 'Frase de cierre', visible: true, locked: false },
  { id: 'logo', name: 'Logotipo', visible: true, locked: false },
];

export const DEFAULT_STATE: PostState = {
  challenge: {
    currentDay: 1,
    totalDays: 100,
    dailyGoal: '5 KM DIARIOS',
  },
  stats: {
    distance: '5.19',
    duration: '31:07',
    pace: '6:00',
    heartRate: '123',
    calories: '343',
    elevation: '45',
    date: '13 Oct',
    time: '05:15',
    temperature: '14',
    location: 'Fuenlabrada',
  },
  content: {
    titleLine1: '5:15 de la mañana.',
    titleLine2: 'Empieza la aventura.',
    description:
      'El reto es sencillo: correr al menos 5 kilómetros cada día durante 100 días. No sé hasta dónde me llevará, pero quiero descubrirlo.',
    closingPhrase: 'UN KILÓMETRO MÁS.',
  },
  heroImage: null,
  mapImage: null,
  showCalories: true,
  showElevation: false,
  showTemperature: true,
  transforms: {},
};
