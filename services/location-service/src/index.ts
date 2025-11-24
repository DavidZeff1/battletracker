import express from "express";
import kafka from "./kafka/config";

const app = express();

const consumer = kafka.consumer({ groupId: "a" });

// store messages in memory (for testing)
let receivedLocations: any[] = [];

async function startConsumer() {
  await consumer.connect();
  console.log("Kafka consumer connected");

  await consumer.subscribe({ topic: "locations", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value?.toString();
      if (value) {
        const data = JSON.parse(value);
        console.log("Received:", data);
        receivedLocations.push(data);
      }
    },
  });
}

app.get("/health", (req, res) => {
  res.send({ status: "up" });
});

app.get("/api/locations", (req, res) => {
  res.json(receivedLocations);
});

app.listen(3002, async () => {
  await startConsumer();
  console.log("HTTP server listening on port 3002");
});
