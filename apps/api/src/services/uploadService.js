const multer = require('multer');
const sharp = require('sharp');
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/zip'];
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.zip'];

    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(extension)) {
      cb(null, true);
      return;
    }

    cb(new Error('Tipo de archivo no permitido.'));
  }
});

const uploadMiddleware = upload.single('media');
uploadMiddleware.single = (fieldName) => upload.single(fieldName);

const ensureUploadsDir = async () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

const sanitizeFilename = (originalname) => {
  const ext = path.extname(originalname).toLowerCase();
  const basename = path.basename(originalname, ext).replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${crypto.randomBytes(8).toString('hex')}-${basename}${ext}`;
};

const processMedia = async (file) => {
  if (!file) return null;

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error('El archivo supera el límite de 10MB.');
  }

  const uploadsDir = await ensureUploadsDir();
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (file.mimetype === 'application/zip' || fileExtension === '.zip') {
    // Handling zip files with zip-slip protection
    const zip = new AdmZip(file.buffer);
    const zipEntries = zip.getEntries();
    const mediaUrls = [];

    const extractDir = path.join(uploadsDir, crypto.randomBytes(16).toString('hex'));
    await fs.mkdir(extractDir, { recursive: true });

    for (const zipEntry of zipEntries) {
      if (!zipEntry.isDirectory) {
        // Zip-slip protection: resolve path and ensure it's within extractDir
        const targetPath = path.resolve(extractDir, zipEntry.entryName);
        if (!targetPath.startsWith(path.resolve(extractDir))) {
          throw new Error('Zip slip vulnerability detected.');
        }

        const ext = path.extname(zipEntry.entryName).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          const entryData = zipEntry.getData();
          
          const filename = `${crypto.randomBytes(16).toString('hex')}.webp`;
          const finalPath = path.join(uploadsDir, filename);

          // Resize and convert to webp using sharp
          await sharp(entryData)
            .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(finalPath);
          
          mediaUrls.push(`/uploads/${filename}`);
        }
      }
    }
    
    // Cleanup temporary extraction dir if needed (we didn't extract directly, we just processed buffer)
    await fs.rm(extractDir, { recursive: true, force: true });
    
    return mediaUrls.length > 0 ? JSON.stringify(mediaUrls) : null;
  }

  // Handle single image
  if (file.mimetype.startsWith('image/')) {
    const filename = `${crypto.randomBytes(16).toString('hex')}.webp`;
    const finalPath = path.join(uploadsDir, filename);

    await sharp(file.buffer)
      .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(finalPath);

    return `/uploads/${filename}`;
  }

  // Other files (like videos, handled simply without sharp)
  const filename = sanitizeFilename(file.originalname);
  const finalPath = path.join(uploadsDir, filename);
  await fs.writeFile(finalPath, file.buffer);
  
  return `/uploads/${filename}`;
};

module.exports = {
  uploadMiddleware,
  processMedia
};
