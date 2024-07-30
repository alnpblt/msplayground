import Logger from "../utils/logger.js";

export default (req, res, next) => {
  req.app.logger = new Logger({moduleName: 'APP'})
  next();
}