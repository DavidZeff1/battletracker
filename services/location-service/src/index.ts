import express from "express";
import cors from "cors";
import kafka from "./kafka/config";

const app = express();
app.use(cors()); // Allow frontend to access this API

const consumer = kafka.consumer({ groupId: "location-consumers" });

// Store latest location for each unit (keyed by unit ID)
const latestLocations = new Map<string, any>();

async function startConsumer() {
  try {
    console.log("🔌 Connecting Kafka consumer...");
    await consumer.connect();
    console.log("✅ Kafka consumer connected");

    await consumer.subscribe({ topic: "locations", fromBeginning: false }); // Only new messages

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (value) {
          const data = JSON.parse(value);
          console.log("📍 Received location update:", data.id, data.location);

          // Store/update latest location for this unit
          latestLocations.set(data.id, data);
        }
      },
    });
  } catch (error) {
    console.error("❌ Consumer error:", error);
    process.exit(1);
  }
}

app.get("/health", (req, res) => {
  res.json({ status: "up" });
});

// Get all latest locations (ensure unique by id)
app.get("/api/locations", (req, res) => {
  const locations = Array.from(latestLocations.values());
  // Remove any duplicates just in case
  const uniqueLocations = locations.filter(
    (loc, index, self) => index === self.findIndex((t) => t.id === loc.id)
  );
  res.json(uniqueLocations);
});

// Get specific unit location
app.get("/api/locations/:id", (req, res) => {
  const location = latestLocations.get(req.params.id);
  if (location) {
    res.json(location);
  } else {
    res.status(404).json({ error: "Unit not found" });
  }
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
