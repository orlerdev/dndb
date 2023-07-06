import { db } from '@/app/api/db.js';

export const battlesDao = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.Battle.findAll();
}

async function getById(id) {
  return await db.Battle.findByPk(id);
}

async function create(params) {
  return await db.Battle.create(params);
}

async function update(id, params) {
  const battle = await db.Battle.findByPk(id);

  if (!battle) {
    throw new Error('Battle not found');
  }

  Object.assign(battle, params);

  await battle.save();
}

async function _delete(id) {
  const battle = await db.Battle.findByPk(id);

  if (!battle) {
    throw new Error('Battle not found');
  }

  await battle.destroy();
}