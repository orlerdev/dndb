import { db } from '@/app/api/db.js';

export const badgesRepo = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.Badge.findAll();
}

async function getById(id) {
  return await db.Badge.findByPk(id);
}

async function create(params) {
  return await db.Badge.create(params);
}

async function update(id, params) {
  const badge = await db.Badge.findByPk(id);

  if (!badge) {
    throw new Error('Badge not found');
  }

  Object.assign(badge, params);

  await badge.save();
}

async function _delete(id) {
  const badge = await db.Badge.findByPk(id);

  if (!badge) {
    throw new Error('Badge not found');
  }

  await badge.destroy();
}