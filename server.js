const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const server = express();

const port = process.env.PORT || 3100;

server.use(cors());
server.use(express.static('build'));
server.use(bodyParser.json());

server.get(`/api/v1/availability/:month`, (request, response) => {
    const dates = `dates?month=${request.params.month}`;
    const appointments = '&appointmentTypeID=7856489';
    const url = `https://acuityscheduling.com/api/v1/availability/${dates}${appointments}`;
    axios({
        method: 'get',
        url: url,
        auth: {
            username: process.env.ACUITY_USER_ID,
            password: process.env.ACUITY_API_KEY
        }
    })
    .then((appointmentDate) => {
        console.log(appointmentDate)
        response.json(appointmentDate.data);
    })
    .catch((err) => {
        console.log(err)
        response.status(500).json({
            msg: 'Something wrong',
        });
    });
});

server.get('/api/v1/availability/times/:date', (request, response) => {
    const appointmentTypeID = process.env.ACUITY_APT_TYPE_ID;
    const appointmentTimes = `times?appointmentTypeID=${appointmentTypeID}`;
    const date = `&date=${request.params.date}`;
    const url = `https://acuityscheduling.com/api/v1/availability/${appointmentTimes}${date}`;
    axios({
        method: 'get',
        url: url,
        auth: {
            username: process.env.ACUITY_USER_ID,
            password: process.env.ACUITY_API_KEY
        }
    })
    .then((appointmentTimes) => {
        console.log(appointmentTimes)
        response.json(appointmentTimes.data);
    })
    .catch((err) => {
        console.log(err)
        response.status(500).json({
            msg: 'Something wrong',
        });
    });
});

server.post('/api/v1/appointments', (request, response, next) => {
    const { datePicker, firstName, lastName, email } = request.body;
    const dataToSend = {
        "datetime": `${datePicker}-0400`,
        "appointmentTypeID": process.env.ACUITY_APT_TYPE_ID,
        "firstName": `${firstName}`,
        "lastName": `${lastName}`,
        "email": `${email}`,
        "calendarID": process.env.ACUITY_CAL_ID
      }
      console.log(dataToSend);
    axios({
        method: 'post',
        url: 'https://acuityscheduling.com/api/v1/appointments',
        auth: {
            username: process.env.ACUITY_USER_ID,
            password: process.env.ACUITY_API_KEY
        },
        data:dataToSend
    })
    .then((success) => {
        console.log('success')
        response.json(success.data);
    })
    .catch((err) => {
        console.log(err);
        response.status(500).json({
            msg: 'Something wrong',
        });
    });
}); 

server.listen(port, () => {
  console.log(`Now listening on port: ${port}`);
});