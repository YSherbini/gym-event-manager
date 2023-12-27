import { Request } from 'express'
import { IGymOwner } from './IGymOwner.js'

export interface IRequest extends Request {
    gymOwner: IGymOwner,
    token: string
}