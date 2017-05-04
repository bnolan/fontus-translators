import reddit from './sites/reddit-pics';
import express from 'express';

const app = express();

app.get('/reddit', reddit);

app.get('/', (req, res) => {
  res.send('Hello Worlds!')
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
});
