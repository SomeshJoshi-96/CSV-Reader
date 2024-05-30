import mongoose from "mongoose";
import { csvSchema } from "./csv.schema.js";
// creating model from schema.
export const CsvModel = mongoose.model("Csv", csvSchema);

export default class CsvRepository {
  async createCsv(data) {
    console.log(data);
    try {
      // create instance of model.
      let newCsv = new CsvModel(data);
      newCsv = await newCsv.save();
      const resp = {
        success: true,
        res: newCsv,
      };
      return resp;
    } catch (err) {
      let resp;
      if (err.name === "ValidationError") {
        resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "Validation Error",
            errors: err.errors,
          },
        };
      } else {
        resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: err.message,
          },
        };
      }
      return resp;
    }
  }

  async delete(id) {
    try {
      console.log(id);
      const csv = await CsvModel.findByIdAndDelete(id);
      if (!csv) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "No csv with such id exists!",
          },
        };
        return resp;
      }

      const resp = {
        success: true,
        res: csv,
      };

      return resp;
    } catch (err) {
      const resp = {
        success: false,
        error: {
          statusCode: 400,
          msg: err.message,
        },
      };
      return resp;
    }
  }

  async getAll() {
    try {
      const allCsvs = await CsvModel.find();
      const resp = {
        success: true,
        res: allCsvs,
      };
      return resp;
    } catch (err) {
      const resp = {
        success: false,
        error: {
          statusCode: 400,
          msg: err.message,
        },
      };
      return resp;
    }
  }

  async getOne(id) {
    try {
      const csv = await CsvModel.findById(id);
      if (!csv) {
        const resp = {
          success: false,
          error: {
            statusCode: 400,
            msg: "No csv with such id exists!",
          },
        };
        return resp;
      }

      const resp = {
        success: true,
        res: csv,
      };

      return resp;
    } catch (err) {
      const resp = {
        success: false,
        error: {
          statusCode: 400,
          msg: err.message,
        },
      };
      return resp;
    }
  }
}
