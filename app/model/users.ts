/*
 * @Author: A9ia
 * @Date: 2021-01-26 21:51:07
 * @LastEditTime: 2021-02-09 08:27:18
 */
import { Model, STRING, INTEGER } from 'sequelize';
import { Application } from 'egg';

class Users extends Model {
  netId: string;
  name: string;
  role: number; // default: 1, administrator: 2, super: 3
  phone: string;
  college: string;
  grade: string;
  class: string;
}

export default (app: Application) => {
  Users.init({
    netId: { type: STRING, primaryKey: true },
    name: STRING(30),
    phone: STRING(11),
    role: { type: INTEGER, defaultValue: 1 },
    college: STRING,
    grade: STRING,
    class: STRING,
  }, {
    modelName: 'users',
    sequelize: app.model,
    underscored: true,
    timestamps: false,
  });

  return Users;
};
