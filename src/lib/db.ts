// const { Pool } = require('pg');
// // require('dotenv').config();


// //   const pool = new Pool({
// //   user: process.env.PGUSER,
// //   host: process.env.PGHOST,
// //   port: process.env.PGPORT,
// //   password: process.env.PGPASSWORD,
// //   database: process.env.PGDATABASE,
// //   connectionString: process.env.PGCONNECTION_STRING
// // });
//   const pool = new Pool({
//   user:"postgres",
//   host: "localhost",
//   port: "5432",
//   password: "postgres",
//   database:"UserAuth",
//   connectionString:"postgres://postgres:postgress:5432/UserAuth"
// });

// export default pool



import {Pool} from 'pg'

declare global {

  var dbPool: Pool | undefined;
}
// console.log("PG Config:", {
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   port: process.env.PGPORT,
//   password: process.env.PGPASSWORD,
//   database: process.env.PGDATABASE,
//   connectionString: process.env.PGCONNECTION_STRING,
// });

const pool =
  global.dbPool ||
new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  // connectionString: process.env.PGCONNECTION_STRING
});

if (process.env.NODE_ENV !== "production") global.dbPool = pool;

export default pool;
