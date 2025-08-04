import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { SignUpDTO } from '../dto/user.dto';

@Injectable()
export class UserService {
  private userRepository: Repository<User>;
  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async findById(userId: string): Promise<User | null> {
    const user = this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(signUpData: SignUpDTO): Promise<User> {
    const user = this.userRepository.create(signUpData);

    return await this.userRepository.save(user, { reload: true });
  }

  async update(user: User): Promise<User> {
    return await this.userRepository.save(user, { reload: true });
  }
}
