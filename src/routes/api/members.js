const express = require('express')
const router = express.Router()

const members = require('../../../Members')
const sites = require('../../sites')

// Gets All Members
//Query string => query property on the request object
// localhost:3000/person?name=thomas&age=20
router.get('/', (req,res) => {
    if(req.query.id) {
        //res.send(`You have requested a member ${req.query.id}`)
        const found = members.some(m => m.id === req.query.id)
        if (found) {
            res.json(members.filter((m) => m.id === req.query.id))
        } else {
            res.status(400).json({msg: `Member id:${req.query.id} not found`})
        }
    }
    else {
        res.json(members)
    }
})

router.get('/sites', sites.accountDetails)


// Get Single Member
router.get('/:id', (req,res) => {
    const found = members.some(m => m.id === req.params.id)
    if (found) {
        res.json(members.filter((m) => m.id === req.params.id))
    } else {
        res.status(400).json({msg: `Member id:${req.params.id} not found`})
    }
})



module.exports = router
