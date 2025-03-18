const express = require("express");
const router = express.Router();
const mcqController = require("../controllers/quantmcqController");

router.post("/", mcqController.createMCQ);
router.get("/", mcqController.getMCQs);
router.get("/:id", mcqController.getMCQById);
router.put("/:id", mcqController.updateMCQ);
router.delete("/:id", mcqController.deleteMCQ);

module.exports = router;
