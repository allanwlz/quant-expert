import { Controller, Get, Inject } from '@nestjs/common';
import { StatService } from './stat.service';
import { buildSuccessResponse } from 'src/utils/response';
// import { StoreService } from '../store/store.service';

@Controller('/stat')
export class StatController {
  @Inject()
  private readonly statService: StatService;

  // @Inject()
  // private readonly storeService: StoreService;

  @Get('/total_asset')
  async getData() {
    const data = await this.statService.getData();
    return data;
  }
}
