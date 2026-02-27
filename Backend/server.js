import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config({ override: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/carts', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => res.send('API is running!'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
