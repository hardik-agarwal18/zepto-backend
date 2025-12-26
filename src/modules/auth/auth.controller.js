import { signup, login } from "./auth.service.js";

export async function signupHandler(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await signup(email, password);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function loginHandler(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
