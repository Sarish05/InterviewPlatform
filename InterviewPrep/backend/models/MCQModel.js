const mongoose = require("mongoose");

const MCQSchema = new mongoose.Schema({
  category: { type: String, required: true }, 
  question: { type: String, required: true },
  options: [{ type: String, required: true }], 
  answer: { type: String, required: true }, 
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("mcqs", MCQSchema);