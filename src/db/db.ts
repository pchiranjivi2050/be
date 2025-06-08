import mongoose, { mongo } from "mongoose";

mongoose.connect(
  "mongodb+srv://pchiranjivi2050:qOWJi2HDO8WhrGuZ@cpcluster.4apcyab.mongodb.net/balmandir"
);

const adminSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
  userContact: String,
});

const staffSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userDesignation: String,
  userExperience: String,
  staffImage: String,
});

const noticeSchema = new mongoose.Schema({
  notice: String,
});

const gallerySchema = new mongoose.Schema({
  photo: String,
});

export const Admin = mongoose.model("Admin", adminSchema);
export const Staff = mongoose.model("Staff", staffSchema);
export const Notice = mongoose.model("Notice", noticeSchema);
export const Gallery = mongoose.model("Gallery", gallerySchema);

module.exports = {
  Admin,
  Staff,
  Notice,
  Gallery,
};
