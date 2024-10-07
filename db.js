import {Sequelize} from "sequelize";

export default new Sequelize(
  'telega_bot',
  'admin',
  'root',
  {
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
  }
);
