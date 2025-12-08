export interface Founder {
  name: string;
  role: string;
  bio: string;
  education: string[];
  work_history: string[];
}

export interface Project {
  id: string;
  batch_id: string;
  name: string;
  one_liner: string;
  description: string;
  image_url: string;
  founders: Founder[];
  tags: string[];
}

export interface BatchStats {
  project_count: number;
  acceptance_rate: string;
  phd_ratio?: string;
  researcher_founder_ratio?: string;
  overseas_experience?: string;
  [key: string]: any;
}

export interface Batch {
  id: string;
  name: string;
  year: number;
  season: 'Spring' | 'Fall';
  date: string;
  location: string;
  stats: BatchStats;
  highlights: string[];
  description: string;
  disabled?: boolean;
}
