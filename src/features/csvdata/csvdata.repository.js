import mongoose from "mongoose";
import { csvdataSchema } from "./csvdata.schema.js";

//Making model based on csvdataSchema
const CsvdataModel = mongoose.model("Csvdata", csvdataSchema);

export default class CsvdataRepository {
  async add(data) {
    try {
      console.log(data);
      const addedRecords = await CsvdataModel.insertMany(data);
      const resp = {
        success: true,
        res: addedRecords,
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
