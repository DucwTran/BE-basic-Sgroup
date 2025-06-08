import { OK } from "../handlers/success.response.js";

export default class PollController {
  constructor(PollService) {
    this.pollService = PollService;
  }
  createPoll = async (req, res) => {
    const { title, description } = req.body;
    const data = {
      title,
      description,
      createdBy: req.userId,
      options: [],
    };
    const poll = await this.pollService.createPoll(data);
    new OK({
      metadata: poll,
      message: "Create successfully",
    }).send(res);
  };

  getAllPolls = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await this.pollService.getAllPolls({ page, limit });
    new OK({
      message: "Get all Poll successfully",
      metadata: {
        data: result.polls,
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    }).send(res);
  };

  getPollById = async (req, res) => {
    const { id } = req.params;
    const poll = await this.pollService.getPollById(id);
    new OK({
      metadata: poll,
      message: "successfully",
    }).send(res);
  };

  addOption = async (req, res) => {
    const { pollId } = req.params;
    const { text } = req.body;
    const updated = await this.pollService.addOption(pollId, text);
    new OK({
      message: "successfully",
      metadata: updated,
    }).send(res);
  };

  removeOption = async (req, res) => {
    const { pollId, optionId } = req.params;
    const updatedPoll = await this.pollService.removeOption(pollId, optionId);
    new OK({
      message: "successfully",
      metadata: updatedPoll,
    }).send(res);
  };

  lockPoll = async (req, res) => {
    const { pollId } = req.params;
    const updated = await this.pollService.lockPoll(pollId);
    new OK({
      message: "successfully",
      metadata: updated,
    }).send(res);
  };

  unlockPoll = async (req, res) => {
    const { pollId } = req.params;
    const updated = await this.pollService.unlockPoll(pollId);
    new OK({
      message: "successfully",
      metadata: updated,
    }).send(res);
  };
}
