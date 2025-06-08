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
exports.adminLogin = adminLogin;
exports.adminSignup = adminSignup;
exports.addStaff = addStaff;
exports.deleteStaff = deleteStaff;
exports.editStaff = editStaff;
exports.addNotice = addNotice;
exports.deleteNotice = deleteNotice;
exports.totalStaff = totalStaff;
exports.totalNotice = totalNotice;
exports.addGallery = addGallery;
exports.deleteGallery = deleteGallery;
exports.getStaff = getStaff;
exports.getGallery = getGallery;
exports.getNotice = getNotice;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../db/db");
const adminValidation_1 = require("../validation/adminValidation");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
let JWT_SECRET = process.env.JWT_SECRET;
function adminLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userEmail = req.body.userEmail;
            let userPassword = req.body.userPassword;
            if (!userEmail || !userPassword) {
                res.status(401).json({
                    msg: "Input fields cannot be left empty",
                });
                return;
            }
            let existingUser = yield db_1.Admin.findOne({
                userEmail,
            });
            if (!existingUser) {
                res.status(404).json({
                    msg: "No such user found in our db",
                });
                return;
            }
            let token = jsonwebtoken_1.default.sign({ userEmail }, JWT_SECRET);
            res.status(200).json({
                token,
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
function adminSignup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let parseData = adminValidation_1.adminValidation.parse(req.body);
            let { userName, userEmail, userPassword, userContact } = parseData;
            let existingUser = yield db_1.Admin.findOne({
                userEmail,
            });
            if (existingUser) {
                res.status(409).json({
                    msg: "Admin already exists with this email address",
                });
                return;
            }
            let hashedPassword = yield bcrypt_1.default.hash(userPassword, 10);
            yield db_1.Admin.create({
                userName,
                userEmail,
                userPassword: hashedPassword,
                userContact,
            });
            res.status(200).json({
                msg: "Admin created successfully",
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
function addStaff(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let parsedData = adminValidation_1.staffValidation.parse(req.body);
            let { userName, userEmail, userDesignation, userExperience } = parsedData;
            let staffImage = req.file ? `/uploads/${req.file.filename}` : null;
            let existingStaff = yield db_1.Staff.findOne({
                userEmail,
            });
            if (existingStaff) {
                if (req.file) {
                    const filePath = path_1.default.join(__dirname, "../uploads", req.file.filename);
                    fs_1.default.unlink(filePath, (err) => {
                        if (err)
                            console.error("Error deleting file:", err);
                    });
                }
                res.status(409).json({
                    msg: "Staff with that email already exists in db",
                });
                return;
            }
            yield db_1.Staff.create({
                userName,
                userEmail,
                userDesignation,
                userExperience,
                staffImage,
            });
            res.status(200).json({
                msg: "Staff created successfully",
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
function deleteStaff(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let staffId = req.params.staffId;
            if (!staffId) {
                res.status(404).json({
                    msg: "No staff id in params",
                });
                return;
            }
            let existingStaff = yield db_1.Staff.findOne({
                _id: staffId,
            });
            if (!existingStaff) {
                res.status(404).json({
                    msg: "No staff found with that id in db",
                });
                return;
            }
            yield db_1.Staff.deleteOne({
                _id: staffId,
            });
            res.status(200).json({
                msg: "Staff deleted successfully",
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
function editStaff(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let staffId = req.params.staffId;
            if (!staffId) {
                res.status(404).json({
                    msg: "No staff id in params",
                });
                return;
            }
            const { userName = undefined, userEmail = undefined, userDesignation = undefined, userExperience = undefined, } = req.body;
            const staffImage = req.file ? `/uploads/${req.file.filename}` : null;
            const fieldsToUpdate = {};
            if (userName)
                fieldsToUpdate.userName = userName;
            if (userEmail)
                fieldsToUpdate.userEmail = userEmail;
            if (userDesignation)
                fieldsToUpdate.userDesignation = userDesignation;
            if (userExperience)
                fieldsToUpdate.userExperience = Number(userExperience);
            if (staffImage)
                fieldsToUpdate.staffImage = staffImage;
            if (Object.keys(fieldsToUpdate).length === 0) {
                res.status(400).json({
                    msg: "No fields to update",
                });
                return;
            }
            let result = yield db_1.Staff.updateOne({
                _id: staffId,
            }, { $set: fieldsToUpdate });
            res.status(200).json({
                msg: "Staff updated successfully",
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
function addNotice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let notice = req.file ? `/uploads/${req.file.filename}` : null;
            if (!notice) {
                res.status(404).json({
                    msg: "No file selected for adding notice",
                });
                return;
            }
            yield db_1.Notice.create({
                notice,
            });
            res.status(200).json({
                msg: "Notice added successfully",
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
function deleteNotice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let noticeId = req.params.noticeId;
            if (!noticeId) {
                res.status(404).json({
                    msg: "No notice id found in params",
                });
                return;
            }
            let noticeExist = yield db_1.Notice.findOne({
                _id: noticeId,
            });
            if (!noticeExist) {
                res.status(404).json({
                    msg: "No notice found with such id in db",
                });
                return;
            }
            yield db_1.Notice.deleteOne({
                _id: noticeId,
            });
            res.status(200).json({
                msg: "Notice deleted successfully",
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
function totalStaff(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let staff = yield db_1.Staff.find({});
            if (!staff) {
                res.status(404).json({
                    msg: "No staff found in db",
                });
                return;
            }
            let totalStaff = staff.length;
            res.status(200).json({
                totalStaff,
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
function totalNotice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let notice = yield db_1.Notice.find({});
            if (!notice) {
                res.status(404).json({
                    msg: "No notice found in db",
                });
                return;
            }
            let totalNotice = notice.length;
            res.status(200).json({
                totalNotice,
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
function addGallery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let photo = req.file ? `uploads/${req.file.filename}` : null;
            if (!photo) {
                res.status(404).json({
                    msg: "Please select a photo to add in gallery",
                });
                return;
            }
            yield db_1.Gallery.create({
                photo,
            });
            res.status(200).json({
                msg: "Photo added successfully in gallery",
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
function deleteGallery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let galleryId = req.params.galleryId;
            if (!galleryId) {
                res.status(404).json({
                    msg: "No gallery id in params",
                });
                return;
            }
            let galleryExists = yield db_1.Gallery.findOne({
                _id: galleryId,
            });
            if (!galleryExists) {
                res.status(404).json({
                    msg: "No such photo found in gallery in db",
                });
                return;
            }
            yield db_1.Gallery.deleteOne({
                _id: galleryId,
            });
            res.status(200).json({
                msg: "Photo deleted successfully from the gallery",
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
function getStaff(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let staff = yield db_1.Staff.find({});
            if (!staff) {
                res.status(404).json({
                    msg: "No staff found in our db",
                });
                return;
            }
            res.status(200).json({
                staff,
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
function getGallery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let gallery = yield db_1.Gallery.find({});
            if (!gallery) {
                res.status(404).json({
                    msg: "No gallery foundin our db",
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
function getNotice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let notice = yield db_1.Notice.find({});
            if (!notice) {
                res.status(404).json({
                    msg: "No notice found in our db",
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
