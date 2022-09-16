import express from 'express';
import {
  findFirst, findLast, findTrades, findDaily, findDates, find24hour
} from '../services/record';

const router = express.Router();

router.get('/first', async (_, res) => {
  const first = await findFirst();
  res.json(first);
});

router.get('/last', async (_, res) => {
  const last = await findLast();
  res.json(last);
});

router.get('/trades', async (_, res) => {
  const trades = await findTrades();
  res.json(trades);
});

router.get('/daily', async (_, res) => {
  const trades = await findDaily();
  res.json(trades);
});

router.get('/24h', async (req, res) => {
  const { date } = req.query;
  const trades = await find24hour(date);
  res.json(trades);
});

router.get('/dates', async (_, res) => {
  const trades = await findDates();
  res.json(trades);
});

export default router;
