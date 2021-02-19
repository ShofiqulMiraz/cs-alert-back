// importing dependency
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const userRoutes = require("./routes/user");
const scamRequestRoutes = require("./routes/scamrequests");
const scamRoutes = require("./routes/scams");
const VerificationRoutes = require("./routes/verification.js");

// middlewares
// helmet middleware
app.use(helmet());

// rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 1000,
  message: "Too Many Request, Please try again after 1 hour",
});
app.use("/api/", apiLimiter);

// express json, morgan and cors middleware
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));
app.use(cors());

// express-mongo-sanitize
app.use(mongoSanitize());

// XSS clean
app.use(xss());

// hpp for prevent parameter pollution
app.use(hpp());

// DB connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("database connected"))
  .catch((error) => console.log(error));

// route middlewares
app.use("/api/users", userRoutes);
app.use("/api/scamrequest", scamRequestRoutes);
app.use("/api/scams", scamRoutes);
app.use("/api/verification", VerificationRoutes);

app.all("*", (req, res) => {
  res
    .status(404)
    .send(`this route ${req.originalUrl} is not defined on our server!`);
});

// start server on specified port
const port = process.env.PORT || 8000;
app.listen(port, () =>
  console.log(`cryptoscamalert application listening on port ${port}`)
);
