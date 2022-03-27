import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  
  async create(createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLocaleLowerCase();

    const user = User.create(createUserDto);

    const baseRole = await Role.findOne({roleLabel : RoleEnum.User});

    user.role = [baseRole];
    await user.save();

    delete user.password;
    return user;
  }

  async findOne(email: string): Promise<User | undefined> {
    return User.findOne({email: email.toLocaleLowerCase()});
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return User.update(id, updateUserDto);
  }

  async addDeviceToken(userId: number, deviceToken: string) {
    let user = await User.findOne(userId);

    if(!user.deviceToken) {
      user.deviceToken = [deviceToken]
    } else {
      user.deviceToken.push(deviceToken);
    }

    user.save();

    return user;
  }
}
