import React from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

const ScatterPlot = (scatterData) => {

    const data = <ScatterChart height={500} width={900} data={scatterData.scatterData} >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="missDistance" name="Miss Distance (km)" />
        <YAxis dataKey="diameter" name="Diameter (km)" />
        <Tooltip />
        <Legend />
        <Scatter name="Asteroids" data={scatterData.scatterData} fill="#8884d8" />
    </ScatterChart >

    return scatterData.scatterData.length > 0 && data;
}

export default ScatterPlot;