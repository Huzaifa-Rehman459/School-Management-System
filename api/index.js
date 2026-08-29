const serverless = require("serverless-http");
const app = require("../school-management-backend/backend/app");
const connectDB = require("../school-management-backend/backend/config/db");

let handler;

module.exports = async (req, res) => {
  await connectDB();
  if (!handler) handler = serverless(app);
  return handler(req, res);
};