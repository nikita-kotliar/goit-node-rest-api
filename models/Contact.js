import mongoose, { Schema } from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user", 
    },
  },
  { versionKey: false } 
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
