import express from "express";
import Tracker from "./types/Tracker";
import delay from "./utilities/delay";
import ContinousUnitMovementScript from "./scripts/ContinousUnitMovementScript";
import ContinousEnemyspottedScript from "./scripts/ContinousEnemySpottedScript";
import TrackerFactory from "./scripts/TrackerFactory";

const app = express();

async function startTrackerService() {
  await delay(5000);

  const BASE_LAT = 31.536641;
  const BASE_LNG = 34.55533;

  const trackers = TrackerFactory(9, 3, 2, { BASE_LAT, BASE_LNG });

  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "tracker" });
  });

  app.listen(3003, () => {
    console.log("🚀 Tracker service listening on port 3003");
  });
  while (true) {
    await Promise.all(trackers.map((tracker) => tracker.pingLocation("w", 30)));
    await delay(5000);
    await Promise.all(trackers.map((tracker) => tracker.pingLocation("e", 30)));
  }
}

startTrackerService().catch(console.error);
