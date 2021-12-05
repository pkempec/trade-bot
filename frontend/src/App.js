import React, { useState, useEffect } from 'react';
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
import raw from './trade.log';

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

const App = () => {
  const empty = {
    labels: [''],
    datasets: [
      {
        label: 'Empty',
        data: [0],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  }

  const [data, setData] = useState(empty);

  const options = {
    scales: {
      y: {
        stacked: false,
        position: 'right',
        // display: false,
      },
      y1: {
        stacked: false,
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Trade History',
      },
      datalabels: {
        align : 'top',
        display: function(context) {
          const action = context.dataset?.action?.[context.dataIndex];
          return action === 'SELL' || action === 'BUY'
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
          return actionSymbol !== '' ? actionSymbol + ' ' + value :  value;
        },
      },
    },
  };

  useEffect(() => {

    const colors = [
      '#FF3784',
      '#36A2EB',
      '#4BC0C0',
      'rgba(247,120,37, 0.2)',
      'rgba(55, 159, 122, 0.5)',
      '#9966FF',
      '#00A8C6',
      '#CC2738',
      '#8B628A',
      '#8FBE00',
      '#606060',
    ];

    const parseJsonData = (json) => {

      const data =  {
        labels : json.map(log => log.time),
        datasets: [
          {
            label: 'USD',
            data: json.map(log => log.wallet?.total?.estimate),
            action: json.map(log => log.strategy?.action),
            symbol: true,
            borderColor: colors[0],
            backgroundColor: colors[0],
            yAxisID: 'y1',
            // tension: 0.4,
          },
          {
            label: 'RSI',
            data: json.map(log => log.indicator?.value),
            action: json.map(log => log.strategy?.action),
            borderColor: colors[1],
            backgroundColor: colors[1],
            yAxisID: 'y1',
          },
          {
            label: 'Price',
            data: json.map(log => log.wallet?.crypto?.askPrice),
            action: json.map(log => log.strategy?.action),
            borderColor: colors[2],
            backgroundColor: colors[2],
            yAxisID: 'y1',
          },
          {
            label: 'Crypto',
            data: json.map(log => log.wallet?.crypto?.estimateStable),
            borderColor: colors[3],
            backgroundColor: colors[3],
            fill: true,
            yAxisID: 'y',
          },
          {
            label: 'Stable',
            data: json.map(log => log.wallet?.stable?.value),
            borderColor: colors[4],
            backgroundColor: colors[4],
            fill: true,
            yAxisID: 'y',
          },
        ],
      };    

      setData(data);
    };

    fetch(raw)
    .then(r => r.text())
    .then(text => {
      let json = JSON.parse('[' + text.trim().replace(/,$/,'') + ']');
      parseJsonData(json);
    });
  }, []);


  return ( 
    <div>
      <Line options={options} data={data} />
    </div>
    );
}


export default App;


