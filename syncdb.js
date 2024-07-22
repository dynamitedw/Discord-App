const sequelize = require('./utils/database');

sequelize.sync({force: true});
// sequelize.sync({alter: true});