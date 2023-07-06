import { db } from '@/app/api/db.js';

export const monsterImagesRepo = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.MonsterImage.findAll();
}

async function getById(id) {
  return await db.MonsterImage.findByPk(id);
}

async function create(params) {
  return await db.MonsterImage.create(params);
}

async function update(id, params) {
  const monsterImage = await db.MonsterImage.findByPk(id);

  if (!monsterImage) {
    throw new Error('MonsterImage not found');
  }

  Object.assign(monsterImage, params);

  await monsterImage.save();
}

async function _delete(id) {
  const monsterImage = await db.MonsterImage.findByPk(id);

  if (!monsterImage) {
    throw new Error('MonsterImage not found');
  }

  await monsterImage.destroy();
}