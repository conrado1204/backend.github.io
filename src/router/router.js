import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../dao/models/user.model.js";

export default class MyRouter {
  constructor() {
    this.router = Router();
    this.init();
  }
  getRouter() {
    return this.router;
  }
  init() {}
  applyCb(cbs) {
    return cbs.map((cb) => async (...params) => {
      try {
        await cb.apply(this, params);
      } catch (error) {
        params[1].status(500).send(error);
      }
    });
  }
  responses = (req, res, next) => {
    res.sendSuccessCreate = (payload) => res.status(201).json(payload);
    res.sendSuccess = (payload) => res.status(200).json(payload);
    res.sendNotFound = () =>
      res.status(404).json({ success: false, response: "not found" });
    res.sendNoAuthenticatedError = (error) =>
      res.status(401).json({ status: "error", error });
    res.sendNoAuthorizatedError = (error) =>
      res.status(403).json({ status: "error", error });
    return next();
  };
  handlePolicies = (policies) => async (req, res, next) => {
    // policies es un array con las palabritas que definen las politicas de la empresa
    //['PUBLIC', 'ENV', 'DEV', 'ADMIN']
    if (policies.includes("PUBLIC")) {
      return next();
    } else {
      const authHeaders = req.headers.authorization;
      if (!authHeaders) {
        return res.sendNoAuthenticatedError("Unauthenticated");
      } else {
        const tokenArray = authHeaders.split(" "); //Bearer token.token.token ["Bearer", "token.token.token"]
        const token = tokenArray[1];
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ mail: payload.mail });
        console.log(user);
        const role = user.role;
        if (
          (policies.includes("USER") && role === 0) ||
          (policies.includes("ADMIN") && role === 1) ||
          (policies.includes("PREM") && role === 2)
        ) {
          req.user = user;
          return next();
        } else {
          return res.sendNoAuthorizatedError("Unauthorized");
        }
      }
    }
  };

  //create
  post(path, policies, ...cbs) {
    this.router.post(
      path,
      this.responses,
      this.handlePolicies(policies),
      this.applyCb(cbs)
    );
  }
  //read
  get(path, policies, ...cbs) {
    this.router.get(
      path,
      this.responses,
      this.handlePolicies(policies),
      this.applyCb(cbs)
    );
  }
  //update
  put(path, policies, ...cbs) {
    this.router.put(
      path,
      this.responses,
      this.handlePolicies(policies),
      this.applyCb(cbs)
    );
  }
  //destroy
  delete(path, policies, ...cbs) {
    this.router.delete(
      path,
      this.responses,
      this.handlePolicies(policies),
      this.applyCb(cbs)
    );
  }
}
