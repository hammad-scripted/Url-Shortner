import express from 'express';

import { hashPassword } from '../utils/hashing.js';
import { signUpPostRequestBodySchema } from '../validations/request.validation.js';

import { createUser, getUserByEmail } from '../services/user.service.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  //// zod validation
  const validationResult = await signUpPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.format(),
    });
  }

  ////  existing user check by email
  const existingUser = await getUserByEmail(email);
  console.log(existingUser);
  if (existingUser.email) {
    return res
      .status(400)
      .json({ error: `User already exists with ${existingUser.email}` });
  }
  // // password hashing
  const { salt, password: hashedPassword } = hashPassword(password);

  // // insert user

  const newUser = await createUser(
    firstname,
    lastname,
    email,
    salt,
    hashedPassword,
  );
  return res.status(201).json({ userId: newUser.id, status: 'success' });
});

export default router;
