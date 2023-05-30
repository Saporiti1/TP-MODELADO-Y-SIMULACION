import { color } from '@mui/system';
import './App.css';
import { eulerMethod, rungeKutta, trapezeMethod } from './methods';

const defaultOptions = {
  xAxis: { domain: [0, 1] },
  yAxis: { domain: [0, 1] },
  grid: true,
  target : '#grafico',
  data: [
    
  ],
}



export function EulerGraph(a, b, m, fPrime, y0) {
  
  console.log("Entrada: ", [a, b, m, fPrime, y0]);

  const a0 = parseFloat(a);
  const b0 = parseFloat(b);
  const m0 = parseInt(m);
  const y01 = parseFloat(y0);

  const eulerPoints = eulerMethod(fPrime, a0, b0, y01, m0);

  const options = {
    
    xAxis: { domain: [a0, b0 + 1] },
    yAxis: { domain: [a0, 15] },
    grid: true,
    data: [
      {
        points : eulerPoints,
        fnType : 'points',
        graphType : 'polyline',
        updateOnMouseMove: true
      },
      {
        points : eulerPoints,
        fnType : 'points',
        graphType : 'scatter',
        updateOnMouseMove: true
      },
    ],
  };

  return options;
}

export function RungeKuttaGraph(a, b, m, fPrime, y0) {
  
  console.log("Entrada: ", [a, b, m, fPrime, y0]);

  const a0 = parseFloat(a);
  const b0 = parseFloat(b);
  const m0 = parseInt(m);
  const y01 = parseFloat(y0);

  const rungeKuttaPoints = rungeKutta(fPrime, a0, b0, y01, m0);


  console.log(rungeKuttaPoints);

  const options = {
    xAxis: { domain: [a0, b0 + 1] },
    yAxis: { domain: [a0, 15] },
    grid: true,
    
    data: [
      {
        points : rungeKuttaPoints,
        fnType : 'points',
        graphType : 'scatter',
        color : 'red'
      },
    ],
  };

  return options
}

export function TrapezeGraph(a, b, m, fPrime){

  console.log('Input Trapeze: ', [a, b, m, fPrime])

  try {
    const a0 = parseFloat(a);
    const b0 = parseFloat(b);
    const m0 = parseInt(m);
  } catch (error) {
    throw 'Bad PArsing'
  }
  const a0 = parseFloat(a);
  const b0 = parseFloat(b);
  const m0 = parseInt(m);


  const trapezeResult = trapezeMethod(a0, b0, m0, fPrime);

  if (trapezeResult.points.length === 0)
    return defaultOptions;

  console.log(trapezeResult.squares);

  const options = {
    xAxis: { domain: [a0, b0 + 1] },
    yAxis: { domain: [a0, 15] },
    grid: true,
    
    data: [
      // {
      //   points : trapezeResult.points,
      //   fnType : 'points',
      //   graphType : 'scatter',
      //   color : 'blue'
      // },
      {
        points : trapezeResult.squares,
        fnType : 'points',
        graphType : 'polyline',
      },
      {
        fn : fPrime
      }
    ],
  };

  return {options, area : trapezeResult.area};
}
