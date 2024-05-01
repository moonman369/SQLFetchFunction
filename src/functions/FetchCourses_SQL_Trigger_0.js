const { app } = require("@azure/functions");
const { connectAndQuery } = require("./util/db/connectAndQuery");

app.http("FetchCourses_SQL_Trigger_0", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get("name") || (await request.text()) || "world";

    const result = await connectAndQuery();

    return {
      body: JSON.stringify({
        message: `Hello, ${name}!`,
        resultSet: result,
      }),
    };
  },
});
