import getConfig from 'next/config';
import mysql from 'mysql2/promise';
import { Sequelize, DataTypes } from 'sequelize';

const { serverRuntimeConfig } = getConfig();

export const db = {
  initialized: false,
  initialize
};


// INIT DB AND MODELS (CALLED ON FIRST API REQUEST FROM api-handler.js)
const initialize = async () => {
  // CREATE DB IF NOT EXISTS
  const { host, port, user, password, database } = serverRuntimeConfig.dbConfig;
  const connection = await mysql.createConnection({ host, port, user, password });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${ database }\`;`);

  // CONNECT TO DB
  const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

  // INIT MODELS AND ADD THEM TO EXPORTED DB OBJECT
  db.User = userModel(sequelize);
  db.Battle = battleModel(sequelize);
  db.Task = taskModel(sequelize);
  db.Monster = monsterModel(sequelize);
  db.MonsterImage = monsterImageModel(sequelize);
  db.Badge = badgeModel(sequelize);

  // User - Battle association
  db.User.hasMany(db.Battle, { foreignKey: 'userId' });
  db.Battle.belongsTo(db.User, { foreignKey: 'userId' });

  // User - Task association
  db.User.hasMany(db.Task, { foreignKey: 'userId' });
  db.Task.belongsTo(db.User, { foreignKey: 'userId' });

  // User - Monster association
  db.User.hasMany(db.Monster, { foreignKey: 'userId' });
  db.Monster.belongsTo(db.User, { foreignKey: 'userId' });

  // Monster - MonsterImage association
  db.Monster.hasMany(db.MonsterImage, { foreignKey: 'monsterId' });
  db.MonsterImage.belongsTo(db.Monster, { foreignKey: 'monsterId' });


  // SYNC ALL MODELS WITH DATABASE
  await sequelize.sync({ alter: true });

  db.initialized = true;
};

// SEQUELIZE MODELS WITH SCHEMA DEFINITIONS

const userModel = (sequelize) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    hash: { type: DataTypes.STRING, allowNull: false },
    avatarImage: { type: DataTypes.STRING },
    backgroundImage: { type: DataTypes.STRING },
    battlesCompleted: { type: DataTypes.INTEGER }
  };
  const options = {
    defaultScope: {
      attributes: { exclude: ['hash'] }
    },
    scopes: {
      withHash: { attributes: {}, }
    }
  };
  return sequelize.define('User', attributes, options);
};

const battleModel = (sequelize) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  };
  return sequelize.define('Battle', attributes);
};

const taskModel = (sequelize) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    body: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  };
  return sequelize.define('Task', attributes);
};

const monsterModel = (sequelize) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true }
  };
  const options = {
    timestamps: false
  };
  return sequelize.define('Monster', attributes, options);
};
const monsterImageModel = (sequelize) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    image: { type: DataTypes.STRING, allowNull: false },
    stage: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
  };
  const options = {
    timestamps: false
  };
  return sequelize.define('MonsterImage', attributes, options);
};
const badgeModel = (sequelize) => {
  const attributes = {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    image: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.STRING, allowNull: false }
  };
  const options = {
    timestamps: false
  };
  return sequelize.define('Badge', attributes, options);
};
