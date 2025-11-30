// shared/src/types/Enemy.ts
export interface Enemy {
  id: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  spottedBy: string;
}
