import jwt from 'jsonwebtoken';
import 'dotenv/config';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
import { userTokenSchema } from '../validations/token.validation.js';
export const generateToken = async (payload) => {
  const validationResult = await userTokenSchema.safeParseAsync(payload);

  if (validationResult.error) {
    throw new Error(validationResult.error.message);
  }
  const payloadData = validationResult.data;
  const token = jwt.sign(payloadData, JWT_SECRET_KEY);

  return token;
};
