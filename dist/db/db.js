"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallery = exports.Notice = exports.Staff = exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect("mongodb+srv://pchiranjivi2050:qOWJi2HDO8WhrGuZ@cpcluster.4apcyab.mongodb.net/balmandir");
const adminSchema = new mongoose_1.default.Schema({
    userName: String,
    userEmail: String,
    userPassword: String,
    userContact: String,
});
const staffSchema = new mongoose_1.default.Schema({
    userName: String,
    userEmail: String,
    userDesignation: String,
    userExperience: String,
    staffImage: String,
});
const noticeSchema = new mongoose_1.default.Schema({
    notice: String,
});
const gallerySchema = new mongoose_1.default.Schema({
    photo: String,
});
exports.Admin = mongoose_1.default.model("Admin", adminSchema);
exports.Staff = mongoose_1.default.model("Staff", staffSchema);
exports.Notice = mongoose_1.default.model("Notice", noticeSchema);
exports.Gallery = mongoose_1.default.model("Gallery", gallerySchema);
module.exports = {
    Admin: exports.Admin,
    Staff: exports.Staff,
    Notice: exports.Notice,
    Gallery: exports.Gallery,
};
