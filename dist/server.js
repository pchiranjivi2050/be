"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const adminRoutes_1 = require("./routes/adminRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 4646;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/admin", adminRoutes_1.adminRouter);
app.use("/", userRoutes_1.userRouter);
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
