// services/tracker-service/src/index.ts
import express from "express";
import delay from "./utilities/delay";
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
    // Move west with 15% chance of spotting enemies
    await Promise.all(
      trackers.map((tracker) =>
        tracker.pingLocationWithEnemySpotting("w", 30, 0.15)
      )
    );

    await delay(5000);

    // Move east with 15% chance of spotting enemies
    await Promise.all(
      trackers.map((tracker) =>
        tracker.pingLocationWithEnemySpotting("e", 30, 0.15)
      )
    );
  }
}

startTrackerService().catch(console.error);
