export default (err, req, res, next) => {
  return res.status(err.statusCode).json({error: JSON.parse(err.message), code: err.statusCode});
}