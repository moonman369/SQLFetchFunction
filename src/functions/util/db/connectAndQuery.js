// var mysql = require("mysql2");
require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.USER, // better stored in an app setting such as process.env.DB_USER
  password: process.env.PASSWORD, // better stored in an app setting such as process.env.DB_PASSWORD
  server: process.env.SERVER_NAME, // better stored in an app setting such as process.env.DB_SERVER
  port: Number(process.env.PORT), // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
  database: process.env.DATABASE, // better stored in an app setting such as process.env.DB_NAME
  authentication: {
    type: "default",
  },
  options: {
    encrypt: true,
  },
};

/*
    //Use Azure VM Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        port: process.env["db_port"],
        database: process.env["db_database"],
        authentication: {
            type: 'azure-active-directory-msi-vm'
        },
        options: {
            encrypt: true
        }
    }

    //Use Azure App Service Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        port: process.env["db_port"],
        database: process.env["db_database"],
        authentication: {
            type: 'azure-active-directory-msi-app-service'
        },
        options: {
            encrypt: true
        }
    }
*/

const connect = async () => {
  try {
    console.log("Connecting...");
    var sqlConnection = await sql.connect(config);
    console.log(
      `Connected to SQL Database: ${process.env.DATABASE} @ Server: ${process.env.SERVER_NAME}`
    );

    return sqlConnection;
  } catch (err) {
    console.error(err.message);
  }
};

const queryAllRecords = async (sqlConnection) => {
  try {
    console.log("Reading rows from the Table...");
    var resultSet = await sqlConnection.request().query(`SELECT * FROM Course`);

    console.log(`${resultSet.recordset.length} rows returned.`);
    console.log(resultSet);

    // output column headers
    var columns = "";
    for (var column in resultSet.recordset.columns) {
      //   console.log(`${column}\t`);
      columns += `${column}\t`;
    }
    console.log(columns);
    // console.log("%s\t", columns.substring(0, columns.length - 2));

    // ouput row contents from default record set
    resultSet.recordset.forEach((row) => {
      console.log(`${row.CourseID}\t${row.CourseName}\t${row.Rating}`);
    });

    // close connection only when we're certain application is finished
    sqlConnection.close();

    return resultSet;
  } catch (error) {
    console.error(error);
  }
};

const queryRecordsByPK = async (sqlConnection, pk) => {
  try {
    console.log("Reading rows from the Table...");
    var resultSet = await sqlConnection
      .request()
      .query(`SELECT * FROM Course WHERE CourseID = ${pk}`);

    console.log(`${resultSet.recordset.length} rows returned.`);
    console.log(resultSet);

    // output column headers
    var columns = "";
    for (var column in resultSet.recordset.columns) {
      //   console.log(`${column}\t`);
      columns += `${column}\t`;
    }
    console.log(columns);
    // console.log("%s\t", columns.substring(0, columns.length - 2));

    // ouput row contents from default record set
    resultSet.recordset.forEach((row) => {
      console.log(`${row.CourseID}\t${row.CourseName}\t${row.Rating}`);
    });

    // close connection only when we're certain application is finished
    sqlConnection.close();

    return resultSet;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  connect,
  queryAllRecords,
  queryRecordsByPK,
};
