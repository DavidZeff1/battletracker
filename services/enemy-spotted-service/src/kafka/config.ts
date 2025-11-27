import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
  clientId: "enemy-spotted-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  logLevel: logLevel.INFO,
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

export default kafka;
