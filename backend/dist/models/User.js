import mongoose, { Document, Schema } from 'mongoose';
const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, {
    timestamps: true
});
const User = mongoose.model('User', UserSchema);
export default User;
