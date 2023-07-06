import { expressjwt } from 'express-jwt';
import util from 'util';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export const jwtMiddleware = (req, res) => {
  const middleware = expressjwt({ secret: serverRuntimeConfig.secret, algorithms: ['Hs256'] }).unless({
    path: ['/api/users/register',
      '/api/users/authenticate'
    ]
  });

  return util.promisify(middleware)(req, res);
};