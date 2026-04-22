import chalk from 'chalk';
import express from 'express';
const PORT = process.env.PORT || 8000;
const app = express();

app.listen(PORT, () => {
  console.log(chalk.red(`Server is running on port ${PORT}`));
});
