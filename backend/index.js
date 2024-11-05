import express from 'express';
import cors from 'cors'
import payment from './routes/payment.js'

const app = express()
const port = 4000

app.use(express.json());
app.use(cors());

app.use('/api/payment', payment);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})