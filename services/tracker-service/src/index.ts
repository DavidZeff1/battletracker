import express from "express";

const app = express();
const CONTROLLER_URL = process.env.CONTROLLER_URL || "http://localhost:3001";

class Tracker {
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
        const response = await fetch(`${CONTROLLER_URL}/api/locations`, {
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
      await delay(1000);
    }

    console.log(`🏁 ${this.id} finished pinging`);
  }

  async PingForAssistance() {
    try {
      const response = await fetch(`${CONTROLLER_URL}/assistance`, {
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
      const response = await fetch(`${CONTROLLER_URL}/enemySpotted`, {
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

async function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

async function startTrackerService() {
  console.log("🎯 Tracker Service Starting...");
  console.log(`📡 Controller URL: ${CONTROLLER_URL}`);

  // Wait for controller to be ready
  await delay(5000);

  const BASE_LAT = 31.536641;
  const BASE_LNG = 34.55533;

  // Create multiple trackers
  const tracker1 = new Tracker(
    "Alpha-1",
    "soldier",
    "operational",
    BASE_LAT,
    BASE_LNG
  );
  const tracker2 = new Tracker(
    "Bravo-2",
    "tank",
    "operational",
    BASE_LAT,
    BASE_LNG + 0.001
  );
  const tracker3 = new Tracker(
    "Eagle-1",
    "drone",
    "operational",
    BASE_LAT,
    BASE_LNG - 0.001
  );

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "tracker" });
  });

  app.listen(3003, () => {
    console.log("🚀 Tracker service listening on port 3003");
  });

  // Continuous patrol pattern
  while (true) {
    console.log("🔄 Starting patrol cycle - Northeast");
    await Promise.all([
      tracker1.pingLocation("ne", 10),
      tracker2.pingLocation("ne", 10),
      tracker3.pingLocation("ne", 10),
    ]);

    console.log("🔄 Starting patrol cycle - Southwest");
    await Promise.all([
      tracker1.pingLocation("sw", 10),
      tracker2.pingLocation("sw", 10),
      tracker3.pingLocation("sw", 10),
    ]);

    console.log("✅ Patrol cycle complete, restarting...");
  }
}

startTrackerService().catch(console.error);
