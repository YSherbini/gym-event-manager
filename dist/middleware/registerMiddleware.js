import { container } from '../container/index.js';
import { RegisterRepository } from '../repositories/RegisterRepository.js';
export const alreadyRegistered = async (req, res, next) => {
    const registerRepository = container.get(RegisterRepository);
    const { eventId } = req.body;
    if (await registerRepository.getOne({ gymOwnerId: req.gymOwner._id, eventId })) {
        return res.status(409).json({ error: 'Already Registered!' });
    }
    next();
};
//# sourceMappingURL=registerMiddleware.js.map