import { Router, type Request, type Response } from "express";
import AdminMiddleware from "../middleware/adminMiddleware";
import {
  addGallery,
  addNotice,
  addStaff,
  adminLogin,
  adminSignup,
  deleteGallery,
  deleteNotice,
  deleteStaff,
  editStaff,
  getGallery,
  getNotice,
  getStaff,
  totalNotice,
  totalStaff,
} from "../controller/adminController";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files and pdf files are allowed!"));
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

const adminRouter = Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/signup", adminSignup);
adminRouter.post(
  "/add-staff",
  AdminMiddleware,
  upload.single("staffImage"),
  addStaff
);
adminRouter.delete("/delete-staff/:staffId", AdminMiddleware, deleteStaff);
adminRouter.patch(
  "/update-staff/:staffId",
  AdminMiddleware,
  upload.single("staffImage"),
  editStaff
);
adminRouter.post(
  "/add-notice",
  AdminMiddleware,
  upload.single("notice"),
  addNotice
);
adminRouter.delete("/delete-notice/:noticeId", AdminMiddleware, deleteNotice);
adminRouter.get("/total-staff", AdminMiddleware, totalStaff);
adminRouter.get("/total-notice", AdminMiddleware, totalNotice);
adminRouter.post(
  "/add-photo",
  AdminMiddleware,
  upload.single("photo"),
  addGallery
);
adminRouter.delete("/delete-photo/:galleryId", AdminMiddleware, deleteGallery);
adminRouter.get("/staff", AdminMiddleware, getStaff);
adminRouter.get("/gallery", AdminMiddleware, getGallery);
adminRouter.get("/notice", AdminMiddleware, getNotice);

export { adminRouter };
