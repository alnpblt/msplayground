export const USERS_SERVICE = 'USERS_SERVICE';
export const AUTH_SERVICE = 'AUTH_SERVICE';


export const SERVICES_ROUTES = {
  [USERS_SERVICE]: {
    CREATE_USER: 'createUser',
    REMOVE_USER: 'removeUser',
    GET_USERS: 'getUsers'
  },
  [AUTH_SERVICE]: {
    AUTHENTICATE: 'authenticate',
  },
}