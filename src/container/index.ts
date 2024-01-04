import { DBService } from "../db/mongoose";
import { Container } from "inversify";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { GymOwnerRepository } from "../repositories/GymOwnerRepository";
import { EventRepository } from "../repositories/EventRepository";
import { RegisterRepository } from "../repositories/RegisterRepository";
import { TeamRepository } from "../repositories/TeamRepository";

export const container = new Container({
    defaultScope: 'Singleton'
});

container.bind(DBService).toSelf()
container.bind(GymOwnerRepository).toSelf()
container.bind(CategoryRepository).toSelf()
container.bind(EventRepository).toSelf()
container.bind(RegisterRepository).toSelf()
container.bind(TeamRepository).toSelf()
