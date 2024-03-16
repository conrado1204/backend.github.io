import { Router } from "express";
import User from "../dao/models/user.model.js";
import is_form_ok from "../middlewares/is_form_ok.js";
import is_valid_user from "../middlewares/is_valid_user.js";
import is_valid_pass from "../middlewares/is_valid_pass.js";
import is_8_char from "../middlewares/is_8_char.js";
import create_hash from "../middlewares/create_hash.js";
import passport from 'passport';
import create_token from "../middlewares/create_token.js";

const auth_router = Router();

auth_router.post('/register', 
  is_form_ok, 
  is_8_char, 
  create_hash,  
  passport.authenticate('register'), 
    async(req, res, next) => {
        try {
          console.log(req.user);
          return res.status(201).json({
            success: true,
            message: 'user registered',
            user_id: req.user.user_id
          })
        } catch (error) {
          next(error)
      }
})

auth_router.post('/login',
  is_8_char , 
  passport.authenticate('login'),
  is_valid_pass,
  create_token, 
  async(req, res, next)=> {
   try {
        req.session.mail = req.body.mail;
        req.session.role = req.user.role;
    return res.status(200)
    .cookie(
      'token',
      req.session.token,
      {maxAge:60*60*24*7*1000, httpOnly:true}
      ).json({
          user: req.user,
          session: req.session,
          message: req.session.mail + ' inicio sesión',
          token: req.session.token
    })
} catch (error) {
    next(error)
}
})

auth_router.post('/signout', passport.authenticate('jwt'), async(req, res, next)=> {
  try {
      req.session.destroy()
      return res.status(200).clearCookie('token').json({
        success: true,
        message: 'sesion cerrada',
        dataSession: req.session
      })
  } catch (error) {
    next(error)
  }
})

auth_router.get('/github', passport.authenticate('github', { scope: [ 'user:mail']}),(req,res)=>{})
auth_router.get('/github/callback', passport.authenticate('github',{}),(req,res,next)=>{
  try {
      req.session.mail = req.user.mail;
      req.session.role = req.user.role;
    return res.status(200).json({
      success: true,
      user: req.user
    })
  } catch (error) {
      next (error)
  }
})

export default auth_router