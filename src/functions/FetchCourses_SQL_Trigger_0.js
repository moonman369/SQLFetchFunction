const { app } = require("@azure/functions");
const {
  connect,
  queryAllRecords,
  queryRecordsByPK,
} = require("./util/db/connectAndQuery");

app.http("FetchCourses_SQL_Trigger_0", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get("name") || (await request.text()) || "world";

    const sqlConnection = await connect();

    if (request.query.get("id") || request.query.get("pk")) {
      const primaryKey = request.query.get("id") || request.query.get("pk");
      const result = await queryRecordsByPK(sqlConnection, primaryKey);

      return {
        body: JSON.stringify({
          message: `Hello, ${name}!`,
          resultSet: result,
        }),
      };
    } else {
      const result = await queryAllRecords(sqlConnection);

      return {
        body: JSON.stringify({
          message: `Hello, ${name}!`,
          resultSet: result,
        }),
      };
    }
  },
});
