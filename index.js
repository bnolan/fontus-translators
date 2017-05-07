import reddit from './sites/reddit-pics';
import express from 'express';

const app = express();

app.get('/reddit', reddit);

app.listen(3000, () => {
  console.log('Translator app listening on port 3000!')
});
