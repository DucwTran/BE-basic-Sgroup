import { BadRequestError, NotFoundError } from "../handlers/error.response.js";
import mongoose from "mongoose";
export default class PollService {
  constructor(Poll, Vote, User) {
    this.pollModel = Poll;
    this.userModel = User;
    this.voteModel = Vote;
  }
  createPoll = async (data) => {
    if (!data.title) {
      console.log(data)
      throw new BadRequestError("Thiếu nội dung câu hỏi");
    }
    return await this.pollModel.create(data);
  };

  getAllPolls = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const [polls, total] = await Promise.all([
      this.pollModel
        .find()
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "fullName _id")
        .lean(),
      this.pollModel.countDocuments(),
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
  };

  getPollById = async (pollId) => {
    const poll = await this.pollModel
      .findById(pollId)
      .populate("createdBy", "fullName _id")
      .lean(); //return về JS object, giúp tăng hiệu suất (không cần các method của mongoose document).

    if (!poll) throw NotFoundError("Poll Not Found");

    const votes = await this.voteModel.find({ pollId }).lean();

    //Chuẩn bị hashmap để lưu số phiếu từng option
    const optionVoteMap = {};
    for (const opt of poll.options) {
      optionVoteMap[opt._id.toString()] = {
        votes: 0,
        userVote: [],
      };
    }

    //Tính tổng phiếu và user đã vote cho từng option
    for (const vote of votes) {
      const optionId = vote.optionId.toString();
      if (optionVoteMap[optionId]) {
        optionVoteMap[optionId].votes++;
        optionVoteMap[optionId].userVote.push(vote.userId.toString());
      }
    }

    const userIds = [...new Set(votes.map((v) => v.userId.toString()))];

    const users = await this.userModel
      .find({ _id: { $in: userIds } }, "fullName _id")
      .lean();

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
      isLocked: poll.isLocked,
      createdAt: poll.createdAt,
      expiresAt: poll.expiresAt || null,
      totalVotes,
    };
  };

  addOption = async (pollId, text) => {
    return await this.pollModel.findByIdAndUpdate(
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
  };

  removeOption = async (pollId, optionId) => {
    return await this.pollModel.findByIdAndUpdate(
      pollId,
      { $pull: { options: { _id: new mongoose.Types.ObjectId(optionId) } } },
      { new: true }
    );
  };

  lockPoll = async (id) => {
    return await this.pollModel.findByIdAndUpdate(
      id,
      { isLocked: true },
      { new: true }
    );
  };

  unlockPoll = async (id) => {
    return await this.pollModel.findByIdAndUpdate(
      id,
      { isLocked: false },
      { new: true }
    );
  };
}
