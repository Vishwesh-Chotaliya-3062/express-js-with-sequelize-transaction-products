module.exports = (sequelize, Sequelize) => {
  const Salesorder = sequelize.define(
    "salesorder",
    {
      SalesorderID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Items: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      Total: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Salesorder;
};