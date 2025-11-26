// ./api/locations.ts
import { Request, Response } from "express";
import { Producer } from "kafkajs";

export default async function locations(
  req: Request,
  res: Response,
  producer: Producer
) {
  const body = req.body;
  console.log(body);

  try {
    await producer.send({
      topic: "enemy-spotted",
      messages: [
        {
          key: `location-${Date.now()}`,
          value: JSON.stringify(body),
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Location sent to Kafka",
    });
  } catch (error) {
    console.error("Failed to send to Kafka:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send location to Kafka",
    });
  }
}
