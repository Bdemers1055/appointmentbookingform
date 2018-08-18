const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const server = express();

const port = process.env.PORT || 3100;

server.use(cors());
server.use(express.static('build'));


server.get('/api/v1/appointments', (request, response) => {
    const url = `https://acuityscheduling.com/api/v1/appointments`;
    axios({
        method: 'get',
        url: url,
        auth: {
            username: process.env.ACUITY_USER_ID,
            password: process.env.ACUITY_API_KEY
        }
    })
    .then((appointments) => {
        console.log(appointments)
        response.json(appointments.data);
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