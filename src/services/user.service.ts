import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { AddSocialsDto } from 'src/dto/user/add-socials.dto';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { Role } from 'src/entities/role.entity';
import { SocialNetwork } from 'src/entities/social-network.entity';
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
    const user = await User.findOne(id);
    Object.assign(user, updateUserDto);
    return user.save();
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

  async addSocials(userId: number, social: AddSocialsDto) {
    let user = await User.findOne(userId);
    const socials = SocialNetwork.create(social);

    if(!user.socials) {
      user.socials = [socials]
    } else {
      user.socials.push(socials);
    }

    user.save();

    return user;
  }
}
