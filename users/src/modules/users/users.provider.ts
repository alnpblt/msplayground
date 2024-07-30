import { Users } from './entities/users.entity';

export const usersProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: Users,
  },
];
