import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Company } from 'src/company/company.entity';

@Entity()
export class UserCompany {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    user => user.companies,
  )
  user: User;

  @ManyToOne(
    () => Company,
    company => company.users,
  )
  company: Company;
}
