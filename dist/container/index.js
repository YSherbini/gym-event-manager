import { DBService } from "../db/mongoose.js";
import { Container } from "inversify";
import { CategoryRepository } from "../repositories/CategoryRepository.js";
import { GymOwnerRepository } from "../repositories/GymOwnerRepository.js";
import { EventRepository } from "../repositories/EventRepository.js";
import { RegisterRepository } from "../repositories/RegisterRepository.js";
import { TeamRepository } from "../repositories/TeamRepository.js";
export const container = new Container({
    defaultScope: 'Singleton'
});
container.bind(DBService).toSelf();
container.bind(GymOwnerRepository).toSelf();
container.bind(CategoryRepository).toSelf();
container.bind(EventRepository).toSelf();
container.bind(RegisterRepository).toSelf();
container.bind(TeamRepository).toSelf();
//# sourceMappingURL=index.js.map