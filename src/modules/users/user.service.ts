import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repo';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async showInfo(username: object): Promise<UserEntity> {
    return this.userRepository.showInfo(username);
  }
}

//   async getUserByID(id: number): Promise<User> {
//     const found = await this.userRepo.findOne(id);
//     if (!found) {
//       throw new NotFoundException(`Can not find user ${id} `);
//     }
//     return found;
//   }
//   async createUser(createUserDTO: CreateUserDto) {
//     const { name, age } = createUserDTO;
//     const user = new User();
//     user.fullName = name;
//     user.age = age;
//     await user.save();
//     return user;
//   }
