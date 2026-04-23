import { randomBytes, createHmac } from 'node:crypto';

export const hashPassword = (password) => {
  const salt = randomBytes(256).toString('hex');
  const hash = createHmac('sha256', salt).update(password).digest('hex');
  return { salt, password: hash };
};
