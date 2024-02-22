import { Module } from '@nestjs/common';
import { StatController } from './stat.controller';
import { StatService } from './stat.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SumProfitModel } from './models/sumprofit.model';

@Module({
  imports: [SequelizeModule.forFeature([SumProfitModel])],
  controllers: [StatController],
  providers: [StatService],
})
export class StatModule {}
