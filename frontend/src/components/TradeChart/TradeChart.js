import React, { useRef, useEffect, useState } from 'react';

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  Filler,
);

const TradeChart = (props) => {
  const chartRef = useRef();
  const [data, setData] = useState({
    labels: '',
    datasets: [
      {
        label: '',
        data: [],
      },
    ],
  });

  const options = {
    scales: {
      y: {
        text: 'stacked',
        stacked: true,
        position: 'right',
        min: 0,
      },
      y1: {
        min: 0,
        stacked: false,
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      point: {
          radius: 0
      }
    },
    responsive: true,
    plugins: {
      datalabels: {
        align : 'top',
        display: function(context) {
          const isCurrent = context.dataIndex === context.dataset?.action?.length - 1
          const action = context.dataset?.action?.[context.dataIndex];
          return isCurrent || action === 'SELL' || action === 'BUY' ? 'auto' : false
        },
        color: function(context) {
          let color = 'black';
          const action = context.dataset?.action?.[context.dataIndex];
          if (action === 'SELL') {
            color = 'white';
          } else if (action === 'BUY') {
            color = 'white';
          } else if(context.dataIndex === context.dataset?.action?.length - 1) {
            color = "white";
          }
          return color;
        },
        font: function(context) {
          return {
            size: 12,
          }
        },
        formatter: function(value, context) {
          let actionSymbol = '';
          if(context.dataset?.symbol){
            switch(context.dataset?.action?.[context.dataIndex]) {
              case 'SELL':
                actionSymbol = '▲';
                break;
              case 'BUY':
                actionSymbol = '▼';
                break;
              default:
                break;
            }
          }
          return actionSymbol !== '' ? actionSymbol + ' ' + parseFloat(value).toFixed(2) : parseFloat(value).toFixed(2);
        },
      },
    },
  };

  const createGradient = (r,g,b) => {
    const chart = chartRef.current;
    let color = 'rgb('+ r + ',' + g + ',' + b + ')';

    if (chart) {
      color = chart.ctx.createLinearGradient(0, 0, 0, 500);
      color.addColorStop(0, 'rgba('+ r + ',' + g + ',' + b + ', 0.1)');
      color.addColorStop(0.5, 'rgba('+ r + ',' + g + ',' + b + ', 0.3)');
      color.addColorStop(1, 'rgba('+ r + ',' + g + ',' + b + ', 0.7)');
    }
    return color;
  }

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    const parseJsonData = (json) => {  
    
      let gradientCrypto = createGradient('255', '227', '123');
      let gradientStable = createGradient('0', '125', '81');
    
      const radius = (context) => {
        let radius = 0;
        switch(context.dataset?.action?.[context.dataIndex]) {
          case 'SELL':
            radius = 4;
            break;
            case 'BUY':
            radius = 4;
            break;
          default:
            break;
        }
        return radius;
      }
    
      const data =  {
        labels : json.map(log => log.time),
        datasets: [
          {
            label: 'USD',
            data: json.map(log => log.wallet?.total?.estimate),
            action: json.map(log => log.strategy?.action),
            symbol: true,
            borderColor: '#FF4286',
            backgroundColor: '#FF4286',
            yAxisID: 'y1',
            pointRadius: radius,
            // tension: 0.4,
          },
          {
            label: 'RSI',
            data: json.map(log => log.indicator?.value),
            action: json.map(log => log.strategy?.action),
            borderColor: '#FF6C52',
            backgroundColor: '#FF6C52',
            yAxisID: 'y1',
          },
          {
            label: 'Price',
            data: json.map(log => log.wallet?.crypto?.askPrice),
            action: json.map(log => log.strategy?.action),
            borderColor: '#AF5CFC',
            backgroundColor: '#AF5CFC',
            yAxisID: 'y1',
          },
          {
            label: 'Stable',
            data: json.map(log => log.wallet?.stable?.value),
            borderColor: '#007D51',
            backgroundColor: gradientStable,
            fill: true,
            yAxisID: 'y',
          },
          {
            label: 'Crypto',
            data: json.map(log => log.wallet?.crypto?.estimateStable),
            borderColor: '#FFE37B',
            backgroundColor: gradientCrypto,
            fill: true,
            yAxisID: 'y',
          },
          {
            label: 'Est Total Stable',
            data: json.map(log => (log.wallet?.stable?.value + log.wallet?.crypto?.estimateStable).toFixed(2)),
            borderColor: '#005D57',
            backgroundColor: '#005D57',
            yAxisID: 'y1',
          },
          {
            label: 'Est. Total Crypto',
            data: json.map(log => (log.wallet?.crypto?.value + log.wallet?.stable?.estimateCrypto).toFixed(2)),
            borderColor: '#37EFBA',
            backgroundColor: '#37EFBA',
            yAxisID: 'y1',
          },
        ],
      };
      return data;
    }

    setData(parseJsonData(props.data));
  }, [props.data]);

  return ( 
    <div>
      <Line ref={chartRef} options={options} data={data} />
    </div>
    );
}

export default TradeChart;
