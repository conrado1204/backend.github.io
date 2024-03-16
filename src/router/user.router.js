import MyRouter from "./router.js";
import User from "../dao/models/user.model.js";
import is_admin from "../middlewares/is_admin.js";

export default class userRouter extends MyRouter {
  init() {
    this.post("/", ["ADMIN"], is_admin, async (req, res, next) => {
      try {
        await User.create(req.body);
        return res.sendSuccessCreate({
          success: true,
          response: "user created",
        });
      } catch (error) {
        console.error(error);
        next(error);
      }
    });
    this.get("/", ["PUBLIC"], async (req, res, next) => {
      try {
        let all = await User.find();
        if (all) {
          return res.sendSuccess({ success: true, response: all });
        } else {
          return res.sendNotfound();
        }
      } catch (error) {
        console.error(error);
        next(error);
      }
    });
    this.put("/:id", async (req, res, next) => {
      try {
      } catch (error) {
        console.error(error);
        next(error);
      }
    });
    this.delete("/:id", async (req, res, next) => {
      try {
      } catch (error) {
        console.error(error);
        next(error);
      }
    });
  }
}
