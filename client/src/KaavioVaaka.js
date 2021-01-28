import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';


export default function KaavioVaaka(props) {
  let kaikkiPisteet = 90;
  let oikein = [46, 57, 78]
  let prosentitO = [];
  let prosentitV = [];
  for (var i = 0; i < oikein.length; i++) {
    prosentitO.push(Math.round((oikein[i] / kaikkiPisteet) * 100))
    prosentitV.push(100 - prosentitO[i])
  }
  const data = {
    labels: ['Merkit', 'Numerot', 'Kirjaimet'],
    datasets: [
      {
        label: '% Oikein',
        backgroundColor: 'rgba(127,255,212,0.2)',
        borderColor: 'rgba(127,255,212,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(153, 255, 153,0.4)',
        hoverBorderColor: 'rgba(153, 255, 153,1)',
        data: prosentitO
      },
      {
        label: '% Väärin',
        backgroundColor: 'rgba(255, 102, 102,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 102, 102,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: prosentitV
      }
    ]
  };

  //displayName: 'BarExample',
  return (
    <div className="kaavio">
      <h2>Tulokset aiheittain</h2>
      <HorizontalBar
        data={data}
        width={100}
        height={60}
        options={{
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              stacked: true
            }],
            yAxes: [{
              stacked: true
            }]
          }
        }}
      />
    </div>
  );
};