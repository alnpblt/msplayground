import Unauthorized from '../exceptions/unauthorized.js';
import { verifyJWT } from '../utils/jwt.js';


export default (req, res, next) => {
  const authorization = req.headers?.authorization;
  if (authorization === undefined) {
    throw new Unauthorized('Unable to verify auth.');
  }
  try {
    const verifyToken = verifyJWT(authorization.includes(' ') ? authorization?.split(' ')[1] : authorization, process.env.JWT_SECRET);

    req.auth = verifyToken.data;

    return next();
  } catch (error) {
    console.log(error);
    throw new Unauthorized(error?.message);
  }
};
