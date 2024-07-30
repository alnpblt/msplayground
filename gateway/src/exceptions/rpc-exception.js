export default class RpcException extends Error {
  constructor(message, statusCode){
    super(JSON.stringify(message));
    this.statusCode = statusCode;
  }
}