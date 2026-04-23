import { randomBytes, createHmac } from 'node:crypto';

/**
 * Creates a password hash using HMAC SHA256.
 * If no salt is provided, generates a new salt.
 */
export const generatePasswordHash = (
  plainPassword,
  existingSalt = undefined,
) => {
  const salt = existingSalt ?? randomBytes(256).toString('hex');

  const hashedPassword = createHmac('sha256', salt)
    .update(plainPassword)
    .digest('hex');

  return {
    salt,
    hashedPassword,
  };
};
