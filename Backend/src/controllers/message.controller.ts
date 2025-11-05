import { Request, Response } from "express";
import Message from "../models/message.model";
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { userId} = req.query;

    if (!userId ) {
      return res.status(400).json({ error: "userId is required" });
    }
    
    const messages = await Message.find({ userId }).sort({ createdAt: 1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.error(" Error fetching messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteMessages = async (req: Request, res: Response) => {
  try {
    console.log("Incoming userId:", req.query.userId);
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const result = await Message.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "Chat cleared successfully",
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    console.error("Error deleting messages:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
