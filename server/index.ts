import express from 'express';
import cors from 'cors';
import asaasRoutes from './api/routes/asaasRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/asaas', asaasRoutes); // ✅ conecta as rotas

app.get('/', (req, res) => {
  res.send('API do Pix Portal está no ar!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
