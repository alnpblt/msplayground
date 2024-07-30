import {InternalServer, RpcException} from '../exceptions/index.js';
import {nestjsMessage} from '../lib/rabbitmq.js';

export const handleGetUserListRoute = async (req, res) => {
	try{
		var {content: getUsers} = await req.app.broker.send(nestjsMessage(req.body, 'getUsers'), 'users_service');
    console.log(getUsers);
	}catch(error){
		throw new InternalServer('Error occured on getUsers', error);
	}

  getUsers = JSON.parse(getUsers);
  if(getUsers.err !== undefined){
    throw new RpcException(getUsers.err.message, getUsers.err.code);
  }
  return res.status(200).json(getUsers.response);
}

export const handleCreateUserRoute = async (req, res) => {
	try{
		var {content: createUser} = await req.app.broker.send(nestjsMessage(req.body, 'createUser'), 'users_service');
    console.log(createUser);
	}catch(error){
		throw new InternalServer('Error occured on createUser', error);
	}

  createUser = JSON.parse(createUser);
  if(createUser.err !== undefined){
    throw new RpcException(createUser.err.message, createUser.err.code);
  }
  return res.status(201).json(createUser.response.data);
}

export const handleRemoveUserRoute = async (req, res) => {
	try{
		var {content: removeUser} = await req.app.broker.send(nestjsMessage(req.params.user_id, 'removeUser'), 'users_service');
	}catch(error){
		throw new InternalServer('Error occured on removeUser', error);
	}
  removeUser = JSON.parse(removeUser);
  if(removeUser.err !== undefined){
    throw new RpcException(removeUser.err.error, removeUser.err.code);
  }
  return res.json({message: removeUser.response.message});
}