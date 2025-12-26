import * as userRepo from "./user.repo.js";

export async function getMe(req, res, next) {
  try {
    const user = await userRepo.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
