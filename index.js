import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dropsRoutes from './routes/dropsRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import shippingRoutes from './routes/shippingRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ['https://loveisrage.vercel.app', 'http://localhost:3000', 'http://localhost:5000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/drops", dropsRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/shipping-methods", shippingRoutes);
app.use("/api/store", storeRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
