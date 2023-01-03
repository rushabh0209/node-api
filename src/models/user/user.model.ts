import bcrypt from 'bcryptjs';
import moment from 'moment';
import { model, Schema } from 'mongoose';
import validator from 'validator';

import { roles } from 'config/roles';

import { paginate, toJSON } from 'models/plugins';

import { UserDocument, UserModel } from './types';

const UserWalletDataSchema = new Schema(
  {
    appMoney: {
      type: Number,
      default: 0
    },
    yourMoney: {
      type: Number,
      default: 0
    },
    winMoney: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
);

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      }
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value: string) {
        if (!validator.isMobilePhone(value)) {
          throw new Error('Invalid phone number');
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true
    },
    role: {
      type: String,
      enum: roles,
      default: 'user'
    },
    gender: {
      type: String,
      enum: ['male', 'female', null],
      default: null
    },
    image: {
      type: String,
      default: null
    },
    wallet: {
      type: Number,
      default: 0
    },
    walletData: {
      type: UserWalletDataSchema,
      default: {}
    },
    referenceCode: {
      type: String,
      unique: true,
      default: `U${+moment().format('x').toString()}`
    },
    referralCode: {
      type: String,
      default: null
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

UserSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
  const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
  return !!user;
};

UserSchema.statics.isReferralCodeAvailable = async function (referenceCode, excludeUserId) {
  const user = await this.findOne({ referenceCode, _id: { $ne: excludeUserId } });
  return !!user;
};

UserSchema.methods.isPasswordMatch = async function (password: any) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = model<UserDocument, UserModel>('User', UserSchema);

export default User;
