const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

const {uploadDocument} = require("../controllers/documentController");

router.post("/upload",authMiddleware,upload.single("file"),uploadDocument)

module.exports = router;