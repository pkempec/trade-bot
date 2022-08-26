import config from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import record from './routers/record';

const port = 4000;
const app = express();

const originlist = ['http://localhost:3000', 'http://botberry.local:3000'];

const corsOptions = {
  origin: (origin, callback) => {
    if (originlist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors());

app.use('/stats', record);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})