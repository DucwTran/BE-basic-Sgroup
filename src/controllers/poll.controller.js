import PollService from "../services/poll.service.js";
import Poll from "../models/poll.model.js";
import {
  BadRequestError,
  AuthFailureError,
  ConflictRequestError,
} from "../handlers/error.response.js";

class PollController {
  static async createPoll(req, res) {
    const { title, description } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      throw new BadRequestError("Câu hỏi không được để trống");
    }

    if (!req.userId) {
      throw new AuthFailureError("Bạn chưa đăng nhập");
    }

    const existing = await Poll.findOne({ title });
    if (existing) {
      throw new ConflictRequestError("Câu hỏi đã tồn tại");
    }

    const data = {
      title,
      description,
      createdBy: req.userId,
      options: [],
    };
    const poll = await PollService.createPoll(data);
    res.status(201).json(poll);
  }

  static async getAllPolls(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await PollService.getAllPolls({ page, limit });

    res.json({
      success: true,
      message: "Get all Poll successfully",
      data: result.polls,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  }

  static async getPollById(req, res) {
    const { id } = req.params;
    const poll = await PollService.getPollById(id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
        poll: poll
      });
    }
    res.json({
      success: true,
      message: "Get Poll successfully",
      data: poll,
    });
  }

  static async addOption(req, res) {
    const { pollId } = req.params;
    const { text } = req.body;
    const updated = await PollService.addOption(pollId, text);
    res.json(updated);
  }

  static async removeOption(req, res) {
    const { pollId, optionId } = req.params;
    const updatedPoll = await PollService.removeOption(pollId, optionId);
    if (!updatedPoll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    res.json(updatedPoll);
  }

  static async lockPoll(req, res) {
    const { pollId } = req.params;
    const updated = await PollService.lockPoll(pollId);
    res.json(updated);
  }

  static async unlockPoll(req, res) {
    const { pollId } = req.params;
    const updated = await PollService.unlockPoll(pollId);
    res.json(updated);
  }
}

export default PollController;
