import { apiHandler } from '@/app/api/api-handler.js';
import { get } from 'http';
import { usersDao } from 'repositories';

export default apiHandler({
  get: getById,
  put: update,
  delete: _delete
});

const getById = async (req, res) => {
  const user = await usersDao.getById(req.query.id);

  if (!user) throw `User not found`;

  return res.status(200).json(user);
};

const update = async (req, res) => {
  await usersDao.update(req.query.id, req.body);
  return res.status(200).json({});
};

const _delete = async (req, res) => {
  await usersDao.delete(req.query.id);
  return res.status(200).json({});
};