//Creation of CSV Data Schema with flexible fields

//importing necessary modules
import mongoose from "mongoose";
import { csvdataSchema } from "../csvdata/csvdata.schema.js";

export const csvSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Name must be at least 3 characters long."],
    required: [true, "Name is required."],
  },
  description: {
    type: String,
    minlength: [5, "Description must be at least 10 characters long."],
    required: [true, "Description is required."],
  },
  author: {
    type: String,
    minlength: [5, "Author name must be at least 5 characters long."],
    required: [true, "Author is required."],
  },

  filename: {
    type: String,
    required: [true, "File is required."],
  },

  csvData: {
    type: [csvdataSchema],
  },
});
