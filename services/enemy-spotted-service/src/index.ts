import express from "express";
import kafka from "./kafka/config";

const app = express();
const latestEnemySpotted = new Array<{}>();
const consumer = kafka.consumer({ groupId: "enemy-spotted-consumers" });

async function startConsumer() {
  try {
    console.log("🔌 Connecting Kafka consumer...");
    await consumer.connect();
    console.log("✅ Kafka consumer connected");

    await consumer.subscribe({ topic: "enemy-spotted", fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }) => {
        const value = message.value?.toString();
        if (value) {
          const data = JSON.parse(value);
          console.log(data);

          latestEnemySpotted.push(data);
        }
      },
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

// location-service index.ts
app.get("/api/stream/enemy-spotted", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

  const interval = setInterval(() => {
    while (latestEnemySpotted.length > 0) {
      const data = latestEnemySpotted.shift();
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }, 1000);

  req.on("close", () => {
    console.log("Client disconnected from enemy-spotted stream");
    clearInterval(interval);
  });
});

async function startServer() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await startConsumer();

  app.listen(3005, () => {
    console.log("🚀 Location service listening on port 3005");
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
