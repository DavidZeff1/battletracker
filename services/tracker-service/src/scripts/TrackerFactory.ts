import Tracker from "../types/Tracker";
export default function (
  numOfSoldier: number,
  numOfTanks: number,
  numOfDrones: number,
  { BASE_LAT, BASE_LNG }: { BASE_LAT: number; BASE_LNG: number }
): Tracker[] {
  const trackers = [];
  let dronesXline = BASE_LNG - 0.004;
  let tanksXline = BASE_LNG;
  let soldiersXline = BASE_LNG + 0.004;

  let dronesYline = BASE_LAT + 0.004;
  let tanksYline = BASE_LAT + 0.0075;
  let soldiersYline = BASE_LAT + 0.007;

  while (numOfSoldier-- > 0) {
    trackers.push(
      new Tracker(
        `${numOfSoldier}-soldier`,
        "soldier",
        "operational",
        numOfSoldier % 3 == 2
          ? (soldiersYline -= 0.0015)
          : (soldiersYline -= 0.001),
        soldiersXline
      )
    );
  }

  while (numOfTanks-- > 0) {
    trackers.push(
      new Tracker(
        `${numOfTanks}-tank`,
        "tank",
        "operational",
        (tanksYline -= 0.003),
        tanksXline
      )
    );
  }
  while (numOfDrones-- > 0) {
    trackers.push(
      new Tracker(
        `${numOfDrones}-drone`,
        "drone",
        "operational",
        (dronesYline -= 0.002),
        dronesXline
      )
    );
  }
  return trackers;
}
