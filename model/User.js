import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'give a username'],
            unique: true,
            lowercase: true,
        },
        password: { type: String, required: true, minlength: 4 },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
