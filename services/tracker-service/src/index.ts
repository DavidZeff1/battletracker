import express from "express";
import Tracker from "./types/Tracker";
import delay from "./utilities/delay";
import ContinousUnitMovementScript from "./scripts/ContinousUnitMovementScript";
import ContinousEnemyspottedScript from "./scripts/ContinousEnemySpottedScript";

const app = express();
const CONTROLLER_URL = process.env.CONTROLLER_URL || "http://localhost:3001";

async function startTrackerService() {
  console.log("🎯 Tracker Service Starting...");
  console.log(`📡 Controller URL: ${CONTROLLER_URL}`);

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

  await Promise.all([ContinousEnemyspottedScript(tracker1)]);
}

startTrackerService().catch(console.error);
