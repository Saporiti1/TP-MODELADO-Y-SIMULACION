import React, {useEffect, useReducer, useRef,useState} from "react";
import functionPlot from "function-plot";
import Slider from '@mui/material/Slider';
import NativeSelect from '@mui/material/NativeSelect';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import {EulerGraph, RungeKuttaGraph, TrapezeGraph} from "../MathGraphs.js"
import './metodos.css';
import { root } from "postcss";
import { flushSync } from "react-dom";
import { Button } from "@mui/material";

const MethodTypes = 
{
  EULER : 10,
  RUNGE_KUTTA : 20,
  TRAPEZOID : 30,
};
  
const Title = (props) =>{
  let text = "";

  if (props.methodType === MethodTypes.RUNGE_KUTTA.toString())
    text = 'Método de Runge Kutta'
  else if (props.methodType === MethodTypes.EULER.toString())
    text = 'Método de Euler'
  else if (props.methodType === MethodTypes.TRAPEZOID.toString())
    text = 'Método del Trapezoide'

  return (
    <h1 className="text-2xl font-semibold text-white  dark:text-white xl:text-4xl titulo" >
      {text}
    </h1>
  )
}

const MethodDescription = (props) => {

  console.log(props);
  const methodType = props.methodType;
  let text = '';

  if (methodType === MethodTypes.RUNGE_KUTTA.toString())
    text = 'Los métodos de Runge-Kutta son un conjunto de métodos genéricos iterativos, explícitos e implícitos, de resolución numérica de ecuaciones diferenciales.'
  else if (methodType === MethodTypes.EULER.toString())
    text = 'El método de Euler es un procedimiento de integración numérica para resolver ecuaciones diferenciales ordinarias (EDO) a partir de un valor inicial dado.'
  else if (methodType === MethodTypes.TRAPEZOID.toString())
    text = 'La regla de los trapecios es una forma de aproximar una integral definida utilizando n trapecios. En este método se supone que f es continua y positiva en el intervalo [a,b].'

  return (
        <div className="texto2">
          <p className="mt-6 text-gray-500 dark:text-gray-400 texto">
            {text}
          </p>
        </div>
  )
  
}

const defaultOptions = {
  grid: true,
  target : '#grafico',
  data: [
    
  ]
}

