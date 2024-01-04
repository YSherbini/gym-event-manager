import { Request } from 'express'
import { IGymOwner } from './IGymOwner'

export interface IRequest extends Request {
    gymOwner: IGymOwner,
    token: string
}