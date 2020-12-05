import { Injectable } from '@nestjs/common';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserInsertDto } from './dto/insert-user.dto';
import { SendEmailService } from '../sendEmail/sendEmail.service';
import { AES, enc } from 'crypto-js';
import {
  getYear,
  getMonth,
  getDate,
  getHours,
  getMinutes,
  differenceInMinutes,
} from 'date-fns';
import { PerfilService } from '../perfil/perfil.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private sendEmailService: SendEmailService,
    private perfilService: PerfilService,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = this.userRepository.findOne({ where: { email: email } });
    return user;
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(user: UserInsertDto): Promise<InsertResult> {
    const userInst = new User();
    userInst.email = user.email;
    userInst.name = user.name;
    userInst.password = this.hashPassword(user.password);

    const perfil = await this.perfilService.get(user.perfil);
    userInst.perfil = perfil;

    const insertedResult = await this.userRepository.insert(userInst);

    return insertedResult;
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
    const decryptedMessage = this.decryptMessage(hash);
    const arr = decryptedMessage.split('|');
    const dateInitial = new Date(+arr[1], +arr[2], +arr[3], +arr[4], +arr[5]);

    if (this.isSessionForChangePasswordIsExpired(dateInitial)) {
      throw new Error('Session Expired');
    }

    const userRet = await this.userRepository.findOne({
      where: { id: arr[0] },
    });
    userRet.password = this.hashPassword(password);

    const updatedUser = this.userRepository.update(arr[0], userRet);
    return updatedUser;
  }

  async sendEmailForgotPassword(to: string, userId: number): Promise<void> {
    const currentDate = new Date();
    const year = getYear(currentDate);
    const month = getMonth(currentDate);
    const day = getDate(currentDate);
    const hour = getHours(currentDate);
    const minutes = getMinutes(currentDate);

    const encriptMessage = `${userId}|${year}|${month}|${day}|${hour}|${minutes}`;

    const user = await this.findOneById(userId);

    const text = `
    <p>Olá <b>${user.name},</b></p>
    <p>Você solicitou o restart de sua senha, favor clicar no link abaixo e realizar a alteração:</p>
    <p>http://ragazzitech.caioragazzi.com:82/resetpassword?hash=${AES.encrypt(
      encriptMessage,
      process.env.SECRET_CRYPTO,
    )}</p>
    <p>Atenciosamente,</p>
    <p>Equipe iValet</p> 
    `;
    const subject = 'Forgot password';

    this.sendEmailService.sendEmail(to, subject, text.toString());
  }

  public hashPassword(password: string): string {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);

    return hash;
  }

  comparePassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }

  private decryptMessage(message: string): string {
    const idDecrypted = AES.decrypt(message, process.env.SECRET_CRYPTO);
    const decryptedMessage = idDecrypted.toString(enc.Utf8);

    return decryptedMessage;
  }

  private isSessionForChangePasswordIsExpired(initialDate: Date): boolean {
    const diff = differenceInMinutes(initialDate, new Date());
    if (diff <= -120) {
      return true;
    } else {
      return false;
    }
  }
}
