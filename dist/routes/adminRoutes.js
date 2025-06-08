"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const adminMiddleware_1 = __importDefault(require("../middleware/adminMiddleware"));
const adminController_1 = require("../controller/adminController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image/") ||
            file.mimetype === "application/pdf") {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files and pdf files are allowed!"));
        }
    },
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
});
const adminRouter = (0, express_1.Router)();
exports.adminRouter = adminRouter;
adminRouter.post("/login", adminController_1.adminLogin);
adminRouter.post("/signup", adminController_1.adminSignup);
adminRouter.post("/add-staff", adminMiddleware_1.default, upload.single("staffImage"), adminController_1.addStaff);
adminRouter.delete("/delete-staff/:staffId", adminMiddleware_1.default, adminController_1.deleteStaff);
adminRouter.patch("/update-staff/:staffId", adminMiddleware_1.default, upload.single("staffImage"), adminController_1.editStaff);
adminRouter.post("/add-notice", adminMiddleware_1.default, upload.single("notice"), adminController_1.addNotice);
adminRouter.delete("/delete-notice/:noticeId", adminMiddleware_1.default, adminController_1.deleteNotice);
adminRouter.get("/total-staff", adminMiddleware_1.default, adminController_1.totalStaff);
adminRouter.get("/total-notice", adminMiddleware_1.default, adminController_1.totalNotice);
adminRouter.post("/add-photo", adminMiddleware_1.default, upload.single("photo"), adminController_1.addGallery);
adminRouter.delete("/delete-photo/:galleryId", adminMiddleware_1.default, adminController_1.deleteGallery);
adminRouter.get("/staff", adminMiddleware_1.default, adminController_1.getStaff);
adminRouter.get("/gallery", adminMiddleware_1.default, adminController_1.getGallery);
adminRouter.get("/notice", adminMiddleware_1.default, adminController_1.getNotice);
