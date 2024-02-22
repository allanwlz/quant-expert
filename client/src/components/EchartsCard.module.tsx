import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import ReactECharts from 'echarts-for-react';  // 引入ECharts的React包装器
import { calc } from 'antd/es/theme/internal';


// 定义组件的props类型
interface EchartsCardProps {
  className?: string;
  title?: string;
  // items: MenuProps['items']; // 假设你需要从外部传入items
}

const EchartsCard: React.FC<EchartsCardProps> = ({ className, title }) => {
  // 设置ECharts的配置项状态
  const [option, setOption] = useState({});

  // 异步获取数据并更新图表
  useEffect(() => {
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      async function fetchData() {
        try {
          // 异步获取数据，这里以JSON占位符API为例
          const response = await fetch('http://192.168.101.2:3000/stat/total_asset', {
            method: 'GET',
            headers: {
              'x-jwt-token': `${jwtToken}` // 将token放在请求头中
            }
          }
          );
          const data = await response.json();
          data['tooltip'] = {
            trigger: 'axis', // 触发类型：坐标轴触发
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'cross' // 十字准星指示器
            },
            formatter: function (params: any) {
              const candlestick = params[0];
              const date = candlestick.name;
              const ohlc = candlestick.data;
              const diff = ohlc[2] - ohlc[1]; // 计算差价
              return [
                'Date: ' + date,
                'Open: ' + ohlc[1],
                'Close: ' + ohlc[2],
                'Diff: ' + diff.toFixed(2) // 保留两位小数
              ].join('<br/>');
            }
          }
          data['yAxis'] = {
            type: 'value',
            axisLabel: {
              // 使用 formatter 自定义显示格式
              formatter: function (value: any) {
                // 这里将值转换为“万”的单位
                var newValue = value / 10000;
                return newValue + 'W';
              }
            }
          }
          data['grid'] = {
            top: '30px',       // 距离容器上边界的距离
            right: '30px',     // 距离容器右边界的距离
            bottom: '30px',    // 距离容器下边界的距离
            left: '40px',      // 距离容器左边界的距离
            containLabel: false // 包含坐标轴的标签在内
          }
          // 更新状态，这将触发组件重新渲染并更新图表
          setOption(data);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      }
      fetchData();
    }
  }, []); // 空依赖数组保证了effect只会在组件加载时运行一次

  if (!option) {
    return (
      <div className={className}>
        <Card title={title} style={{ width: '100%' }} loading={true}>
        </Card>
      </div>
    )
  } else {
    return (
      <div className={className}>
        <Card title={title} style={{ width: '100%', padding: 0 }} loading={false}>
          <ReactECharts
            option={option}
            style={{ height: '540px', width: '100%' }}
            className='react_for_echarts' />
        </Card>
      </div>
    );
  }
};

export default EchartsCard;