import { Request } from 'express'
import { IGymOwner } from './GymOwner.interface.js'

export interface MyRequest extends Request {
    gymOwner?: IGymOwner,
    token?: string
}