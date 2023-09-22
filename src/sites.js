const config = require('./config')
const axios = require('axios')

const accountDetails = (req,res) => {
    let data = {test: "Test v3"}
    //return res.status(200).json(data)
    return res.json(data)
}

module.exports = {
    accountDetails
}
