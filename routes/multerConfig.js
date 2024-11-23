const multer = require('multer');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Para onde as imagens vão
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // File name after upload (timestamp + original name)
    }
});

// File filter for accepting only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

// Multer instance with configuration
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;

