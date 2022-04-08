import { Injectable } from '@nestjs/common';
import { userInfo } from 'os';
import { AddSocialsDto } from 'src/dto/user/add-socials.dto';
import { CreateUserDto } from 'src/dto/user/create-user.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { GroupEnum } from 'src/entities/enums/group.enum';
import { RoleEnum } from 'src/entities/enums/role.enum';
import { Group } from 'src/entities/group.entity';
import { Role } from 'src/entities/role.entity';
import { SocialNetwork } from 'src/entities/social-network.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  
  async create(createUserDto: CreateUserDto) {
    createUserDto.email = createUserDto.email.toLocaleLowerCase();

    const user = User.create(createUserDto);

    const baseRole = await Role.findOne({roleLabel : RoleEnum.User});
    const defaultGroup = await Group.findOne({groupLabel: GroupEnum.DEFAULT});
    const customGroup = await Group.findOne({groupLabel: createUserDto.promo})

    user.role = [baseRole];
    user.groups = [defaultGroup, customGroup];

    console.log(createUserDto);

    if(createUserDto.first_name !== undefined) {
      user.first_name = createUserDto.first_name.charAt(0).toUpperCase() + createUserDto.first_name.slice(1).toLocaleLowerCase();
    }
    if(createUserDto.last_name !== undefined) {
      user.last_name = createUserDto.last_name.charAt(0).toUpperCase() + createUserDto.last_name.slice(1).toLocaleLowerCase();
    }
    await user.save();

    delete user.password;
    return user;
  }

  async findOneById(id: string) {
    return User.findOne(id);
  }

  async findOne(email: string): Promise<User | undefined> {
    return User.findOne({email: email.toLocaleLowerCase()});
  }

  getAll() {
    return User.find();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await User.findOne(id);
    Object.assign(user, updateUserDto);
    return user.save();
  }

  async updateDeviceToken(userId: number, deviceToken: string) {
    let user = await User.findOne(userId);

    user.deviceToken = deviceToken;

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
