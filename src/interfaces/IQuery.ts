import { ICategory } from "./ICategory.js";
import { IEvent } from "./IEvent.js";

export interface IQuery {
    name?: string;
    categoryId?: ICategory['_id'];
    eventId?: IEvent['_id']
    sortBy?: string;
    limit?: string;
    skip?: string;
};