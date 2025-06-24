import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../config/s3';

const upload = multer({
  storage: multerS3({
    s3: s3 as any,
    bucket: process.env.AWS_BUCKET_NAME!,
    // acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Optional: 5MB max file size
  },
});

export default upload;
