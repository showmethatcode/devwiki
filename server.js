require("dotenv").config();
const express = require("express");
const app = express();

const { Client } = require('pg')

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
})

const morgan = require("morgan");
const logger = morgan("dev");

app.use(logger); // req, res를 보기 좋게 formatting 해주는 모듈
app.use(express.urlencoded({ extended: true })); // req.body 데이터를 받아오기 위함
app.use(express.json());

client.connect(err => {
  if (err) {
    console.log('connection error', err.stack)
  } else {
    console.log('success!')
    client.end()
  }
})