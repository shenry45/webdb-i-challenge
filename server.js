const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());


// CUSTOM MIDDLEWARE

async function validateName (req, res, next) {
  const {name} = req.params;

  try {
    const accountInfo = await db('accounts').where({name});

    if (accountInfo.length > 0) {
      req.account = accountInfo;
      next();
    } else {
      res.status(404).json({
        message: "Account name not found"
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
}

// METHODS

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

server.get('/:name', validateName, async (req, res) => {
  const accountInfo = req.account;
  
  res.status(200).json({
    accountInfo
  })
})

server.get('/value/:value', async (req, res) => {
  const {value} = req.params;
  console.log(req.params);

  try {
    const accountInfo = await db('accounts').where('budget','>',value);

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

server.put('/:name', validateName, async (req, res) => {
  const {name} = req.params;
  const accountChanges = req.body;

  try {
    if (accountChanges.name || accountChanges.budget) {
      const accountInfo = await db('accounts').where({name}).update(accountChanges);
  
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

server.delete('/:name', validateName, async (req, res) => {
  const {name} = req.params;

  try {
    const accountInfo = await db('accounts').where({name}).del({name});

    if (accountInfo) {
      res.status(200).json({
        accountInfo
      })
    } else {
      res.status(404).json({
        message: "Account not found"
      })
    }
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = server;