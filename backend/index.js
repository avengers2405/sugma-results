import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());

app.post('/upload/chat', (req, res) => {
    console.log('reaching the endpoint');
})

app.listen(PORT, ()=>{
    console.log(`happi server at ${PORT}`);
})