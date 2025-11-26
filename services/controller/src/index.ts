import express from "express";
import kafka from "../src/kafka/config";
import locations from "./api/locations";
import enemySpotted from "./api/enemySpotted";

const producer = kafka.producer();

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.send({ health: "up" });
});

app.post("/api/locations", (req, res) => {
  locations(req, res, producer);
});

app.post("/enemySpotted", (req, res) => {
  enemySpotted(req, res, producer);
});

async function startServer() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await producer.connect();

    app.listen(3001, () => {
      console.log(`server listening on port 3001`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await producer.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await producer.disconnect();
  process.exit(0);
});

startServer();
