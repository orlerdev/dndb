import { apiHandler } from '@/app/api/api-handler.js';

export default apiHandler({
  post: authenticate
});

const authenticate = async (req, res) => {
  const user = await usersDao.authenticate(req.body);
  return res.status(200).json(user);
};