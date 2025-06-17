//import { Sequelize, Model, DataTypes, QueryTypes } from 'sequelize'
const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize');
import config from '../../_configs/default'

// const sequelize = new Sequelize({
//     dialect: 'oracle',
//     username: config.db_user,
//     password: config.db_password,
//     dialectOptions: {connectString: `(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST = ${config.db_host})(PORT = ${config.db_host}))(CONNECT_DATA =(SID= orcl)))`},
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//   }});

const sequelize = new Sequelize(config.service_name, config.db_user, config.db_password, {
  dialect: 'mysql',
  host: config.db_host,
  port: config.db_port, //optional,
  logging: console.log, // Enable SQL logging
  pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
      }
});


/*const sequelize = new Sequelize('world','dbmasteruser','ConsultIT1',
   {
     host: 'ls-c985c0a1ca1e5ea670f12d29cc581e52ead15489.cz9frioaahrx.ap-south-1.rds.amazonaws.com',
     dialect: 'mysql'
   }
 );*/

// const sequelize = new Sequelize('oracle://training3:Onlinernisnew2o20@localhost:1521/orcl');


export {
  sequelize, Model, DataTypes, QueryTypes
}
