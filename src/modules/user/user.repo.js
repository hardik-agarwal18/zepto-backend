import db from "../../config/db.js";

export async function findByEmail(email) {
  const { rows } = await db.query(`SELECT * FROM "User" WHERE email = $1`, [
    email,
  ]);
  return rows[0];
}

export async function findById(id) {
  const { rows } = await db.query(
    `SELECT id, email, role, "isVerified", "createdAt"
     FROM "User"
     WHERE id = $1`,
    [id]
  );
  return rows[0];
}

export async function createUser(client, user) {
  const { rows } = await client.query(
    `
    INSERT INTO "User" (id, email, "passwordHash", role, "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, NOW(), NOW())
    RETURNING id, email, role, "isVerified"
    `,
    [user.id, user.email, user.passwordHash, user.role]
  );

  return rows[0];
}
