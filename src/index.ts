import express from 'express'
import authRoutes from './routes/authRoutes';
import contasRoutes from './routes/contasRoutes'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/contas', contasRoutes)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})