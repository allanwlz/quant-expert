import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SumProfitModel } from './models/sumprofit.model';

@Injectable()
export class StatService {
  @InjectModel(SumProfitModel)
  private readonly sumProfitModel: typeof SumProfitModel;

  async getData() {
    const sumProfitData = await this.sumProfitModel.findAll({
      order: [['date', 'ASC']], // 确保数据是按日期排序的
    });

    // 准备 xAxis 数据和蜡烛图数据
    const xAxisData = sumProfitData.map((item) => new Date(item.date).toISOString().slice(0, 10));
    const seriesData = sumProfitData.map((item) => {
      const open = item.initProfit;
      const close = item.finalProfit;
      const high = Math.max(open, close);
      const low = Math.min(open, close);

      return [open, close, low, high]; // 注意顺序，ECharts 蜡烛图可能有特定的数据顺序要求
    });

    const option = {
      xAxis: {
        data: xAxisData
      },
      series: [
        {
          type: 'candlestick',
          data: seriesData
        }
      ],
      dataZoom: [ // 这里添加dataZoom组件
        {
          type: 'slider', // 这是slider类型的dataZoom
          start: 0, // 左侧在数据窗口中的起始百分比，0表示从头开始
          end: 100 // 右侧在数据窗口中的结束百分比，100表示一直到尾部
        },
        {
          type: 'inside', // 内置型数据区域缩放组件
          start: 0, // 数据窗口的起始百分比
          end: 100, // 数据窗口的结束百分比
          xAxisIndex: [0], // 这里可以设置哪些x轴（数组）受 dataZoom 控制
        }
      ],
    };
    return option;
  }
}
