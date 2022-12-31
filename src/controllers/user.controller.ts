import httpStatus from 'http-status';
import { userService } from 'services';

import ApiError from 'utils/ApiError';
import catchAsync from 'utils/catchAsync';
import pick from 'utils/pick';

export const createUser = catchAsync(async (req: any, res: any) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

export const getUsers = catchAsync(async (req: any, res: any) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

export const getUser = catchAsync(async (req: any, res: any) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

export const updateUser = catchAsync(async (req: any, res: any) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

export const deleteUser = catchAsync(async (req: any, res: any) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});
