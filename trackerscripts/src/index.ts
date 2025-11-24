import express from "express";

const app = express();

class Tracker {
  id: string;
  type: string;
  status: string;
  location: { lat: number; lng: number };
  constructor(id: string, type: string, status: string) {
    this.id = id;
    this.type = type;
    this.status = status;
    this.location = { lat: 31.536641, lng: 34.55533 };
  }

  async pingLocation() {
    for (let i = 0; i < 3; i++) {
      await fetch("http://localhost:3001/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: this.id,
          type: this.type,
          location: this.location,
          status: this.status,
          timestamp: new Date().toISOString(),
        }),
      });
      console.log(
        JSON.stringify({
          id: this.id,
          type: this.type,
          location: this.location,
          status: this.status,
          timestamp: new Date().toISOString(),
        })
      );
      this.location.lat -= 0.001;
      this.location.lng += 0.001;
      await delay(1000);
    }
  }
}

async function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

const trakcer1 = new Tracker("Alpha-1", "soldier", "operational");

trakcer1.pingLocation();
