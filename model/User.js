import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please give a username'],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Please give a username'],
            minlength: [4, 'Please give a password greater than 3 characters'],
        },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
