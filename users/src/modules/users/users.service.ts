import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { Users } from './entities/users.entity';
import { RpcException } from '@nestjs/microservices';
import { GetUsersDto } from './dto/get-users-dto';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private usersRepository: typeof Users,
    private amqpConnection: AmqpConnection,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<{ data: Users }> {
    const checkUser = await this.usersRepository.count({
      where: { email: createUserDto.email },
    });
    if (checkUser) {
      throw new RpcException({
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'User already exists',
      });
    }

    createUserDto.password = bcrypt.hashSync(
      createUserDto.password,
      bcrypt.genSaltSync(),
    );

    let userInfo = null;
    try {
      userInfo = await this.usersRepository.create({
        ...createUserDto,
      });
    } catch (error) {
      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unable to create user',
      });
    }

    this.amqpConnection.publish<Users>(
      process.env.DATA_EXCHANGE,
      `${process.env.DATA_EXCHANGE_TOPIC}.createUser`,
      userInfo,
    );

    return { data: userInfo };
  }

  async getUsers(
    getUsersDto: GetUsersDto,
  ): Promise<{ data: Users[]; current_page: number; max_page: number }> {
    const filterWhere: WhereOptions = {};
    const filter: FindOptions = {
      attributes: { exclude: ['password', 'deleted_at'] },
      nest: true,
      limit: Number(process.env.MAX_PAGE_ITEMS),
      offset: 0,
    };

    if (getUsersDto.id !== undefined) {
      filterWhere.id = getUsersDto.id;
    }

    if (getUsersDto.email !== undefined) {
      filterWhere.email = getUsersDto.email;
    }

    if (getUsersDto.created_from !== undefined) {
      filterWhere.created_at = { [Op.gte]: getUsersDto.created_from };
      if (getUsersDto.created_to !== undefined) {
        filterWhere.created_at = {
          ...filterWhere.created_at,
          [Op.lte]: getUsersDto.created_to,
        };
      }
    }

    if (getUsersDto.page_items !== undefined) {
      filter.limit = Math.min(
        getUsersDto.page_items,
        Number(process.env.MAX_PAGE_ITEMS),
      );
    }

    if (getUsersDto.page !== undefined) {
      filter.offset =
        Math.max(getUsersDto.page, Number(process.env.DEFAULT_PAGE)) *
          filter.limit -
        filter.limit;
    }

    filter.where = filterWhere;

    let list = null;
    try {
      list = await this.usersRepository.findAndCountAll(filter);
    } catch (error) {
      console.log(error);
      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong while fetching users',
      });
    }

    if (list.rows.length === 0)
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: 'No users found',
      });

    return {
      data: list.rows,
      current_page: getUsersDto.page || Number(process.env.DEFAULT_PAGE),
      max_page: Math.ceil(list.count / filter.limit),
    };
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async removeUser(id: number): Promise<{ message: string }> {
    const checkUser = await this.usersRepository.count({
      where: { id },
    });
    if (checkUser) {
      throw new RpcException({
        code: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'User does not exist',
      });
    }

    let removeUser = null;
    try {
      removeUser = await this.usersRepository.destroy({ where: { id } });
    } catch (error) {
      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong whilee removing user',
      });
    }

    if (!removeUser) {
      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unable to remove user',
      });
    }

    return { message: 'User successfully removed' };
  }
}
