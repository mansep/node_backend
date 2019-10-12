import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        title: {
            type: String,
        },
        email: {
            type: String,
        },
        username: {
            type: String,
            unique: true,
        },
        photo: {
            type: String,
        },
        password: {
            type: String,
        },
        role: {
            type: String,
        },
        status: {
            type: String,
        },
        lastlogin: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model('User', userSchema)
