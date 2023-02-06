const dotenv = require('dotenv')
const mysql = require('mysql2')

dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // 無可用連線時是否等待pool連線釋放(預設為true)
    waitForConnections : true,
    // 連線池可建立的總連線數上限(預設最多為10個連線數)
    connectionLimit : 10
  })

const connectionPool = pool.promise()


async function getDatas(){
  const sql =`SELECT  message, img from srclist  ORDER BY id DESC`
  const resultData =  await connectionPool.query(sql)
  const rows = resultData
  return rows[0]
}

async function insertDatas( message, img ){
  const sql =`INSERT INTO srclist(message,img) VALUES(?,?)`
  const val = [message , img]
  const resultData = await connectionPool.query(sql,val)
  console.log(resultData)
  return resultData
}

module.exports = { getDatas,insertDatas }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  