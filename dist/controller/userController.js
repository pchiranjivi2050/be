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
exports.getStaff = getStaff;
exports.getNotice = getNotice;
exports.getGalery = getGalery;
const db_1 = require("../db/db");
function getStaff(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let staffs = yield db_1.Staff.find({});
            if (!staffs) {
                res.status(404).json({
                    msg: "No staffs found in db",
                });
                return;
            }
            res.status(200).json({
                staffs,
            });
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
function getNotice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let notice = yield db_1.Notice.find({});
            if (!notice) {
                res.status(404).json({
                    msg: "No notice found in db",
                });
                return;
            }
            res.status(200).json({
                notice,
            });
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
function getGalery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let gallery = yield db_1.Gallery.find({});
            if (!gallery) {
                res.status(404).json({
                    msg: "No gallery content found in db",
                });
                return;
            }
            res.status(200).json({
                gallery,
            });
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
