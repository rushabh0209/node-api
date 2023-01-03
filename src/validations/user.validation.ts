import Joi from 'joi';

import { objectId, password, phoneNumber } from './custom.validation';

export const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    phoneNumber: Joi.string().required().custom(phoneNumber),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
    referralCode: Joi.string()
  })
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId)
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      phoneNumber: Joi.string().custom(phoneNumber),
      gender: Joi.string().valid('male', 'female'),
      image: Joi.string(),
      name: Joi.string()
    })
    .min(1)
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId)
  })
};
