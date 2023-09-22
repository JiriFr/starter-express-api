const config = require('./config')
const axios = require('axios')

const accountDetails = (req,res) => {
    let data = {test: "Test"}
    return res.status(200).json(data)
}

module.exports = {
    accountDetails
}
