import { Router } from "express";
import Register from "../models/register.mjs";
import auth from '../middleware/auth.mjs'
const router = new Router()

// register
router.post('/registers', auth, async (req, res) => {
    const register = new Register({
        eventId: req.body.eventId,
        gymOwnerId: req.gymOwner._id
    })
    try {
        if (await Register.findOne({ eventId: req.body.event})){
            throw new Error('Already regestered!')
        }
        await register.save()
        await register.populate('event').execPopulate()
        res.status(201).send(register)
    } catch (err) {
        res.status(400).send(err)
    }
})

// Get registers
router.get('/registers', auth, async (req, res) => {
    try {
        const registers = await Register.find({ gymOwnerId: req.gymOwner._id }).populate('event')
        res.send(registers)
    } catch (err) {
        res.status(400).send(err)
    }
})

// Get register/registerd teams
router.get('/registers/:id', auth, async (req, res) => {
    try {
        const register = await Register.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id }).populate('teams event')
        if (!register) {
            return res.status(404).send('Register not found!')
        }
        res.send(register)
    } catch (err) {
        res.status(400).send(err)
    }
})

// Delete register
router.delete('/registers/:id', auth, async (req, res) => {
    try {
        const register = await Register.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id })
        if (!register) {
            return res.status(404).send('Register not found!')
        }
        await register.remove()
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
})

export default router;