import { Document, Model } from 'mongoose';

import { Plugins } from '/models/plugins/types';


export interface WalletData {
  appMoney: number
  yourMoney: number
  winMoney: number
}

export interface User {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  wallet: number;
  walletData: WalletData
  referenceCode: string;
  referralCode: string;
  gender: string;
  image: string;
  isEmailVerified: boolean;
}

export interface UserBaseDocument extends User, Document {
  isPasswordMatch: (password: string) => Promise<boolean>;
  
}

export type UserDocument = UserBaseDocument;

export interface UserModel extends Model<UserDocument>, Plugins {
  isEmailTaken: (email: string, excludeUserId?: string) => Promise<boolean>;
  isPhoneNumberTaken: (isPhoneNumberTaken: string, excludeUserId?: string) => Promise<boolean>;
  isReferralCodeAvailable: (referralCode: string, excludeUserId?: string) => Promise<boolean>;
}
