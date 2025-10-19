const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const geminiRoutes = require("./routes/geminiRoutes");

app.use("/api/gemini", geminiRoutes);

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
 origin: "*"
  }
));

const routes = require("./routes");

app.use("/api", routes);


app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Saylani Microfinance API!",
    routes: {
      register: "/api/auth/register",
      login: "/api/auth/login",
      user: "/api/auth/user",
    },
  });
});

module.exports = app;
