import jwt from 'jsonwebtoken';

/**
 * Generate JWT token using HS256 algo.
 *
 * @param {string} secret - Secret key to use in encryption.
 * @param {object} payload - Payload to embed in the token.
 * @param {object=} options
 * @param {string} options.issuer - Token issuer
 * @param {string} options.sub - Token subject
 * @param {string} options.aud - Token audience
 * @param {number} options.expiration - Minutes till the token expire.
 * @returns {{token: string, expires: number}}
 */
export const generateJWT = (secret, payload, options = {}) => {
  const expInMinute = options?.expiration ?? 60;
  let expiresIn = Math.floor(Date.now() / 1000) + 60 * expInMinute;
  const signOptions = {
    issuer: options?.issuer || 'app',
    subject: options?.sub || 'authentication',
    audience: options?.aud || 'user',
    expiresIn: expiresIn - Math.floor(Date.now() / 1000),
    algorithm: 'HS256',
  };

  if (options?.expiration === 0) {
    expiresIn = null;
    delete signOptions.expiresIn;
  }

  const token = jwt.sign(payload, secret, signOptions);

  return { token: token, expires: expiresIn };
};

export const verifyJWT = (token, secret) => jwt.verify(token, secret);
