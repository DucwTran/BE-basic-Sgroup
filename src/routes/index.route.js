import UserRoute from "./user.route.js";
import AuthRoute from "./auth.route.js";
import PollRoute from "./poll.route.js";
import VoteRoute from "./vote.route.js";
// import UploadRoute from "./upload.route.js";

const setupRoutes = (app) => {
  const userRoute = new UserRoute();
  const authRoute = new AuthRoute();
  const pollRoute = new PollRoute();
  const voteRoute = new VoteRoute();
  // const uploadRoute = new UploadRoute();

  app.use("/api/v1/users", userRoute.getRoute());
  app.use("/api/v1/auth", authRoute.getRoute());
  app.use("/api/v1/polls", pollRoute.getRoute());
  app.use("/api/v1/votes", voteRoute.getRoute());
  // app.use("/api/v1/upload", uploadRoute.getRoute());
};
export default setupRoutes;
