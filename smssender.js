const axios = require('axios');

const sendSMS = async (userNumber, mechanicNumber) => {
  try {
    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: 'xcHzSil6aM6igjp315oO5Pz6nk55stn2MmeHmIuYuhODhqXYYTJVwpZvqWtu',
        message: `FixMyCity: Mechanic mil gaya! Contact: ${mechanicNumber}`,
        language: 'english',
        route: 'q',
        numbers: userNumber
      }
    });

    console.log("✅ SMS Response:", response.data);
  } catch (error) {
    console.error('❌ Error sending SMS:', error.response ? error.response.data : error.message);
  }
};

module.exports = sendSMS;