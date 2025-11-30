export interface Unit {
  id: string;
  type: string;
  location: { lat: number; lng: number };
  status: string;
}
