import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { NextHandler } from 'next-connect';

interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

interface UploadResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (err) {
        cb(err as Error, uploadDir);
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `img-${uniqueSuffix}${ext}`);
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, 
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, WebP)'));
    }
  }
});


const multerMiddleware = (
  req: NextApiRequestWithFile,
  res: NextApiResponse<UploadResponse>,
  next: NextHandler
) => {
  upload.single('image')(req as any, res as any, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
    next();
  });
};

const router = createRouter<NextApiRequestWithFile, NextApiResponse<UploadResponse>>();
router.use(multerMiddleware);

router.post((req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'No file uploaded'
    });
  }

  res.status(200).json({
    success: true,
    imageUrl: `/uploads/${req.file.filename}`
  });
});

export default router.handler();

export const config = {
  api: {
    bodyParser: false
  }
};