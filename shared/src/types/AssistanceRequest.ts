export interface AssistanceRequest {
  id: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  status: string;
  timestamp: string;
}
