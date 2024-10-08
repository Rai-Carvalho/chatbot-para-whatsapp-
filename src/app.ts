import express from "express"
import bodyParser from "body-parser"
import cors from 'cors'
import dotenv from 'dotenv'
import { sendWhatsApp } from "./services/twilio"
import { getOpenAICompletion } from "./services/openai"

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cors())

dotenv.config()

app.post('/chat/send', async (req, res) => {
    const {to, body} = req.body

    try {
        const result = await sendWhatsApp(`whatsapp:${to}`, body)
        console.log(result)
        res.status(200).json({success: true, body})
    } catch (error) {
        res.status(500).json({success: false, error})
    }
})

app.post('/chat/receive', async (req, res) => {
    const twilioRequestBody = req.body
    const messageBody = twilioRequestBody.Body
    const to = twilioRequestBody.From

    try {
        const completion = await getOpenAICompletion(messageBody)

        await sendWhatsApp(to, completion)
        res.status(200).json({success: true, messageBody})
    } catch (error) {
        res.status(500).json({success: false, error})
    }
})


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('O servidor está rodando')
})





