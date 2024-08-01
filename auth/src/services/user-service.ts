import { Users } from "../database/models";
import sequelize from "../common/database/sequelize"

export const createUser = async (user: Partial<Users>) => {
	try{
		await sequelize.models.Users.findOrCreate({
			where: {
				id: user.id
			},
			defaults: user
		})
	}catch(error){
		throw new Error('test', {cause: error});
	}
}

export const getUser = () => {
    return {
        name: 'John',
        age: 30
    }
}