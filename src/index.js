import app from './app.js';
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.DB_PORT || 3001;

app.listen(PORT, () => {
  console.log(`서버가${PORT}번 포트에서 매우 잘 실행중`);
});

