//importing necessary libraries
import CsvdataRepository from "../csvdata/csvdata.repository.js";
import csv from "fast-csv";
import fs from "fs";
import path from "path";
import { customErrorHandler } from "../../middlewares/errorHandler.js";
import CsvRepository from "./csv.repository.js";
import { CsvModel } from "./csv.repository.js";
//Creating new csvdararepository object
const csvdatarepository = new CsvdataRepository();
const csvRepository = new CsvRepository();

//Creating class for Csv Controller
export default class CsvController {
  async getAll(req, res, next) {
    try {
      const resp = await csvRepository.getAll();
      res.status(200).render("csvReaderhomepage", { csvs: resp.res });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req, res, next) {
    try {
      const resp = await csvRepository.getOne(req.params.id);
      if (resp.success) {
        // res.status(201).json({
        //   success: true,
        //   msg: "Csv file fetched successfully",
        //   res: resp.res,
        // });
        console.log(resp.res.csvData);
        res
          .status(200)
          .render("csvReaderdatapage", { csvData: resp.res.csvData });
      } else {
        if (resp.error.msg) {
          throw new customErrorHandler(resp.error.statusCode, resp.error.msg);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      next(err);
    }
  }

  async upload(req, res, next) {
    const allRecords = [];
    try {
      console.log("here", req.body);
      const name = req.body.name;
      const description = req.body.description;
      const author = req.body.author;
      let filename;

      if (!req.file) {
        filename = "";
      } else {
        filename = req.file.filename;
      }

      let resp1 = await csvRepository.createCsv({
        name,
        description,
        author,
        filename,
      });

      if (resp1.success) {
        try {
          fs.createReadStream(
            path.join("./", "./", "public/csvfiles/" + req.file.filename)
          )
            .pipe(csv.parse({ headers: true }))
            .on("error", (err) => {
              throw new customErrorHandler(400, err.message);
            })
            .on("data", (row) => {
              const parsedRow = {};
              for (const key in row) {
                parsedRow[key] = convertType(row[key]);
              }
              allRecords.push(parsedRow);
            })
            .on("end", async (rowCount) => {
              try {
                console.log(rowCount);
                const resp2 = await csvdatarepository.add(allRecords);
                if (resp2.success) {
                  console.log(resp2.res);
                  console.log("here");
                  let csv = await CsvModel.findById(resp1.res._id);
                  csv.csvData = resp2.res;
                  csv = await csv.save();
                  res.status(201).json({
                    success: true,
                    msg: "Csv file added successfully",
                    res: csv,
                  });
                }
              } catch (err) {
                next(err);
              }
            });
        } catch (err) {
          next(err);
        }
      } else {
        if (resp1.error.msg) {
          console.log(resp1);
          if (resp1.error) {
            res.status(400).json({
              success: false,
              msg: "Validation Errors",
              res: resp1.error.errors,
            });
          } else {
            throw new customErrorHandler(
              resp1.error.statusCode,
              resp1.error.msg
            );
          }
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    const id = req.params.id;
    try {
      const resp = await csvRepository.delete(id);
      if (resp.success) {
        res.status(201).json({
          success: true,
          msg: "Csv file deleted successfully",
          res: resp.res,
        });
      } else {
        if (resp.error.msg) {
          throw new customErrorHandler(resp.error.statusCode, resp.error.msg);
        } else {
          throw new Error();
        }
      }
    } catch (err) {
      next(err);
    }
  }
}

//Function to check the value of the keys type
function convertType(value) {
  // Check if the value can be converted to a number
  if (!isNaN(value) && value.trim() !== "") {
    return parseFloat(value);
  }

  // Check if the value can be converted to a Date
  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Check if the value is a boolean (true/false)
  if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
    return value.toLowerCase() === "true";
  }

  // If none of the above, return the value as a string
  return value;
}
