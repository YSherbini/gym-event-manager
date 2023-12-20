import { Router } from "express";
import Team from '../models/team.mjs'
import Category from '../models/category.mjs'
import auth from '../middleware/auth.mjs'
import Register from "../models/register.mjs";
const router = new Router()

// Create team
router.post('/teams',auth, async (req, res) => {
    try {
        const register = await Register.findOne({ _id: req.body.registerId, gymOwnerId: req.gymOwner._id }).populate('event teams')
        if (!register) {
            return res.status(404).send('Register not found!')
        }
        if (!register.event.categoriesIds.includes(req.body.categoryId)) {
            return res.status(400).send('Categories doesnt match!')
        }
        const team = new Team({
            name: req.body.name,
            categoryId: req.body.categoryId,
            gymOwnerId: req.gymOwner._id,
            registerId: register._id,
            eventId: register.eventId
        })
        await team.save()
        await team.populate('category').execPopulate()
        res.status(201).send(team)
    } catch (err) {
        res.status(400).send(err)
    }
})

// Read my teams
// GET /teams?category=Football
// GET /teams?limit=10&skip=0
// GET /teams?sortBy=createdAt:asc
router.get('/teams', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.category) {
        match.categoryId = await Category.findOne({ name: req.query.category.toLowerCase() })
    }
    if (req.query.sortBy) {
        const [sortBy, order] = req.query.sortBy.split(':')
        sort[sortBy] = order === 'desc' ? -1 : 1
    }
    try {
        await req.gymOwner.populate({
            path: 'teams',
            populate: 'category',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.gymOwner.teams)
    } catch (err) {
        res.status(400).send(err)
    }
})

// Read team by ID
router.get('/teams/:id', auth, async (req, res) => {
    try {
        const team = await Team.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id }).populate('category event')
        if (!team) {
            return res.status(404).send('Team not found!')
        }
        res.send(team)
    } catch (err) {
        res.status(500).send(err)
    }
})

// Update team by ID
router.patch('/teams/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'categoryId', 'image']
    const isValidOp = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOp) {
        return res.status(400).send()
    }
    try {
        const team = await Team.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id })
        const register = await Register.findOne({ _id: team.registerId, gymOwnerId: req.gymOwner._id }).populate('event')
        if (!team) {
            return res.status(404).send()
        }
        if (req.body.categoryId && !register.event.categoriesIds.includes(req.body.categoryId)) {
            return res.status(400).send('Categories doesnt match!')
        }
        updates.forEach((update) => team[update] = req.body[update])
        await team.save()
        await team.populate('category').execPopulate()
        res.send(team)
    } catch (err) {
        res.status(400).send(err)
    }
})

// Delete team by ID
router.delete('/teams/:id', auth, async (req, res) => {
    try {
        const team = await Team.findOneAndDelete({ _id: req.params.id, gymOwnerId: req.gymOwner._id })
        if (!team) {
            res.status(404).send()
        }
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
})

export default router