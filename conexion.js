require("dotenv").config();



const rest = new (require("rest-mssql-nodejs"))({
  user: process.env.USER_SQL,
  password: process.env.PASS_SQL,
  server: process.env.SERVER_SQL, // replace this with your IP Server
  database: process.env.DATABASE_SQL,
  //port: 1433, // this is optional, by default takes the port 1433
  options: {
    encrypt: true, // this is optional, by default is false
  },
});


module.exports = {
  rest
};
