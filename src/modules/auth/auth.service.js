import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import * as userRepo from "../user/user.repo.js";
import { generateTokens } from "./token.service.js";

export async function signup(email, password) {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("Email already exists");

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userRepo.createUser(client, {
      id: uuid(),
      email,
      passwordHash,
      role: "CUSTOMER",
    });

    const tokens = generateTokens(user);

    await client.query("COMMIT");
    return { user, ...tokens };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function login(email, password) {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const tokens = generateTokens(user);
  return { user, ...tokens };
}
