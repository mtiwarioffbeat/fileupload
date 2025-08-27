import {Pool} from 'pg'

declare global {

  var dbPool: Pool | undefined;
}
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
