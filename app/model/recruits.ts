import { Model, STRING, INTEGER, TINYINT } from 'sequelize'
import { Application } from 'egg'

class Recruits extends Model {
  id: number
  title: string
  content: string
  netId: string
  type: number
  static associate: () => any
}

export default (app:Application) => {
  Recruits.init({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    title: STRING,
    content: STRING,
    netId: STRING,
    type:TINYINT
  }, {
    modelName: 'recruits',
    sequelize: app.model,
    timestamps: true,
    updatedAt: false,
    createdAt: true,
    underscored: true
  })

  Recruits.associate = () => {
    app.model.Recruits.belongsTo(app.model.Users,{
      foreignKey:'netId',
      as: 'userInfo'
    })
  }
  return Recruits
}