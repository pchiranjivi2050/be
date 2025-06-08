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
exports.default = AdminMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
require("../types/type");
function AdminMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token) {
                res.status(401).json({
                    msg: "No token in headers",
                });
                return;
            }
            let jwtPass = process.env.JWT_SECRET || "defaultKey";
            let decoded = jsonwebtoken_1.default.verify(token, jwtPass);
            let userEmail = decoded.userEmail;
            let existingUser = yield db_1.Admin.findOne({
                userEmail,
            });
            if (!existingUser) {
                res.status(404).json({
                    msg: "No such user found in db",
                });
                return;
            }
            req.user = userEmail;
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    msg: error.message,
                });
            }
        }
    });
}
