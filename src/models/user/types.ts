import { Document, Model } from 'mongoose';
import { Plugins } from '/models/plugins/types';

export interface User {
  name: string;
  email: string;
  password: string;
  role: string;
  isEmailVerified: boolean;
}

export interface UserBaseDocument extends User, Document {
  isPasswordMatch: (password: string) => Promise<boolean>;
}

export interface UserDocument extends UserBaseDocument {}

export interface UserModel extends Model<UserDocument>, Plugins {
  isEmailTaken: (email: string, excludeUserId?: string) => Promise<boolean>;
}
