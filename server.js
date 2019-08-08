const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', async (req, res) => {
  try {
    const accounts = await db('accounts');

    res.status(200).json({
      accounts
    })
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

server.get('/:value', async (req, res) => {
  const {value} = req.params;

  try {
    const accountInfo = await db('accounts').where('budget' > value);

    if (accountInfo) {
      res.status(200).json({
        accountInfo
      })
    } else {
      res.status(404).json({
        message: "ID not found"
      })
    }
    
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

server.post('/', async (req, res) => {
  const account = req.body;

  try {
    if (account.name && account.budget) {
      const accountInfo = await db('accounts').insert(account);
  
      if (accountInfo) {
        res.status(200).json({
          accountInfo
        })
      } else {
        res.status(500).json({
          message: "Internal Server Error"
        })
      }
    } else {
      res.status(400).json({
        message: "Required fields not found"
      })
    }  
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

server.put('/:id', (req, res) => {
  try {

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

server.delete('/:id', (req, res) => {
  try {

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = server;