import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { shortenPostRequestBodySchema } from '../validations/request.validation.js';
import { error } from 'node:console';
import db from '../db/index.js';
import { urlsTable } from '../models/url.model.js';
import { nanoid } from 'nanoid';
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

  try {
    const [result] = await db
      .insert(urlsTable)
      .values({ shortUrl: shortUrlId, targetUrl: url, userId: req.user.id })
      .returning({
        id: urlsTable.id,
        shortUrl: urlsTable.shortUrl,
        targetUrl: urlsTable.targetUrl,
      });

    if (!result) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
    return res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
