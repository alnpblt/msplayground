import { authenticateUser } from "../services/auth-service";
import { RoutePayload } from "../lib/rabbitmq";

export const handleAuthenticateRoute = async ({response, body}: RoutePayload) => {
  try{
    var res = await authenticateUser(body);
    return response({response: res});
  }catch(error){
    console.log(error);
    return response({err: res});
  }
}