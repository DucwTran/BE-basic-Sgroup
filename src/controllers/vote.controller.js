import { OK } from "../handlers/success.response.js";
export default class VoteController {
  constructor(VoteService) {
    this.voteService = VoteService;
  }
  createVote = async (req, res) => {
    const { pollId, optionId } = req.body;
    const userId = req.userId;
    const vote = await this.voteService.createVote({
      userId,
      pollId,
      optionId,
    });
    new OK({
      message: "Vote created",
      meatadata: vote,
    }).send(res);
  };

  deleteVote = async (req, res) => {
    const { pollId } = req.body;
    const userId = req.userId;
    const deleted = await this.voteService.deleteVote({ userId, pollId });
    new OK({
      message: "Vote deleted",
    }).send(res);
  };
}
