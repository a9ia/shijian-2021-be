import { Model, STRING, INTEGER } from 'sequelize'
import { Application } from 'egg'

class Teammates extends Model {
  id: number
  netId: string
  teamId: string
  cap: number
  vice: number
  static associate: () => any
}

export default (app:Application) => {
  Teammates.init({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    netId: STRING,
    teamId: STRING,
    cap: INTEGER,
    vice: INTEGER
  }, {
    modelName: 'teammates',
    sequelize: app.model,
    underscored: true
  })

  Teammates.associate = () => {
    app.model.Teammates.belongsTo(app.model.Teams,{
      foreignKey:'teamId',
      as: 'teamInfo'
    })
    app.model.Teammates.belongsTo(app.model.Users,{
      foreignKey:'netId',
      as: 'userInfo'
    })
  }
  return Teammates
}