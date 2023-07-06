import { db } from './db.js';
import { errorHandler, jwtMiddleware } from 'helpers';

export const apiHandler = (handler) => {
  return async (req, res) => {
    const method = req.method.toLowerCase();

    if (!handler[method])

      return res.status(405).end(`Method ${ req.method } Not Allowed`);

    try {
      if (!db.initialized)
        await db.initialize();

      await jwtMiddleware(req, res);

      await handler[method](req, res);
    } catch (error) {
      errorHandler(err, res);
    }
  };
};