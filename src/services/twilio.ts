import twilio from 'twilio'
import dotenv from 'dotenv'

dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID 
const authToken = process.env.TWILIO_AUTH_TOKEN
const whatsAppPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER

const client = twilio(accountSid, authToken)

export const sendWhatsApp = async (to: string, body: string): Promise<void> => {
    try{
        await client.messages.create({
            to,
            from: whatsAppPhoneNumber,
            body
        })
    }catch(error){
        console.log(`Error sending message to ${to}: ${error}`)
    }
}