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
      title: {
        display: true,
        text: 'Trade History',
      },
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
          switch(context.dataset?.action?.[context.dataIndex]) {
            case 'SELL':
              color = '#FF3784';
              break;
            case 'BUY':
              color = '#36A2EB';
              break;
            default:
              break;
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

  return ( 
    <div>
      <Line options={options} data={props.data} />
    </div>
    );
}

export default TradeChart;
