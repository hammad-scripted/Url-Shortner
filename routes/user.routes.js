import express from 'express';
import db from '../db/index.js';
import { usersTable } from '../models/user.model.js';
import { eq } from 'drizzle-orm';
import { randomBytes, createHmac } from 'node:crypto';
import { signUpPostRequestBodySchema } from '../validations/request.validation.js';
import e from 'express';
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  const validationResult = await signUpPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.format(),
    });
  }

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (existingUser.length > 0) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const salt = randomBytes(256).toString('hex');
  const hashedPassword = createHmac('sha256', salt)
    .update(password)
    .digest('hex');
  const [user] = await db
    .insert(usersTable)
    .values({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({ id: usersTable.id });
  res.status(201).json({ userId: user.id });
});

export default router;
