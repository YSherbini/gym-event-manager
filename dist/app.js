"use strict";
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
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const inversify_express_utils_1 = require("inversify-express-utils");
const index_js_1 = __importDefault(require("./adminjs/index.js"));
const index_js_2 = require("./container/index.js");
const mongoose_js_1 = require("./db/mongoose.js");
class App {
    constructor() {
        this.adminPanel = new index_js_1.default();
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const { PORT } = process.env;
            const db = index_js_2.container.get(mongoose_js_1.DBService);
            yield db.connect();
            const server = new inversify_express_utils_1.InversifyExpressServer(index_js_2.container);
            server.setConfig((app) => {
                app.use(express_1.default.json());
                this.adminPanel.build(app);
            });
            const app = server.build();
            app.listen(PORT, () => {
                console.log(`server is running on port ${PORT}`);
            });
        });
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map