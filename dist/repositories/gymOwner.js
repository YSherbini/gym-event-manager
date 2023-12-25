import GymOwner from "../models/gymOwner.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export class GymOwnerRepository {
    findByCredentials = async (email, password) => {
        try {
            const gymOwner = await GymOwner.findOne({ email });
            if (!gymOwner) {
                throw new Error();
            }
            const isMatch = await bcrypt.compare(password, gymOwner.password);
            if (!isMatch) {
                throw new Error();
            }
            return gymOwner;
        }
        catch (err) {
            throw new Error('Invalid credentials!');
        }
    };
    generateAuthToken = async function (gymOwner) {
        try {
            const dataStoredInToken = { _id: gymOwner._id.toString() };
            const token = jwt.sign(dataStoredInToken, `${process.env.JWT_SECRET}`);
            gymOwner.tokens = gymOwner.tokens.concat({ token });
            await gymOwner.save();
            return token;
        }
        catch (err) {
            throw new Error('Unable to login!');
        }
    };
}
//# sourceMappingURL=gymOwner.js.map