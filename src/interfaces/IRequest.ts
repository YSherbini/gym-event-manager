import { Request } from 'express'
import { IGymOwner } from './GymOwner.interface.js'

export interface IRequest extends Request {
    gymOwner?: IGymOwner,
    token?: string
}