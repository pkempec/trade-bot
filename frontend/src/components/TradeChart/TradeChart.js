import React from 'react';

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
        rotation: -45,
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
            color = '#FF3784';
          } else if (action === 'BUY') {
            color = '#36A2EB';
          } else if(context.dataIndex === context.dataset?.action?.length - 1) {
            color = "#007D51";
          }
          return color;
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

  const parseJsonData = (json) => {
    
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
          backgroundColor: '#007D51',
          fill: true,
          yAxisID: 'y',
        },
        {
          label: 'Crypto',
          data: json.map(log => log.wallet?.crypto?.estimateStable),
          borderColor: '#FFE37B',
          backgroundColor: '#FFE37B',
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

  return ( 
    <div>
      <Line options={options} data={parseJsonData(props.data)} />
    </div>
    );
}

export default TradeChart;
