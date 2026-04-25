import db from '../db/index.js';
import { urlsTable } from '../models/url.model.js';
import { eq } from 'drizzle-orm';
export const createUrl = async (req, res, shortUrlId, url) => {
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
    return result;
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getUrlByShortUrl = async (req, res, shortUrl) => {
  const [result] = await db
    .select({
      targetUrl: urlsTable.targetUrl,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortUrl, shortUrl));

  if (!result) {
    return res.status(404).json({ error: 'Url not found' });
  }
  return result;
};
