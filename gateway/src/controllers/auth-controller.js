import {InternalServer, RpcException} from '../exceptions/index.js';
import {AUTH_SERVICE, SERVICES_ROUTES} from '../constants/services.js';

export const handleAuthenticateRoute = async (req, res) => {
	try{
		var {content: authenticate} = await req.app.broker.send(JSON.stringify({route: SERVICES_ROUTES[AUTH_SERVICE].AUTHENTICATE, data: req.body}), AUTH_SERVICE);
	}catch(error){
		throw new InternalServer(`Error occured on ${SERVICES_ROUTES[AUTH_SERVICE].AUTHENTICATE}`, error);
	}

  authenticate = JSON.parse(authenticate);
  if(authenticate.err !== undefined){
    throw new RpcException(authenticate.err.message, authenticate.err.code);
  }

  return res.status(201).json(authenticate.response);
}