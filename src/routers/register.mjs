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

// Add team
// router.patch('/registers/:id/addteam', auth, async (req, res) => {
//     try {
//         const register = await Register.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id }).populate('event')
//         if (!req.body.teamsIds) {
//             throw new Error('No team included')
//         }
//         const teams = await Team.find({ _id: { $in: req.body.teamsIds } })
//         const oldTeamsLength = register.teamsIds.length
//         teams.forEach((team) => {
//             if (register.teamsIds.includes(team._id)) {
//                 return
//             }
//             if (!register.event.categoriesIds.includes(team.categoryId)) {
//                 return
//             }
//             register.teamsIds = register.teamsIds.concat(new mongoose.Types.ObjectId(team._id))
//         })
//         if (register.teamsIds.length != oldTeamsLength + req.body.teamsIds.length) {
//             throw new Error('Invalid team!')
//         }
//         await register.populate('teams').execPopulate()
//         await register.save()
//         res.send(register.teams)
//     } catch (err) {
//         res.status(400).send(err)
//     }
// })

// Remove team
// router.patch('/registers/:id/removeteam', auth, async (req, res) => {
//     try {
//         const register = await Register.findOne({ _id: req.params.id, gymOwnerId: req.gymOwner._id })
//         if (!req.body.teamId) {
//             throw new Error('No team included')
//         }
//         register.teamsIds = register.teamsIds.filter((teamId) => {
//             return teamId != req.body.teamId
//         })
//         await register.populate('teams').execPopulate()
//         await register.save()
//         res.send(register.teams)
//     } catch (err) {
//         res.status(400).send(err)
//     }
// })

export default router;