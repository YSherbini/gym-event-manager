import jwt from 'jsonwebtoken' 
import GymOwner from '../models/gymOwner.mjs'

const auth = async (req, res, next) =>  {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const gymOwner = await GymOwner.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!gymOwner) {
            throw new Error()
        }
        req.token = token
        req.gymOwner = gymOwner
        next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate'})
    }
}

export default auth