
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password?: string; // Optional for OAuth
    avatar?: string;
    role: 'user' | 'admin';
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, {
    timestamps: true
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
