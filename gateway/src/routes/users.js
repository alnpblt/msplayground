import express from 'express';
import validateInput from '../middlewares/validate-input.js';
import createUserValidation from '../middlewares/validations/create-user-validation.js';
import removeUserValidation from '../middlewares/validations/remove-user-validation.js';
import * as usersController from '../controllers/users-controller.js';
import authorizeToken from '../middlewares/authorize-token.js';

const router = express.Router();

router.post('/', validateInput(createUserValidation), usersController.handleCreateUserRoute);

router.use(authorizeToken);

router.delete('/:user_id', validateInput(removeUserValidation), usersController.handleRemoveUserRoute);

router.get('/', usersController.handleGetUserListRoute);

export default router;