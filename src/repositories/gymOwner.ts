import { IGymOwner } from "../interfaces/GymOwner.interface.js"
import { DataStoredInToken } from "../interfaces/jwt.js"
import GymOwner from "../models/gymOwner.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export class GymOwnerRepository {
    findByCredentials = async (email: string, password: string) => {
        try{
            const gymOwner = await GymOwner.findOne({ email })
            if (!gymOwner) {
                throw new Error()
            }
            const isMatch = await bcrypt.compare(password, gymOwner.password)
            if (!isMatch) {
                throw new Error()
            }
            return gymOwner
        } catch (err) {
            throw new Error('Invalid credentials!')
        }

    }
    
    generateAuthToken = async function (gymOwner: IGymOwner) {
        try {
            const dataStoredInToken: DataStoredInToken = { _id: gymOwner._id.toString() }
            const token = jwt.sign(dataStoredInToken, `${process.env.JWT_SECRET}`)
            gymOwner.tokens = gymOwner.tokens.concat({ token })
            await gymOwner.save()
            return token
        } catch (err) {
            throw new Error('Unable to login!')
        }
    }
}