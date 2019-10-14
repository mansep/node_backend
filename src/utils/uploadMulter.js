import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
})

const s3 = new AWS.S3()

const uploadMulter = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname })
        },
        key: function(req, file, cb) {
            // forzamos nombre por id para evitar tener más de una imagen por usuario
            cb(null, 'profile/'.concat(req.user.id.concat('.jpg')))
        },
    }),
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
    fileFilter: function(req, file, cb) {
        console.log(file)
        const filetypes = /jpeg|jpg|png|gif/
        const mimetype = filetypes.test(file.mimetype)

        if (mimetype) {
            return cb(null, true)
        } else {
            cb('Solo puede cargar imagenes')
        }
    },
})

export default uploadMulter
