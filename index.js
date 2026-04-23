import chalk from 'chalk';
import express from 'express';
import userRouter from './routes/user.routes.js';
import { authMiddleWare } from './middlewares/auth.middleware.js';
const PORT = process.env.PORT || 8000;
const app = express();

// // middlewares
app.use(express.json());
app.use(authMiddleWare);

// // routes
app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(chalk.black.italic.bgCyan(`Server is running on port ${PORT}`));
});
