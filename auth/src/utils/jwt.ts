import * as jwt from 'jsonwebtoken';

/**
 * Generate JWT token using HS256 algo.
 *
 * @param {string} secret - Secret key to use in encryption.
 * @param {object} payload - Payload to embed in the token.
 * @param {object=} options
 * @param {string} options.issuer - Token issuer
 * @param {string} options.subject - Token subject
 * @param {string} options.audience - Token audience
 * @param {number} options.expiresIn - Minutes till the token expire.
 * @returns {{token: string, expires: number}}
 */
export const generateJWT = (secret: jwt.Secret, payload: string | object, options: jwt.SignOptions = {}): { token: string; expires: number } => {
  
  const expInMinute = options.expiresIn !== undefined ? Number(options.expiresIn) : 60;
  let expiresIn = Math.floor(Date.now() / 1000) + 60 * expInMinute;
  const signOptions = {
    issuer: options.issuer || 'app',
    subject: options.subject || 'authentication',
    audience: options.audience || 'user',
    expiresIn: expiresIn - Math.floor(Date.now() / 1000),
    algorithm: <jwt.Algorithm>'RS512',
  };

  if (options?.expiresIn === 0) {
    expiresIn = null;
    delete signOptions.expiresIn;
  }
  
  const token = jwt.sign(payload, secret, signOptions);

  return { token: token, expires: expiresIn };
};

export const verifyJWT = (token: string, secret: jwt.Secret) => jwt.verify(token, secret);
