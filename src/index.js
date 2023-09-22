const cors = require("cors")

const express = require('express')

const app = express()

app.use(cors())
app.use(express.urlencoded( {extended: true} ))
app.use(express.json())


const PORT = process.env.PORT || 8080


app.get("/", (req,res) => {
    res.json("Hello mate! v2")
})

// Members API Routes
app.use('/api/members', require('./routes/api/members'))



app.listen(PORT, () => {
    console.log(`server is running on Port: ${PORT}`)
})
