import express from "express";
import cors from "cors";
import { adminRouter } from "./routes/adminRoutes";
import { userRouter } from "./routes/userRoutes";
import path from "path";

const app = express();
const port = 4646;
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRouter);
app.use("/", userRouter);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
