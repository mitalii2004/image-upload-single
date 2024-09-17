const path = require("path");
const express = require("express");
const multer = require("multer");
const fs = require("fs");

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();
const PORT = 8000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Updated to use the correct directory
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("homepage");
});

app.post("/uploads", upload.single("profileImage"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  res.redirect("/");
});

// Improved error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
