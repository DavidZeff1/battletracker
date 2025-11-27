import delay from "../utilities/delay";
const BASE_URL = process.env.CONTROLLER_URL || "http://localhost:3001";
export default class Tracker {
  id: string;
  type: string;
  status: string;
  location: { lat: number; lng: number };
  ONE_STEP: number;

  constructor(
    id: string,
    type: string,
    status: string,
    startLat: number,
    startLng: number
  ) {
    this.id = id;
    this.type = type;
    this.status = status;
    this.location = { lat: startLat, lng: startLng };
    this.ONE_STEP = 0.0001;
  }

  changeLocation(direction: string) {
    switch (direction) {
      case "n":
        this.location.lat += this.ONE_STEP;
        break;
      case "ne":
        this.location.lat += this.ONE_STEP;
        this.location.lng += this.ONE_STEP;
        break;
      case "e":
        this.location.lng += this.ONE_STEP;
        break;
      case "se":
        this.location.lat -= this.ONE_STEP;
        this.location.lng += this.ONE_STEP;
        break;
      case "s":
        this.location.lat -= this.ONE_STEP;
        break;
      case "sw":
        this.location.lat -= this.ONE_STEP;
        this.location.lng -= this.ONE_STEP;
        break;
      case "w":
        this.location.lng -= this.ONE_STEP;
        break;
      case "nw":
        this.location.lat += this.ONE_STEP;
        this.location.lng -= this.ONE_STEP;
        break;
    }
  }

  async pingLocation(direction: string = "n", iterations: number = 10) {
    console.log(`🚀 Starting pings for ${this.id}, moving ${direction}`);

    for (let i = 0; i < iterations; i++) {
      try {
        const response = await fetch(`${BASE_URL}/api/locations`, {
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

        if (response.ok) {
          console.log(
            `✅ ${this.id} ping ${i + 1}/${iterations}:`,
            this.location
          );
        } else {
          console.error(`❌ ${this.id} ping failed:`, response.statusText);
        }
      } catch (error) {
        console.error(`❌ ${this.id} ping error:`, error);
      }

      this.changeLocation(direction);
      await delay(4000);
    }

    console.log(`🏁 ${this.id} finished pinging`);
  }

  async PingForAssistance() {
    try {
      const response = await fetch(`${BASE_URL}/assistance`, {
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

      if (response.ok) {
        console.log();
      } else {
        console.error(`❌ ${this.id} ping failed:`, response.statusText);
      }
    } catch (error) {
      console.error(`❌ ${this.id} ping error:`, error);
    }
  }

  async PingEnemySpotted(
    enemyType: string,
    enemyLocation: { lat: number; lng: number }
  ) {
    try {
      const response = await fetch(`${BASE_URL}/enemySpotted`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: {
            id: this.id,
            type: this.type,
            location: this.location,
            status: this.status,
          },
          enemy: {
            type: enemyType,
            location: enemyLocation,
          },
          timestamp: new Date().toISOString(),
        }),
      });
      await delay(5000);
      if (response.ok) {
        console.log();
      } else {
        console.error(`❌ ${this.id} ping failed:`, response.statusText);
      }
    } catch (error) {
      console.error(`❌ ${this.id} ping error:`, error);
    }
  }
}
