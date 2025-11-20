const locationSequence = [[], [], [,], [,], [,], [,], [,], [,]];

let MAP_CENTER_CORDS: number[] = [31.536641, 34.55533];
let BASE_LAT: number = MAP_CENTER_CORDS[0];
let BASE_LNG: number = MAP_CENTER_CORDS[1];

class Tracker {
  id: string;
  type: string;
  status: string;
  constructor(id: string, type: string, status: string) {
    this.id = id;
    this.type = type;
    this.status = status;
  }

  async pingLocation() {
    for (let i = 0; i < 3; i++) {
      console.log([(BASE_LAT -= 0.001), (BASE_LNG += 0.001)]);
      await delay(1000);
    }
  }
}

async function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

const trakcer1 = new Tracker("1", "soldier", "operational");

trakcer1.pingLocation();
