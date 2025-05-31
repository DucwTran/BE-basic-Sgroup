import Poll from "../models/poll.model.js";
import Vote from "../models/vote.model.js";
import User from "../models/user.model.js"
import mongoose from "mongoose";
class PollService {
  //Done
  static async createPoll(data) {
    return await Poll.create(data);
  }
  //Done
  static async getAllPolls({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const [polls, total] = await Promise.all([
      Poll.find()
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "fullName _id")
        .lean(),
      Poll.countDocuments(),
    ]);

    const formatted = polls.map((poll) => ({
      id: poll._id,
      title: poll.title,
      description: poll.description,
      options: poll.options.map((opt) => ({
        id: opt._id,
        text: opt.text,
      })),
      creator: {
        id: poll.createdBy._id,
        fullName: poll.createdBy.fullName,
      },
      isLocked: poll.isLocked,
      createdAt: poll.createdAt,
      expiresAt: poll.expiresAt || null,
      votesCount: poll.votesCount || 0,
    }));

    return {
      polls: formatted,
      total,
      page,
      limit,
    };
  }
  //Done
  static async getPollById(pollId) {
    const poll = await Poll.findById(pollId)
      .populate("createdBy", "fullName _id")
      .lean();

    if (!poll) return null;

    const votes = await Vote.find({ pollId }).lean();

    const optionVoteMap = {};
    for (const opt of poll.options) {
      optionVoteMap[opt._id.toString()] = {
        votes: 0,
        userVote: [],
      };
    }

    for (const vote of votes) {
      const optionId = vote.optionId.toString();
      if (optionVoteMap[optionId]) {
        optionVoteMap[optionId].votes++;
        optionVoteMap[optionId].userVote.push(vote.userId.toString());
      }
    }

    const userIds = [...new Set(votes.map((v) => v.userId.toString()))];

    const users = await User.find(
      { _id: { $in: userIds } },
      "fullName _id"
    ).lean();

    const userMap = {};
    for (const u of users) {
      userMap[u._id.toString()] = {
        id: u._id,
        fullName: u.fullName,
      };
    }

    const optionsWithVotes = poll.options.map((opt) => {
      const optIdStr = opt._id.toString();
      return {
        id: opt._id,
        text: opt.text,
        votes: optionVoteMap[optIdStr]?.votes || 0,
        userVote: (optionVoteMap[optIdStr]?.userVote || []).map(
          (uid) => userMap[uid]
        ),
      };
    });

    const totalVotes = votes.length;

    return {
      id: poll._id,
      title: poll.title,
      description: poll.description,
      options: optionsWithVotes,
      creator: {
        id: poll.createdBy._id,
        username: poll.createdBy.username,
      },
      isLocked: poll.locked,
      createdAt: poll.createdAt,
      expiresAt: poll.expiresAt || null,
      totalVotes,
    };
  }

  //Done
  static async addOption(pollId, text) {
    return await Poll.findByIdAndUpdate(
      pollId,
      {
        $push: {
          options: {
            text: text,
          },
        },
      },
      { new: true }
    );
  }
  //Done
  static async removeOption(pollId, optionId) {
    return await Poll.findByIdAndUpdate(
      pollId,
      { $pull: { options: { _id: new mongoose.Types.ObjectId(optionId) } } },
      { new: true }
    );
  }

  static async lockPoll(id) {
    return await Poll.findByIdAndUpdate(id, { isLocked: true }, { new: true });
  }

  static async unlockPoll(id) {
    return await Poll.findByIdAndUpdate(id, { isLocked: false }, { new: true });
  }
}

export default PollService;
