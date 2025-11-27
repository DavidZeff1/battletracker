import Tracker from "../types/Tracker";

export default async function ContinousUnitMovementScript(
  tracker1: Tracker,
  tracker2: Tracker,
  tracker3: Tracker
) {
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
