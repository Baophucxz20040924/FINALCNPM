const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

const {
  createDocument,
  getDocument,
  deleteDocument,
  getDocumentById,
} = require('../controllers/document.model');

router
  .route('/')
  .get(getDocument)
  .post(
    upload.fields([
      { name: 'file', maxCount: 1 },
      { name: 'img', maxCount: 5 },
    ]),
    createDocument,
  );

router.route('/:document_id').delete(deleteDocument).get(getDocumentById);

module.exports = router;
