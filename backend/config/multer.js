import multer from 'multer'
import path from 'path'
import crypto from 'crypto'


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(10, (err, bytes) => {
            const fn = bytes.toString('hex') + path.extname(file.originalname)
            cb(null, fn)
        })
    }
});
export const upload = multer({ storage });