export default class InternalServer extends Error {
  constructor(message, error = null){
    super(JSON.stringify(message), {cause: error});
    this.statusCode = 500;
  }
}