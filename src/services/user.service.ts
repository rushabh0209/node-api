import httpStatus from 'http-status';

import User from 'models/user';

import ApiError from 'utils/ApiError';

export const createUser = async (userBody: any) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  if (await User.isPhoneNumberTaken(userBody.phoneNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already taken');
  }

  if (userBody.referralCode && !(await User.isReferralCodeAvailable(userBody.referralCode))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Referral code is not available');
  }

  return User.create(userBody);
};

export const queryUsers = async (filter: any, options: any) => {
  const users = await User.paginate(filter, options);
  return users;
};

export const getUserById = async (id: any) => {
  return User.findById(id);
};

export const getUserByEmail = async (email: string) => {
  return User.findOne({ email });
};


export const getUserByPhoneNumber = async (phoneNumber: string) => {
  return User.findOne({ phoneNumber });
};

export const updateUserById = async (userId: any, updateBody: any) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.phoneNumber && (await User.isPhoneNumberTaken(updateBody.phoneNumber, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

export const deleteUserById = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
