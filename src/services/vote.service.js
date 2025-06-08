import Vote from "../models/vote.model.js";
import Poll from "../models/poll.model.js";

export default class VoteService {
  constructor(Poll, Vote) {
    this.pollModel = Poll;
    this.voteModel = Vote;
  }
  createVote = async ({ userId, pollId, optionId }) => {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new Error("Poll not found");
    if (poll.isLocked) throw new Error("Poll is locked");

    return await this.voteModel.create({ userId, pollId, optionId });
  }

  deleteVote = async ({ userId, pollId }) => {
    const poll = await this.pollModel.findById(pollId);
    if (!poll) throw new Error("Poll not found");
    
    if (poll.isLocked) throw new Error("Poll is locked");

    return await Vote.findOneAndDelete({ userId, pollId });
  }
}
