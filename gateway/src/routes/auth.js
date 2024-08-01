import express from 'express';
import validateInput from '../middlewares/validate-input.js';
import * as authController from '../controllers/auth-controller.js';
import authenticateValidation from '../middlewares/validations/authenticate-validation.js';

const router = express.Router();

router.post('/authenticate', validateInput(authenticateValidation), authController.handleAuthenticateRoute);


export default router;