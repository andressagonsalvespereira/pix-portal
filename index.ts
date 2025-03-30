import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import asaasRoutes from './api/routes/asaasRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', asaasRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
});
