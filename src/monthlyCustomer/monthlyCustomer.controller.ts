import { Controller, Get, HttpException, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MonthlyCustomer } from './monthlyCustomer.entity';
import { MonthlyCustomerService } from './monthlyCustomer.service';

@Controller('MonthlyCustomer')
@UseGuards(AuthGuard('jwt'))
export class MonthlyCustomerController {
    constructor(
        private monthlyCustomerService: MonthlyCustomerService
    ) { }

    @Get(':companyId')
    async GetByCompanyId(@Param('companyId') companyId: number,): Promise<MonthlyCustomer[]> {
        try {
            const monthlyCustomers = this.monthlyCustomerService.getByCompanyId(companyId);

            return monthlyCustomers;
        } catch (error) {
            throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
        }
    }
}