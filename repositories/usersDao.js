import getConfig from 'next/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '@/app/api/db.js';

const { serverRuntimeConfig } = getConfig();

export const usersDao = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

const authenticate = async ({ username, password }) => {
  const user = await db.User.scope('withHash').findOne({ where: { username } });

  if (!(user && bcrypt.compareSync(password, user.hash))) {
    throw 'Username or password is incorrect';
  }

  const token = jwt.sign({ sub: user.id }, serverRuntimeConfig.secret, { expiresIn: '7d' });

  const userJson = user.get();
  delete userJson.hash;

  return {
    ...userJson,
    token
  };
};


const getAll = async () => await db.User.findAll();

const getById = async (id) => await db.User.findByPk(id);

const create = async (params) => {
  if (await db.User.fineOne({ where: { username: params.username } })) {
    throw `Username ${ params.username } is already taken`;
  }

  const user = new db.User(params);

  if (params.password) {
    user.hash = bcrypt.hashSync(params.password, 10);
  }

  await user.save();
};

const update = async (id, params) => {
  const user = await db.User.findByPk(id);

  if (!user) throw 'User not found';
  if (user.username !== params.username && await db.User.findOne({ where: { username: params.username } })) {
    throw `Username ${ params.username } is already taken`;
  }

  if (params.password) {
    params.hash = bcrypt.hashSync(params.password, 10);
  }

  Object.assign(user, params);

  await user.save();
};

const _delete = async (id) => {
  const user = db.User.findByPk(id);

  if (!user) throw 'User not found';

  await user.destroy();

};