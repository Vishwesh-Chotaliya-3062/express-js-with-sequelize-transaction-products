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

  // sequelize.query("delete from salesorder");
  // sequelize.query("ALTER TABLE salesorder AUTO_INCREMENT = 1");

  return Salesorder;
};