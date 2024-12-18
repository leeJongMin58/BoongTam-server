import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가${PORT}번 포트에서 매우 잘 실행중`);
});
