import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { shortenPostRequestBodySchema } from '../validations/request.validation.js';
import { error } from 'node:console';
import db from '../db/index.js';
import { urlsTable } from '../models/url.model.js';
import { nanoid } from 'nanoid';
import { createUrl } from '../services/url.service.js';
const router = express.Router();

router.post('/shorten', isAuthenticated, async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.format(),
    });
  }

  const { url, shortUrl } = validationResult.data;
  const shortUrlId = shortUrl || nanoid(6);

  const result = await createUrl(req, res, shortUrlId, url, req.user.id);

  return res.status(201).json({
    status: 'success',
    data: result,
  });
});

export default router;
