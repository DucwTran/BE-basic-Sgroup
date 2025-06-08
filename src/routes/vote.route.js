import { Router } from "express";
import VoteController from "../controllers/vote.controller.js";
import VoteService from "../services/vote.service.js";
import Vote from "../models/vote.model.js";
import Poll from "../models/poll.model.js";
import asyncHandler from "../middlewares/asyncHandle.js";
import AuthValidator from "../middlewares/auth.middleware.js";

export default class VoteRoute {
  constructor() {
    this.router = Router();
    this.authValidator = new AuthValidator();
    this.voteController = new VoteController(new VoteService(Poll, Vote));
    this.setupRoutes();
  }
  setupRoutes() {
    this.router.post(
      "/",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.voteController.createVote)
    );
    this.router.delete(
      "/",
      asyncHandler(this.authValidator.checkAuth),
      asyncHandler(this.voteController.deleteVote)
    );
  }
  getRoute() {
    return this.router;
  }
}
