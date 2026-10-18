const { randomUUID } = require('crypto');
const path = require('path');
const { del, put } = require('@vercel/blob');

async function uploadImage(file, folder) {
  const extension = path.extname(file.originalname).toLowerCase();
  const blob = await put(`${folder}/${randomUUID()}${extension}`, file.buffer, {
    access: 'public',
    contentType: file.mimetype
  });

  return blob.url;
}

async function deleteImage(url) {
  if (typeof url !== 'string' || !url.startsWith('https://')) {
    return;
  }

  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'https:' || !parsedUrl.hostname.endsWith('.public.blob.vercel-storage.com')) {
    return;
  }

  await del(url);
}

async function removeImage(url) {
  try {
    await deleteImage(url);
  } catch (err) {
    console.error('Failed to remove image from Vercel Blob:', err.message);
  }
}

module.exports = { uploadImage, removeImage };