export function Home() {

  const [limA,setlimA]=useState(0);
  const [limB,setlimB]=useState(0);
  const [iterationCount,setIterationCount]=useState(10);
  const [initialValue,setinitialValue]=useState(0);
  const [h,setH]=useState(0);

  const [mathFunction,setMathFunction]=useState("");
  const [selectedMethod,setSelectedMethod]=useState(MethodTypes.EULER.toString())

  const[graphOptions, setGraphOptions] = useState({});
  const[trapezeArea, setArea] = useState(0);
  const[resultado, setResultado] = useState(0);


  const rootEl = useRef(null);

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  
  useEffect(() => {

    if (!rootEl)
      return;

    let options = {};

    console.log('Method Selected: ', rootEl.current);

    try {
      if (selectedMethod === MethodTypes.TRAPEZOID.toString()) // Trapezoide
      {
        const result = TrapezeGraph(limA, limB, iterationCount, mathFunction);
        
        setArea(result.area.toFixed(5));

        options = result.options;
      }
      else if (selectedMethod === MethodTypes.RUNGE_KUTTA.toString()) {// Runge Kutta
        options = RungeKuttaGraph(limA, limB, iterationCount, mathFunction, initialValue);
        setResultado(options.data[0].points[iterationCount][1]);
      }
      else if (selectedMethod === MethodTypes.EULER.toString()) // Euler
        options = EulerGraph(limA, limB, iterationCount, mathFunction, initialValue);
        setResultado(options.data[0].points[iterationCount][1]);

      console.log("Options Changed")
      options.target = '#grafico'
      console.log("Opciones Devueltas: ", options)
      setGraphOptions(options);

    } catch (error) {
      console.log("Error on Parsing DATA");
      console.log("Opciones Devueltas: ", options)

      setGraphOptions(defaultOptions);
    }

  }, [limA,limB,iterationCount,initialValue, mathFunction,selectedMethod])

  useEffect(() => {
    rootEl.current.replaceChildren();
    functionPlot(Object.assign({}, graphOptions, {target : rootEl.current}));
  }, [graphOptions])

  const onFunctionChange=(e)=>{
    setMathFunction(e.target.value);
  }

  const onBottomLimitChange=(e)=>{

    let value = e.target.value;

    if (value === '')
      value = '0';

    const parsed = parseFloat(value);
    setlimA(parsed);
  }

  const onTopLimitChange=(e)=>{
    let value = e.target.value;

    if (value === '')
      value = '0';

    const parsed = parseFloat(value);
    setlimB(parsed);
  }
  const onIterationCountChange=(e)=>{
    setIterationCount(e.target.value);
  }
  const onInitialValueChange=(e)=>{
    let value = e.target.value;

    if (value === '')
      value = '0';

    const parsed = parseFloat(value);
    setinitialValue(parsed);
  }

  const onHChange=(e)=>{
    let value = e.target.value;

    if (value === '')
      value = '0';

    const parsed = parseFloat(value);
    setH(parsed);
  }

  const onSelectedMethodChange = (e) => {
    console.log("hola",e.target.value)
    setSelectedMethod(e.target.value)
  }

  const onPress=(e) => {
    setinitialValue(0)
    setIterationCount(10)
    setlimA(0)
    setlimB(0)
    setMathFunction('')
    setGraphOptions(defaultOptions);
    functionPlot({})
  }

  return (
    <div className="pantalla">
      <div className="centrar">
        <div className="card">
          <div>
            <div className="crentrarTitulo" >
              <Title methodType = {selectedMethod}></Title>
            </div>
            <div className="grafico">
              <div ref={rootEl}></div>
            </div>
          </div>

          <div className="cajaIzquierda">
            <h2 className="text-1xl font-semibold text-navy  dark:text-white xl:text-44xl lg:w-96 ">
              Ingrese la función:
            </h2>
            <input type="text" placeholder="(x^2)+2x" onChange={onFunctionChange} autoCapitalize="none"  className="inputFuncion"/>
            
            <div className="cajaLimites">
              
              <div className="limiteInf">
                <h2 className="text-1xl font-semibold text-white  dark:text-white xl:text-44xl ">
                    Limite inferior:
                </h2>
                <input type="text" className="inputs" placeholder="a" onChange={onBottomLimitChange} autoCapitalize="none"/>
              </div>
              
              <div className="limiteSup">
                <h2 className="text-1xl font-semibold text-white  dark:text-white xl:text-44xl">
                    Limite superior:
                </h2>
                <input type="text" className="inputs" placeholder="b" onChange={onTopLimitChange} autoCapitalize="none"/>
              </div>
              { (selectedMethod!==MethodTypes.TRAPEZOID.toString()) &&
                <div className="condInicial">
                  <h2 className="text-1xl font-semibold text-white  dark:text-white xl:text-44xl">
                      Condición inicial:
                  </h2>
                  <input type="text" className="inputs" placeholder="y0" onChange={onInitialValueChange} autoCapitalize="none"/>
                </div>
              }
              {
                (selectedMethod === MethodTypes.TRAPEZOID.toString()) &&
                <h2 className="text-1xl font-semibold text-white  dark:text-white xl:text-44xl">
                    Area: <br>
                    </br>
                    {trapezeArea}
                </h2>
              }
            </div>
            { (selectedMethod!==MethodTypes.TRAPEZOID.toString()) &&
                <div className="">
                  <h2 className="text-1xl font-semibold text-white  dark:text-white xl:text-44xl">
                      Solución aproximada en x={limB}:
                  </h2>
                  <p>{resultado}</p>
                </div>
              }
            
            <div className="margen">
              <h2 className="text-1xl font-semibold text-white  dark:text-white xl:text-44xl lg:w-96 espaciado">
                Cantidad de Iteraciones M: ({iterationCount})
              </h2>
              <Slider defaultValue={iterationCount} aria-label="Default" className="range" valueLabelDisplay="auto" onChange={onIterationCountChange} />
              <MethodDescription methodType = {selectedMethod}></MethodDescription>
            </div>
            
            <div className="dropDown">
              <FormControl fullWidth  >
                <InputLabel variant="standard" htmlFor="uncontrolled-native" 
                  sx={{color:"#fff", 
                  '& .MuiNativeSelect-outlined':{
                  color:"#fff"
                  }
                  }}>
                  Método
                </InputLabel>
                <NativeSelect
                  defaultValue={MethodTypes.EULER}
                  inputProps={{
                    name: 'Método',
                  }}
                  sx={{color:"#fff", 
                  }}
                  onChange={onSelectedMethodChange}
                >
                  <option value={MethodTypes.RUNGE_KUTTA} className="colorOpcion">Runge Kutta</option>
                  <option value={MethodTypes.EULER} className="colorOpcion">Euler</option>
                  <option value={MethodTypes.TRAPEZOID} className="colorOpcion">Trapezoide</option>
                  
                </NativeSelect>
              </FormControl>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}


