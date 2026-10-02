const {Pool}=require("pg");
const pool =new Pool ({
    user:"postgres",
    host:"localhost",
    database:"note_db",
    password:"22446688",
    post:5432
})
module.exports=pool;