import { Controller, UseFilters } from '@nestjs/common';
import {
  BaseRpcExceptionFilter,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { GetUsersDto } from './dto/get-users-dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('createUser')
  createUser(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @MessagePattern('getUsers')
  async getUsers(@Payload() getUsersDto: GetUsersDto) {
    return this.usersService.getUsers(getUsersDto);
  }

  @MessagePattern('updateUser')
  updateUser(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  async removeUser(@Payload() id: number) {
    return await this.usersService.removeUser(id);
  }
}
