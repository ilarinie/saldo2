import { observer } from 'mobx-react-lite';
import React from 'react';
import {
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  LineSeries,
  XAxis,
  YAxis,
} from 'react-vis';
import { PurchaseWithCumTotal } from 'src/models/Purchase';

interface SaldoChartProps {
  purchases: PurchaseWithCumTotal[];
}

export const SaldoChart = observer(({ purchases }: SaldoChartProps) => {
  return (
    <FlexibleWidthXYPlot
      stroke='#eee'
      strokeWidth='1px'
      color='blue'
      style={{
        zIndex: 999999999999999,
        margin: '0 auto',
      }}
      height={150}
      margin={{
        left: 50,
        right: 50,
      }}
      getX={(d: PurchaseWithCumTotal) => new Date(d.createdAt).getTime()}
      getY={(d: PurchaseWithCumTotal) => d.cumTotal}
    >
      <HorizontalGridLines style={{ stroke: 'rgba(255,255,255,0.2)' }} />
      <LineSeries
        curve={'basis'}
        style={{
          fill: 'rgba(0,0,0,0)',
        }}
        //@ts-ignore
        data={purchases}
      />
      <XAxis
        tickFormat={(numba) => new Date(numba).toLocaleDateString()}
        style={{
          fontSize: '0.9em',
          stroke: '#eee',
        }}
        tickTotal={3}
        hideLine
        tickSize={0}
        marginTop={30}
      />
      <YAxis
        hideLine
        tickSize={0}
        style={{
          fontSize: '0.9em',
          stroke: '#eee',
        }}
        tickTotal={4}
        tickValues={[-100, 0, 100, 200, 300, 400, 500]}
      />
    </FlexibleWidthXYPlot>
  );
});
