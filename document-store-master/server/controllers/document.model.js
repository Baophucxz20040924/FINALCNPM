const documentModel = require('../models/document.model');

module.exports = {
  createDocument: async (req, res) => {
    const body = req.body;
    const file = req.files['file'][0];
    body.link = file.filename;

    const imagesFile = req.files['img'];

    const images = imagesFile.map((img) => img.filename);

    body.images = images;

    const doc = await documentModel.create(body);

    return res.status(201).json(doc);
  },
  getDocument: async (req, res) => {
    const title = req.query.title;
    const bodyQuery = {};
    if (title) {
      bodyQuery.title = {
        $regex: `.*${title}.*`,
        $options: 'i',
      };
    }
    const documents = await documentModel
      .find(bodyQuery)
      .sort({ createdAt: -1 });

    return res.status(200).json(documents);
  },
  deleteDocument: async (req, res) => {
    const document_id = req.params.document_id;

    const deletedDoc = await documentModel.findByIdAndDelete(document_id);

    return res.status(200).json(deletedDoc);
  },
  getDocumentById: async (req, res) => {
    const doc_id = req.params.document_id;
    const doc = await documentModel.findById(doc_id);

    return res.status(200).json(doc);
  },
};
