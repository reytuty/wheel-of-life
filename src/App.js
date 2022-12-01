import React, { useState, useRef } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);


export default function App() {
  const [cachedlabels, setCachedlabels] = useState([])
  const [cachedvalues, setCachedvalues] = useState([])
  const [count, setCount] = useState(3);
  const [data, setData] = useState({
    labels: ["a", "b", "c"],
    datasets: [
      {
        label: "A",
        data: [1, 2, 3],
        backgroundColor: "rgba(10, 200, 10, 0.2)",
        borderColor: "rgba(20, 255, 20, 1)",
        borderWidth: 1,
      },
      {
        label: "B",
        data: [3, 1, 2],
        backgroundColor: "rgba(10, 10, 200, 0.2)",
        borderColor: "rgba(20, 20, 255, 1)",
        borderWidth: 1,
      },
    ]
  });
  const chartRef = useRef(data);
  function fillArray(arr, total, cachedValue = [], updateMethod = null, defaultValue = 0) {
    if (arr.length > total && updateMethod) {
      //cache
      arr.forEach((value, index) => {
        if (!cachedValue[index]) {
          cachedValue.push(value);
          return;
        }
        cachedValue[index] = value;
      })
    }
    if (arr.length > total) {
      console.log("removendo array", arr)
      arr.splice(total, arr.length);
      console.log(arr)
    }
    if (arr.length < total) {
      for (let i = arr.length; i < total; i++) {
        arr.push(cachedValue[i] || defaultValue)
      }
    }
    return arr;
  }
  const onChangeTotal = (e) => {
    let total = parseInt(e.target.value, 10);
    if (total < 1 || total > 20) {
      console.log("total precisa ser entre 1 e 20")
      return;
    }
    setCount(total)
    const cloneData = { ...data };
    fillArray(cloneData.labels, total, cachedlabels, setCachedlabels, 'x')
    fillArray(cloneData.datasets[0].data, total, cachedvalues, setCachedvalues, 0)
    setData(cloneData);
    chartRef.current.update()
  };
  const changeLabel = (e, index) => {
    let clone = { ...data };
    clone.labels[index] = e.target.value;
    setData(clone);
    chartRef.current.update()
  }
  const onChangeValue = (e, index, pIndex) => {
    let clone = { ...data };
    console.log('CLONE ON CHANGE before', { p: clone.datasets[pIndex].data[index] });
    clone.datasets[pIndex].data[index] = Math.max(0, Math.min(10, parseFloat(e.target.value, 10)));
    console.log('CLONE ON CHANGE', { p: clone.datasets[pIndex].data[index] });
    setData(clone);
    chartRef.current.update();
  }
  return (
    <>
      <h1 className="text-center text-slate-600 text-5xl mb-10 bg-slate-300 p-4">WHEEL OF LIFE</h1>
      <div className="flex flex-row justify-around">
        <div>
          <div id="totalItems" className="flex flex-row p-1">
            <p className="mr-3 bg-slate-200 p-2 rounded-lg">Parâmetros Analisados </p>
            <input
              className="mr-4"
              type={'range'}
              min={3}
              max={16}
              value={count}
              placeholder="coloque a quantidade de parâmetros"
              onChange={onChangeTotal}
            /><span className="bg-blue-300 h-7 rounded-2xl w-7 flex justify-center" >{count}</span>
          </div>
          {
            data.labels.map((item, index) => {
              let labelId = 'item_' + index;
              console.log(labelId)
              return (<div key={'__' + labelId}>
                <div className="flex flex-row gap-3 p-1" key={labelId}>
                  <p className="p-1">item {index} {data.length}</p>
                  <input
                    className="border border-gray-300 rounded-lg bg-slate-200 bottom-1 p-1"
                    type={'label_' + labelId}
                    placeholder="Coloque um rótulo"
                    value={data.labels[index]}
                    onChange={(e) => changeLabel(e, index)}
                  />
                  <input
                    className="border border-gray-900 bg-slate-200 bottom-1"
                    id={'value_' + labelId}
                    type={'range'}
                    min={0}
                    max={10}
                    value={data.datasets[0].data[index]}
                    placeholder="0 a 10 para A"
                    onChange={(e) => onChangeValue(e, index, 0)}
                  /><span className="bg-blue-300 h-7 rounded-2xl w-7 flex justify-center" >{data.datasets[0].data[index]}</span>
                  <input
                    className="border border-gray-900 bg-slate-200 bottom-1"
                    id={'value_' + labelId}
                    type={'range'}
                    min={0}
                    max={10}
                    value={data.datasets[1].data[index]}
                    placeholder="0 a 10 para B"
                    onChange={(e) => onChangeValue(e, index, 1)}
                  /><span className="bg-blue-300 h-7 rounded-2xl w-7 flex justify-center" >{data.datasets[1].data[index]}</span>
                </div>
              </div>);
            })
          }
        </div>
        <div className="w-1/2">
          <Radar
            ref={chartRef}
            data={data}
            options={{
              elements: {
                line: {
                  borderWidth: 3
                }
              },
              scale: {
                max: 10,
                ticks: {
                  beginAtZero: true,
                  precision: 0.1,
                  max: 10,
                  min: 0,
                  stepSize: 1,
                  callback: function (value) {
                    return `${value}`
                  }
                }
              }
            }
            } />
        </div>
      </div>
    </>
  );
}
