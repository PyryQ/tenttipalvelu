import { Chart, Interval, Tooltip } from 'bizcharts';
import React from 'react'

//https://livecodestream.dev/post/2020-08-08-7-react-chart-libraries-for-your-web-projects/


const data = [
  { aihe: 'Merkit', prosentti: 38 },
  { aihe: 'Numerot', prosentti: 52 },
  { aihe: 'Kirjaimet', prosentti: 61 },
];


export default function Kaavio2() {
  return <Chart height={400} autoFit data={data} interactions={['active-region']} padding={[30, 30, 30, 50]} >
    <Interval position="aihe*prosentti" />
    <Tooltip shared />
  </Chart>
}
