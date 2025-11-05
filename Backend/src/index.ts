import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import dbConnect from './config/db';
import { app, server } from './socket';
import messageRoutes from './routes/messageRoutes';


const port:number= Number(process.env.PORT) || 5000;


app.use('/api/message',messageRoutes); 

server.listen(port, () => {
     dbConnect();
    console.log(`✅ Server started at http://localhost:${port}`);
});
