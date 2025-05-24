const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const marketingTrendsRoutes = require("./routes/marketingTrendsRoutes");
const approvalRoutes = require("./routes/approvalRoutes");

const { scheduleTrendsUpdate } = require("./services/marketingTrendsService");

const cookieParser = require("cookie-parser");

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  cors({
    origin: [`http://localhost:3000`, `http://localhost:3001`],
    credentials: true,
  })
);
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "POS API",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./utils/swaggerSchemas.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/employee", employeeRoutes);

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/reports/", reportRoutes);

app.use("/api/marketing-trends", marketingTrendsRoutes);

app.use("/api/approval", approvalRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    code: err.statusCode || 500,
    success: false,
    message: err.message || "Internal Server Error",
    result: null,
  });
});

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT};` +
    ` press Ctrl-C to terminate. `
  );
  console.log(
    `APIs documentation running on http://localhost:${PORT}/api-docs`
  );
  
  // Initialize marketing trends service
  scheduleTrendsUpdate();
  console.log('Marketing trends service initialized');
});
