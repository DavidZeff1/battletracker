import express from "express";
import kafka from "../src/kafka/config";

const producer = kafka.producer();

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.send({ health: "up" });
});

app.post("/api/locations", async (req, res) => {
  const location = req.body.location;
  console.log(location.lat, location.lng);

  try {
    await producer.send({
      topic: "locations",
      messages: [
        {
          key: `location-${Date.now()}`,
          value: JSON.stringify({
            location,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Location sent to Kafka",
      location,
    });
  } catch (error) {
    console.error("Failed to send to Kafka:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send location to Kafka",
    });
  }
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
