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
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = void 0;
require("./config/index");
require("reflect-metadata");
const app_1 = require("./app");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const { PORT } = process.env;
        const app = yield new app_1.App().setup();
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });
    });
}
exports.bootstrap = bootstrap;
bootstrap();
