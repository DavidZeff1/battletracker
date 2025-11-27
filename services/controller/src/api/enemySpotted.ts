import { Request, Response } from "express";
import { Producer } from "kafkajs";

export default async function enemySpotted(
  req: Request,
  res: Response,
  producer: Producer
) {
  const body = req.body;
  try {
    await producer.send({
      topic: "enemy-spotted",
      messages: [
        {
          key: `enemy-spotted-${Date.now()}`,
          value: JSON.stringify(body),
        },
      ],
    });

    res.status(200).json({
      success: true,
      message: "enemy-spotted sent to Kafka",
    });
  } catch (error) {
    console.error("Failed to send to Kafka:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send enemy-spotted to Kafka",
    });
  }
}
