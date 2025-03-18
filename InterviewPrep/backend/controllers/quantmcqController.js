const MCQ = require("../models/QuantMCQModel");

exports.createMCQ = async (req, res) => {
  try {
    const newMCQ = new MCQ(req.body);
    await newMCQ.save();
    res.status(201).json({ message: "MCQ added successfully!", data: newMCQ });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMCQs = async (req, res) => {
    try {
        let filter = {};
        if (req.query.category) {
            const categories = req.query.category.split(",").map(cat => cat.trim());
            filter = { category: { $in: categories } }; 
        }

        console.log("Fetching MCQs with filter:", JSON.stringify(filter)); 

        const mcqs = await MCQ.find(filter);
        console.log("MCQs found:", mcqs.length); 

        res.json(mcqs);
    } catch (error) {
        console.error("Error fetching MCQs:", error);
        res.status(500).json({ error: error.message });
    }
};



exports.getMCQById = async (req, res) => {
  try {
    const mcq = await MCQ.findById(req.params.id);
    if (!mcq) return res.status(404).json({ error: "MCQ not found" });
    res.json(mcq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMCQ = async (req, res) => {
  try {
    const updatedMCQ = await MCQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMCQ) return res.status(404).json({ error: "MCQ not found" });
    res.json({ message: "MCQ updated successfully", data: updatedMCQ });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMCQ = async (req, res) => {
  try {
    const deletedMCQ = await MCQ.findByIdAndDelete(req.params.id);
    if (!deletedMCQ) return res.status(404).json({ error: "MCQ not found" });
    res.json({ message: "MCQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
