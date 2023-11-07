const express = require("express");
require("dotenv").config();
const path = require("path");

const port = process.env.PORT || 5000;
const dbConnect = require("./utils/dbConnect");

//folders
const userRoutes = require("./routes/user");
const scheduleRoutes = require("./routes/schedule");
const stripe = require("./routes/stripe");


//activating
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));

// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payment/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

//routes
app.use("/api/user", userRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/payment", stripe);

//Server frontend
if (process.env.NODE__ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}

app.listen(port, async () => {
  await dbConnect();
  console.log("mongodb connected");
  console.log(`server on port ${port}`);
});
