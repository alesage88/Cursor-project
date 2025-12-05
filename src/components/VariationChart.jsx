import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';
import Card from './Card';

const VariationChart = React.memo(({ data, currency, currencySymbol, onChartClick }) => {
  return (
    <Card className="p-4 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Activity size={18} className="text-orange-500" /> Variation Mensuelle ({currency})
        </h3>
        <div className="flex gap-4 text-xs font-medium">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#3B82F6] rounded-sm"></span> Nouveau
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#10B981] rounded-sm"></span> Upsell
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#8B5CF6] rounded-sm"></span> Cross-sell
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-[#EF4444] rounded-sm"></span> Churn
          </span>
          <span className="flex items-center gap-1 ml-2">
            <span className="w-3 h-3 bg-[#111827] rounded-full"></span> Net
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `${currencySymbol}${val / 1000}k`} />
            <Tooltip formatter={(val, name) => [`${currencySymbol}${val.toLocaleString()}`, name]} />
            <ReferenceLine y={0} stroke="#000" />
            <Legend />
            <Bar dataKey="New" stackId="b" fill="#3B82F6" name="Nouveau" onClick={onChartClick} cursor="pointer" />
            <Bar dataKey="Upsell" stackId="b" fill="#10B981" name="Upsell" onClick={onChartClick} cursor="pointer" />
            <Bar dataKey="Cross" stackId="b" fill="#8B5CF6" name="Cross-sell" onClick={onChartClick} cursor="pointer" />
            <Bar dataKey="Churn" stackId="b" fill="#EF4444" name="Churn" onClick={onChartClick} cursor="pointer" />
            <Line type="monotone" dataKey="Net" stroke="#111827" strokeWidth={2} dot={false} name="Net" />
            <Brush dataKey="date" height={30} stroke="#F97316" startIndex={Math.max(0, data.length - 12)} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

VariationChart.displayName = 'VariationChart';

export default VariationChart;






