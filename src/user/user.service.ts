import { Injectable, Inject } from '@nestjs/common';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserInsertDto } from './dto/insert-user.dto';
import { SendEmailService } from 'src/senEmail/sendEmail.service';
import { AES, enc } from 'crypto-js';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private sendEmailService: SendEmailService,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(user: UserInsertDto): Promise<InsertResult> {
    const userInst = new User();
    userInst.email = user.email;
    userInst.name = user.name;
    userInst.password = this.hashPassword(user.password);

    return this.userRepository.insert(userInst);
  }

  async update(userId: number, user: UserUpdateDto): Promise<UpdateResult> {
    const userInst = new User();
    userInst.id = userId;
    userInst.email = user.email;
    userInst.name = user.name;

    const updatedUser = this.userRepository.update(userId, userInst);
    return updatedUser;
  }

  async updatePassword(hash: string, password: string): Promise<UpdateResult> {
    const idDecrypted = AES.decrypt(hash, process.env.SECRET_CRYPTO);
    const userId = idDecrypted.toString(enc.Utf8);
    
    const userRet = await this.userRepository.findOne({
      where: { id: userId },
    });
    userRet.password = this.hashPassword(password);

    const updatedUser = this.userRepository.update(
      userId,
      userRet,
    );
    return updatedUser;
  }

  sendEmailForgotPassword(to: string, userId: number): void {
    const text = AES.encrypt(userId.toString(), process.env.SECRET_CRYPTO);
    const subject = 'Forgot password';

    this.sendEmailService.sendEmail(to, subject, text.toString());
  }

  private hashPassword(password: string): string {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  }

  comparePassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
