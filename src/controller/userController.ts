import { type Request, type Response } from "express";
import { Gallery, Notice, Staff } from "../db/db";

export async function getStaff(req: Request, res: Response) {
  try {
    let staffs = await Staff.find({});
    if (!staffs) {
      res.status(404).json({
        msg: "No staffs found in db",
      });
      return;
    }
    res.status(200).json({
      staffs,
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
        msg: "No notice found in db",
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

export async function getGalery(req: Request, res: Response) {
  try {
    let gallery = await Gallery.find({});

    if (!gallery) {
      res.status(404).json({
        msg: "No gallery content found in db",
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
