import cloudinary from '../config/cloudinary.js';

export class CloudinaryHelper {
    static uploadImageBuffer = (buffer) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'graphora_templates' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve({
                        url: result.secure_url,
                        public_id: result.public_id
                    }); 
                }
            );
            stream.end(buffer);
        });
    }

    static deleteImage = async(public_id) => {
        try {
            await cloudinary.uploader.destroy(public_id);
        } catch (error) {
            console.error("Error al borrar imagen huérfana en Cloudinary:", error);
        }
    }

    static getPublicIdFromUrl = (url) => {
        if (!url) return null;
        const parts = url.split('/');
        const filename = parts.pop().split('.')[0]; 
        const folder = parts.pop(); 
        return `${folder}/${filename}`;
    }
}

