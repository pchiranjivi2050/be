import { type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Admin, Gallery, Notice, Staff } from "../db/db";
import {
  adminValidation,
  staffValidation,
} from "../validation/adminValidation";
import path from "path";
import fs from "fs";

dotenv.config();
let JWT_SECRET = process.env.JWT_SECRET as string;

export async function adminLogin(req: Request, res: Response) {
  try {
    let userEmail = req.body.userEmail;
    let userPassword = req.body.userPassword;

    if (!userEmail || !userPassword) {
      res.status(401).json({
        msg: "Input fields cannot be left empty",
      });
      return;
    }

    let existingUser = await Admin.findOne({
      userEmail,
    });

    if (!existingUser) {
      res.status(404).json({
        msg: "No such user found in our db",
      });
      return;
    }

    let token = jwt.sign({ userEmail }, JWT_SECRET);
    res.status(200).json({
      token,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function adminSignup(req: Request, res: Response) {
  try {
    let parseData = adminValidation.parse(req.body);

    let { userName, userEmail, userPassword, userContact } = parseData;

    let existingUser = await Admin.findOne({
      userEmail,
    });

    if (existingUser) {
      res.status(409).json({
        msg: "Admin already exists with this email address",
      });
      return;
    }

    let hashedPassword = await bcrypt.hash(userPassword as string, 10);

    await Admin.create({
      userName,
      userEmail,
      userPassword: hashedPassword,
      userContact,
    });

    res.status(200).json({
      msg: "Admin created successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function addStaff(req: Request, res: Response) {
  try {
    let parsedData = staffValidation.parse(req.body);
    let { userName, userEmail, userDesignation, userExperience } = parsedData;
    let staffImage = req.file ? `/uploads/${req.file.filename}` : null;

    let existingStaff = await Staff.findOne({
      userEmail,
    });

    if (existingStaff) {
      if (req.file) {
        const filePath = path.join(__dirname, "../uploads", req.file.filename);
        fs.unlink(filePath, (err: any) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
      res.status(409).json({
        msg: "Staff with that email already exists in db",
      });
      return;
    }

    await Staff.create({
      userName,
      userEmail,
      userDesignation,
      userExperience,
      staffImage,
    });

    res.status(200).json({
      msg: "Staff created successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function deleteStaff(req: Request, res: Response) {
  try {
    let staffId = req.params.staffId;
    if (!staffId) {
      res.status(404).json({
        msg: "No staff id in params",
      });
      return;
    }

    let existingStaff = await Staff.findOne({
      _id: staffId,
    });

    if (!existingStaff) {
      res.status(404).json({
        msg: "No staff found with that id in db",
      });
      return;
    }

    await Staff.deleteOne({
      _id: staffId,
    });

    res.status(200).json({
      msg: "Staff deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function editStaff(req: Request, res: Response) {
  try {
    let staffId = req.params.staffId;
    if (!staffId) {
      res.status(404).json({
        msg: "No staff id in params",
      });
      return;
    }

    const {
      userName = undefined,
      userEmail = undefined,
      userDesignation = undefined,
      userExperience = undefined,
    } = req.body as Record<string, any>;

    const staffImage = req.file ? `/uploads/${req.file.filename}` : null;

    const fieldsToUpdate: Record<string, any> = {};

    if (userName) fieldsToUpdate.userName = userName;
    if (userEmail) fieldsToUpdate.userEmail = userEmail;
    if (userDesignation) fieldsToUpdate.userDesignation = userDesignation;
    if (userExperience) fieldsToUpdate.userExperience = Number(userExperience);
    if (staffImage) fieldsToUpdate.staffImage = staffImage;

    if (Object.keys(fieldsToUpdate).length === 0) {
      res.status(400).json({
        msg: "No fields to update",
      });
      return;
    }

    let result = await Staff.updateOne(
      {
        _id: staffId,
      },
      { $set: fieldsToUpdate }
    );

    res.status(200).json({
      msg: "Staff updated successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function addNotice(req: Request, res: Response) {
  try {
    let notice = req.file ? `/uploads/${req.file.filename}` : null;
    if (!notice) {
      res.status(404).json({
        msg: "No file selected for adding notice",
      });
      return;
    }
    await Notice.create({
      notice,
    });
    res.status(200).json({
      msg: "Notice added successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function deleteNotice(req: Request, res: Response) {
  try {
    let noticeId = req.params.noticeId;
    if (!noticeId) {
      res.status(404).json({
        msg: "No notice id found in params",
      });
      return;
    }

    let noticeExist = await Notice.findOne({
      _id: noticeId,
    });

    if (!noticeExist) {
      res.status(404).json({
        msg: "No notice found with such id in db",
      });
      return;
    }

    await Notice.deleteOne({
      _id: noticeId,
    });
    res.status(200).json({
      msg: "Notice deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function totalStaff(req: Request, res: Response) {
  try {
    let staff = await Staff.find({});

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
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function totalNotice(req: Request, res: Response) {
  try {
    let notice = await Notice.find({});

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
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function addGallery(req: Request, res: Response) {
  try {
    let photo = req.file ? `uploads/${req.file.filename}` : null;

    if (!photo) {
      res.status(404).json({
        msg: "Please select a photo to add in gallery",
      });
      return;
    }

    await Gallery.create({
      photo,
    });

    res.status(200).json({
      msg: "Photo added successfully in gallery",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function deleteGallery(req: Request, res: Response) {
  try {
    let galleryId = req.params.galleryId;

    if (!galleryId) {
      res.status(404).json({
        msg: "No gallery id in params",
      });
      return;
    }

    let galleryExists = await Gallery.findOne({
      _id: galleryId,
    });

    if (!galleryExists) {
      res.status(404).json({
        msg: "No such photo found in gallery in db",
      });
      return;
    }

    await Gallery.deleteOne({
      _id: galleryId,
    });

    res.status(200).json({
      msg: "Photo deleted successfully from the gallery",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function getStaff(req: Request, res: Response) {
  try {
    let staff = await Staff.find({});
    if (!staff) {
      res.status(404).json({
        msg: "No staff found in our db",
      });
      return;
    }
    res.status(200).json({
      staff,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function getGallery(req: Request, res: Response) {
  try {
    let gallery = await Gallery.find({});

    if (!gallery) {
      res.status(404).json({
        msg: "No gallery foundin our db",
      });
      return;
    }

    res.status(200).json({
      gallery,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}

export async function getNotice(req: Request, res: Response) {
  try {
    let notice = await Notice.find({});
    if (!notice) {
      res.status(404).json({
        msg: "No notice found in our db",
      });
      return;
    }
    res.status(200).json({
      notice,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        msg: error.message,
      });
    }
  }
}
