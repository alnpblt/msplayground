import { Sequelize } from "sequelize-typescript";
import * as sequelizeConfig from "../../config/sequelize.config";

export default new Sequelize(sequelizeConfig.settings);