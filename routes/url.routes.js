import express from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { shortenPostRequestBodySchema } from '../validations/request.validation.js';
import { error } from 'node:console';
import db from '../db/index.js';
import { urlsTable } from '../models/url.model.js';
import { nanoid } from 'nanoid';
import {
  createUrl,
  getAllUrls,
  getUrlByShortUrl,
} from '../services/url.service.js';
import { and, eq } from 'drizzle-orm';
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
router.get('/codes', isAuthenticated, async (req, res) => {
  const codes = await getAllUrls(req, res);
  return res.status(200).json({ status: 'success', data: codes });
});
router.delete('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  await db
    .delete(urlsTable)
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.id)));

  return res.status(200).json({ status: 'deleted' });
});

router.put('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  const [result] = await db
    .update(urlsTable)
    .set({ targetUrl: req.body.url })
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.id)))
    .returning();
  if (!result) {
    return res.status(500).json({ error: 'Something went wrong' });
  }

  return res.status(200).json({ status: 'updated', data: result });
});

router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const result = await getUrlByShortUrl(req, res, shortUrl);
  return res.redirect(result.targetUrl);
});

export default router;
