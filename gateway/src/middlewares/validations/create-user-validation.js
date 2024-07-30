import { body, oneOf, param } from 'express-validator';

export default [
  // body('first_name')
  //   .trim()
  //   .exists({ values: 'falsy' })
  //   .withMessage('First name is required.')
  //   .isString(),
  body('last_name')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Last name is required.')
    .isString(),
  body('email')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Email is required.')
    .isString()
    .isEmail()
    .withMessage('Invalid email address.'),
  body('password')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Password is required.')
    .isString()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage('Password must be at least 8 characters long and have at least 1 upper case, 1 lower case, 1 special character and 1 numeric.'),
];
