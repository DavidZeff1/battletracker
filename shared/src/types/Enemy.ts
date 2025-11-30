export interface Enemy {
  id: string; // We'll generate this
  type: string;
  location: { lat: number; lng: number };
  timestamp: string;
  spottedBy: string; // ID of the unit that spotted it
}
