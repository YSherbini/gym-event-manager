"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRepository = void 0;
const inversify_1 = require("inversify");
const team_js_1 = __importDefault(require("../models/team.js"));
let TeamRepository = class TeamRepository {
    create(teamParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return new team_js_1.default(teamParams);
        });
    }
    update(team, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            Object.entries(updates).forEach(([field, fieldValue]) => {
                if (fieldValue !== undefined) {
                    team[field] = fieldValue;
                }
            });
            return this.save(team);
        });
    }
    save(team) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield team.save();
            }
            catch (err) {
                throw new Error('Coudnt save!');
            }
        });
    }
    saveAll(teams) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const team of teams) {
                yield this.save(team);
            }
        });
    }
    remove(team) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield team.remove();
            }
            catch (err) {
                throw new Error('Coudnt save!');
            }
        });
    }
    getOne(options, populate = '') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield team_js_1.default.findOne(options).populate(populate, '-__v');
            }
            catch (err) {
                throw new Error('Coudnt get team');
            }
        });
    }
    duplicateTeams(teamsIds, register) {
        return __awaiter(this, void 0, void 0, function* () {
            const dupTeams = { teams: [] };
            try {
                for (const teamId of teamsIds) {
                    const team = yield this.getOne({ _id: teamId });
                    if (!team) {
                        dupTeams.error = { status: 404, msg: 'Team not found!' };
                        return dupTeams;
                    }
                    if (register.event && !register.event.categoriesIds.includes(team.categoryId)) {
                        dupTeams.error = { status: 422, msg: "Categories does't match" };
                        return dupTeams;
                    }
                    const { name, image, categoryId, gymOwnerId, registerId, eventId } = team;
                    const teamParams = { name, image, categoryId, gymOwnerId, registerId, eventId };
                    const dupTeam = yield this.create(teamParams);
                    dupTeams.teams.push(dupTeam);
                }
                yield this.saveAll(dupTeams.teams);
                return dupTeams;
            }
            catch (err) {
                throw new Error();
            }
        });
    }
    applyQuery({ categoryId, sortBy }, categoriesIds) {
        let match = { $and: [] };
        const sort = {};
        if (categoryId) {
            match.$and.push({ categoryId });
        }
        if (categoriesIds.length > 0) {
            match.$and.push({ categoryId: { $in: categoriesIds } });
        }
        if (sortBy) {
            const [sortee, order] = sortBy.split(':');
            sort[sortee] = order === 'desc' ? -1 : 1;
        }
        return { match, sort };
    }
};
exports.TeamRepository = TeamRepository;
exports.TeamRepository = TeamRepository = __decorate([
    (0, inversify_1.injectable)()
], TeamRepository);
//# sourceMappingURL=TeamRepository.js.map