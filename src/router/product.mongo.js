import { Router } from "express";
import Producto from "../dao/models/products.model.js";
import is_admin from "../middlewares/is_admin.js";
import verify_token from "../middlewares/verify_token.js";
import passport_call from "../middlewares/passport_call.js";

const product_mongo_router = Router();

product_mongo_router.post(
  "/",
  passport_call("jwt") /*verify_token*/,
  is_admin,
  async (req, res, next) => {
    try {
      await Producto.create(req.body);
      return res.status(201).json({
        success: true,
        message: "product created",
      });
    } catch (error) {
      next(error);
    }
  }
);
export default product_mongo_router;
