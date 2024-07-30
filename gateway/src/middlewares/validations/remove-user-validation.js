import { body, oneOf, param } from 'express-validator';

export default [
  param('user_id')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('User id is required.')
    .isNumeric({
      no_symbols: true,
    }),
];
