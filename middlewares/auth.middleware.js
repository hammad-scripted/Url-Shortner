import { validateUserToken } from '../utils/token.js';

export const authMiddleWare = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authorization header must start with Bearer',
    });
  }

  const token = authHeader.split(' ')[1];

  const data = await validateUserToken(token);

  if (!data) {
    return res.status(401).json({
      error: 'Invalid token',
    });
  }

  req.user = data;
  console.log(req.user);

  next();
};
