const cors = require("cors")

const express = require('express')

const app = express()
const PORT = process.env.PORT || 8080

app.use(cors())
app.use(express.urlencoded( {extended: true} ))
app.use(express.json())


app.get("/", (req,res) => {
    res.json("Hello mate! v2")
})



app.listen(PORT, () => {
    console.log(`server is running on Port: ${PORT}`)
})
