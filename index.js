import chalk from 'chalk';
import express from 'express';
import userRouter from './routes/user.routes.js';
const PORT = process.env.PORT || 8000;
const app = express();

// // middlewares
app.use(express.json());

// // routes
app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(chalk.red(`Server is running on port ${PORT}`));
});
