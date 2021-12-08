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
import { MenuItem, Select } from '@material-ui/core';

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
  const [dataSelect, setDataSelect] = React.useState('');
  const [dataMap, setDataMap] = React.useState(new Map());


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

  useEffect(() => {

    const importAll = (r) => {
      return r.keys().map(r);
    }
    const imports = importAll(require.context('./data', false, /\.(log)$/));
    const data = new Map(imports.map( value => [value.default.slice(20,30), value]))
    setDataMap(data);
    setDataSelect(Array.from(data.keys()).pop());
  }, []);

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
            borderColor: colors[0],
            backgroundColor: colors[0],
            yAxisID: 'y1',
            pointRadius: radius,
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
            label: 'Stable',
            data: json.map(log => log.wallet?.stable?.value),
            borderColor: colors[4],
            backgroundColor: colors[4],
            fill: true,
            yAxisID: 'y',
          },
          {
            label: 'Crypto',
            data: json.map(log => log.wallet?.crypto?.estimateStable),
            borderColor: colors[3],
            backgroundColor: colors[3],
            fill: true,
            yAxisID: 'y',
          },
        ],
      };    

      setData(data);
    };

    if (dataMap && dataMap.get(dataSelect) && dataMap.get(dataSelect).default) {
      fetch(dataMap.get(dataSelect).default)
      .then(r => r.text())
      .then(text => {
        let json = JSON.parse('[' + text.trim().replace(/,$/,'') + ']');
        parseJsonData(json);
      });
    }
  }, [dataSelect, dataMap]);


  const handleSelection = (event) => {
    setDataSelect(event.target.value);
  };

  return ( 
    <div>
      <Select
          labelId="date-label"
          id="date-id"
          value={dataSelect}
          onChange={handleSelection}
      >
         {
          [...dataMap.keys()].map(key =>
            <MenuItem value={key} key={key}>{key}</MenuItem>
          )
        }
      </Select>
      <Line options={options} data={data} />
    </div>
    );
}


export default App;


