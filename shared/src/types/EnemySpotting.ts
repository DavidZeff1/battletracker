export interface EnemySpotting {
  from: {
    id: string;
    type: string;
    location: { lat: number; lng: number };
    status: string;
  };
  enemy: {
    type: string;
    location: { lat: number; lng: number };
  };
  timestamp: string;
}
