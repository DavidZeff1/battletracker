import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  clientId: "controller-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  logLevel: logLevel.INFO,
  retry: {
    initialRetryTime: 300,
    retries: 10,
  },
});

const admin = kafka.admin();

async function initKafka() {
  try {
    await admin.connect();
    const existingTopics = await admin.listTopics();
    console.log("Existing topics:", existingTopics);

    if (existingTopics.includes("locations")) {
      console.log("⏭️  Topic 'locations' already exists");
    } else {
      console.log("🔨 Creating topic 'locations'...");
      await admin.createTopics({
        validateOnly: false,
        waitForLeaders: true,
        topics: [
          {
            topic: "locations",
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
    }
    const updatedTopics = await admin.listTopics();
    console.log("📋 All topics:", updatedTopics);

    await admin.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

initKafka();
