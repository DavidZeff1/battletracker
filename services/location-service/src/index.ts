import express from "express";
import cors from "cors";
import kafka from "./kafka/config";

const app = express();
app.use(cors());

const consumer = kafka.consumer({ groupId: "location-consumers" });

const latestLocations = new Array<{}>();

async function startConsumer() {
  try {
    console.log("🔌 Connecting Kafka consumer...");
    await consumer.connect();
    console.log("✅ Kafka consumer connected");

    await consumer.subscribe({ topic: "locations", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (value) {
          const data = JSON.parse(value);
          console.log("📍 Received location update:", data.id, data.location);

          latestLocations.push(data);
        }
      },
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

app.get("/health", (req, res) => {
  res.json({ status: "up" });
});

// Get all latest locations (ensure unique by id)
app.get("/api/stream/locations", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // or 'http://localhost:3000'
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const interval = setInterval(() => {
    while (latestLocations.length > 0) {
      res.write(`data: ${JSON.stringify(latestLocations.pop())}\n\n`);
    }
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

async function startServer() {
  // Wait for Kafka to be ready
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Start consumer first
  await startConsumer();

  // Then start HTTP server
  app.listen(3002, () => {
    console.log("🚀 Location service listening on port 3002");
  });
}

process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down...");
  await consumer.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down...");
  await consumer.disconnect();
  process.exit(0);
});

startServer().catch(console.error);
