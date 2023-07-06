import { apiHandler } from '@/app/api/api-handler.js';
import { usersDao } from 'repositories';

export default apiHandler({
  post: register
});

const register = async (req, res) => {
  await usersDao.create(req.body);
  return res.status(200).json({});
};