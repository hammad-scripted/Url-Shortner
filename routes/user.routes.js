import express from 'express';

import { generatePasswordHash } from '../utils/hashing.js';
import {
  signUpPostRequestBodySchema,
  loginPostRequestBodySchema,
} from '../validations/request.validation.js';
import jwt from 'jsonwebtoken';
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

  if (existingUser.email) {
    return res
      .status(400)
      .json({ error: `User already exists with ${existingUser.email}` });
  }
  // // password hashing
  const { salt, hashedPassword } = hashPassword(password);

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

router.post('/login', async (req, res) => {
  // // zod validation
  const validationResult = await loginPostRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.format(),
    });
  }
  const { email, password } = validationResult.data;

  // //get user by email
  const user = await getUserByEmail(email);

  if (!user) {
    return res
      .status(404)
      .json({ error: `User with email ${email} not found` });
  }
  // //checking password

  const { hashedPassword } = generatePasswordHash(password, user.salt);

  if (user.password !== hashedPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  // // generate token

  const payload = {
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

  return res.status(200).json({ Id: user.id, token, status: 'success' });
});
export default router;
