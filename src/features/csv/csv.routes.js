//importing necessary libraries
import express from "express";
import CsvController from "./csv.controller.js";
import { uploadFile } from "../../middlewares/fileUpload.middleware.js";

//creating new csv route object
export const csvRouter = new express.Router();

//creating new csv contoller object
const csvController = new CsvController();

//All paths to csv

csvRouter.get("/", (req, res, next) => {
  csvController.getAll(req, res, next);
});

csvRouter.get("/:id", (req, res, next) => {
    csvController.getOne(req, res, next);
  });

csvRouter.post("/upload", uploadFile.single("file"), (req, res, next) => {
  csvController.upload(req, res, next);
});

csvRouter.delete("/delete/:id", (req, res, next) => {
  csvController.delete(req, res, next);
});
