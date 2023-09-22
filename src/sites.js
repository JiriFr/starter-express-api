const config = require('./config')
const axios = require('axios')

const accountDetails = async (req,res) => {
    const sitesResponse = await axios.get("https://www.paragliding-mapa.cz/api/v0.1/launch")
    return res.json(sitesResponse.data.data[0])
}

module.exports = {
    accountDetails
}
