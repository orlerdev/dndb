import { db } from '@/app/api/db.js';

export const monstersRepo = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.Monster.findAll();
}

async function getById(id) {
  return await db.Monster.findByPk(id);
}

async function create(params) {
  return await db.Monster.create(params);
}

async function update(id, params) {
  const monster = await db.Monster.findByPk(id);

  if (!monster) {
    throw new Error('Monster not found');
  }

  Object.assign(monster, params);

  await monster.save();
}

async function _delete(id) {
  const monster = await db.Monster.findByPk(id);

  if (!monster) {
    throw new Error('Monster not found');
  }

  await monster.destroy();
}