export interface CropTask {
  month: string;
  tasks: {
    type: 'sowing' | 'fertilizing' | 'irrigation' | 'pestControl' | 'harvesting';
    description: string;
  }[];
}

export interface CropCalendar {
  crop: string;
  region: string;
  season: string;
  tasks: CropTask[];
}

export type CropType = 'rice' | 'wheat' | 'cotton' | 'sugarcane' | 'maize' | 'tomato';
export type Region = 'telangana' | 'andhra' | 'karnataka' | 'maharashtra';
export type Season = 'kharif' | 'rabi' | 'summer';
