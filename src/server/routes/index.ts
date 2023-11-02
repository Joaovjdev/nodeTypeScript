import { Router } from "express";
import { StatusCodes } from 'http-status-codes';


const router = Router();


router.get('/', (_, res) => {
  return res.send('Ola, dev!');
});

router.post('/teste', (req, res) => {
  return res.status(StatusCodes.UNAUTHORIZED).json(req.body)
});


export { router };