import { DataTypes } from "sequelize";
import sequelize from './db.js';

export const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
  chatId: {type: DataTypes.STRING, unique: true},
  right: {type: DataTypes.INTEGER, defaultValue: 0},
  wrong: {type: DataTypes.INTEGER, defaultValue: 0},
})
