import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Users } from 'src/modules/users/entities/users.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: <Dialect>process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        logging: false,
        timezone: '+00:00',
        define: {
          charset: 'utf8',
          timestamps: true,
          underscored: true,
          freezeTableName: true,
          paranoid: true,
          deletedAt: 'deleted_at',
          createdAt: 'created_at',
          updatedAt: 'updated_at',
        },
      });
      sequelize.addModels([Users]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
