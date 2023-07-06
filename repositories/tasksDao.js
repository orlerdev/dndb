import { db } from '@/app/api/db.js';

export const tasksRepo = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.Task.findAll();
}

async function getById(id) {
  return await db.Task.findByPk(id);
}

async function create(params) {
  return await db.Task.create(params);
}

async function update(id, params) {
  const task = await db.Task.findByPk(id);

  if (!task) {
    throw new Error('Task not found');
  }

  Object.assign(task, params);

  await task.save();
}

async function _delete(id) {
  const task = await db.Task.findByPk(id);

  if (!task) {
    throw new Error('Task not found');
  }

  await task.destroy();
}