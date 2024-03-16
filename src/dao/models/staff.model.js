import { model, Schema } from "mongoose";

let collection = "Staff";
let schema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, require: true },
  email: { type: String, unique: true, index: true, required: true },
  age: { type: Number },
  password: { type: String, required: true },
  role: { type: Number, default: 0 },
});
let Staff = model(collection, schema);
export default Staff;
