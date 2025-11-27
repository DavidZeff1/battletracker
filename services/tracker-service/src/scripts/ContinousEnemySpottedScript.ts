import Tracker from "../types/Tracker";

export default async function ContinousEnemyspottedScript(tracker1: Tracker) {
  while (true) {
    await Promise.all([
      tracker1.PingEnemySpotted("soldier", tracker1.location),
    ]);
  }
}
