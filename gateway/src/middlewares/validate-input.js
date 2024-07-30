import BadRequest from "../exceptions/bad-request.js";

export default (validations) => {
  return async (req, res, next) => {
    for(const validation of validations) {
      const result = await validation.run(req);
      if(result.errors.length){
        throw new BadRequest(result.errors);
      }
    }
    next();
  };
}