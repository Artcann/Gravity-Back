import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  
  async create(createUserDto: CreateUserDto) {
    const user = User.create(createUserDto);
    await user.save();

    delete user.password;
    return user;
  }

  async findOne(email: string): Promise<User | undefined> {
    return User.findOne({email: email});
  }
}
