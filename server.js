const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const server = express();

const port = process.env.PORT || 3100;

server.use(cors());
server.use(express.static('build'));

server.get('/api/v1/availability/:month', (request, response) => {
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
    const appointmentTimes = 'times?appointmentTypeID=7856489';
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
    const dataToSend = {
        "datetime": "2018-08-23T14:00:00",
        "appointmentTypeID": 7856489,
        "firstName": "Bob",
        "lastName": "McTest",
        "email": "bob.mctest@example.com"
      }
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
        console.log(err)
        response.status(500).json({
            msg: 'Something wrong',
        });
    });
}); 

server.listen(port, () => {
  console.log(`Now listening on port: ${port}`);
});