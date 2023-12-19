import { Router } from "express";
import GymOwner from '../models/gymOwner.mjs';
import auth from '../middleware/auth.mjs'
const router = new Router()

// Signup
router.post('/gymOwners/signup', async (req, res) => {
    const gymOwner = new GymOwner(req.body)
    try {
        await gymOwner.save()
        const token = await gymOwner.generateAuthToken()
        res.status(201).send({token})
    } catch (err) {
        res.status(400).send(err)
    }
})

// Login
router.post('/gymOwners/login', async (req, res) => {
    try {
        const gymOwner = await GymOwner.findByCredentials(req.body.email, req.body.password)
        const token = await gymOwner.generateAuthToken()
        res.send({token})
    } catch (err) {
        res.status(400).send(err)
    }
})

// Logout
router.post('/gymOwners/logout', auth, async (req, res) => {
    try {
        req.gymOwner.tokens = req.gymOwner.tokens.filter((token) => token.token !== req.token)
        await req.gymOwner.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

// Profile
router.get('/gymOwners/profile', auth, async (req, res) => {
    try {
        res.send(req.gymOwner)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.patch('/gymOwners/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOp = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOp) {
        return res.status(400).send()
    }
    try {
        updates.forEach((update) => req.gymOwner[update] = req.body[update])
        await req.gymOwner.save()
        res.send(req.gymOwner)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/gymOwners/profile', auth, async (req, res) => {
    try {
        await req.gymOwner.remove()
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
})

export default router