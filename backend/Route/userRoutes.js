import express from 'express';

const router=express.Router();

router.use('/signup',createUser);

export default router;