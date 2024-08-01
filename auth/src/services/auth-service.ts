import { generateJWT } from "../utils/jwt";
import sequelize from "../common/database/sequelize"
import * as bcrypt from 'bcryptjs';

export const authenticateUser = async (credential: {email: string, password: string}) => {
  const userInfo = await sequelize.models.Users.findOne({
    attributes: {
      exclude: ['deleted_at'], 
    },
    where: { email: credential.email }
  });
  if(!userInfo){
    return {code: 422, message: 'User not found'};
  }

  if(!bcrypt.compareSync(credential.password, userInfo.dataValues.password)){
    return {code: 422, message: 'Invalid password'};
  }

  delete userInfo.dataValues.password;

  const {token, expires} = generateJWT(process.env.JWT_SECRET, {user: userInfo});
  
  return {data: userInfo, token: {access: token, expires}};
}