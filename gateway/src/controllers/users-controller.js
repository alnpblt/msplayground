import {InternalServer, RpcException} from '../exceptions/index.js';
import {nestjsMessage} from '../lib/rabbitmq.js';
import {USERS_SERVICE, SERVICES_ROUTES} from '../constants/services.js';

export const handleGetUserListRoute = async (req, res) => {
	try{
		var {content: getUsers} = await req.app.broker.send(nestjsMessage(req.query, SERVICES_ROUTES[USERS_SERVICE].GET_USERS), USERS_SERVICE);
	}catch(error){
		throw new InternalServer(`Error occured on ${SERVICES_ROUTES[USERS_SERVICE].GET_USERS}`, error);
	}

  getUsers = JSON.parse(getUsers);
  if(getUsers.err !== undefined){
    throw new RpcException(getUsers.err.message, getUsers.err.code);
  }

  return res.json(getUsers.response);
}

export const handleCreateUserRoute = async (req, res) => {
	try{
		var {content: createUser} = await req.app.broker.send(nestjsMessage(req.body, SERVICES_ROUTES[USERS_SERVICE].CREATE_USER), USERS_SERVICE);
	}catch(error){
		throw new InternalServer(`Error occured on ${SERVICES_ROUTES[CREATE_USER].GET_USERS}`, error);
	}

  createUser = JSON.parse(createUser);
  if(createUser.err !== undefined){
    throw new RpcException(createUser.err.message, createUser.err.code);
  }

  delete createUser.response.data.password;
  delete createUser.response.data.deleted_at;

  return res.status(201).json(createUser.response.data);
}

export const handleRemoveUserRoute = async (req, res) => {
	try{
		var {content: removeUser} = await req.app.broker.send(nestjsMessage(req.params.user_id, SERVICES_ROUTES[USERS_SERVICE].REMOVE_USER), USERS_SERVICE);
    
	}catch(error){
		throw new InternalServer(`Error occured on ${SERVICES_ROUTES[USERS_SERVICE].REMOVE_USER}`, error);
	}
  removeUser = JSON.parse(removeUser);

  if(removeUser.err !== undefined){
    throw new RpcException(removeUser.err.message, removeUser.err.code);
  }
  return res.json({message: removeUser.response.message});
}