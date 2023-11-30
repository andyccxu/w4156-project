// twilioClient.js

const twilio = require('twilio');
require('dotenv').config({path: './config/config.env'});

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

/**
 * Sends an SMS notification using Twilio's messaging service.
 *
 * @param {string} message - The message content to be sent via SMS.
 * @param {string} phoneNumber - The recipient's phone number in E.164 format.
 */
function sendSMS(message, phoneNumber) {
  twilioClient.messages
      .create({
        body: message,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
      })
      .then((message) => console.log(message.sid))
      .catch((error) => console.error(error));
}

// Export the sendSMS function
module.exports = {sendSMS};
