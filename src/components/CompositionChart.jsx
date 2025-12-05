import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import { TrendingUp } from 'lucide-react';
import Card from './Card';

const CompositionChart = React.memo(({ data, currency, currencySymbol }) => {
  return (
    <Card className="p-4 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp size={18} className="text-green-500" /> Composition du MRR Actif ({currency})
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
          <span className="flex items-center gap-1 ml-2">
            <span className="w-3 h-3 bg-[#111827] rounded-full"></span> Total
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
            <Legend />
            <Bar dataKey="Nouveau" stackId="a" fill="#3B82F6" name="Nouveau" />
            <Bar dataKey="Upsell" stackId="a" fill="#10B981" name="Upsell" />
            <Bar dataKey="Cross-sell" stackId="a" fill="#8B5CF6" name="Cross-sell" />
            <Line type="monotone" dataKey="TotalMRR" stroke="#111827" strokeWidth={2} dot={false} name="Total" />
            <Brush dataKey="date" height={30} stroke="#3B82F6" startIndex={Math.max(0, data.length - 12)} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
});

CompositionChart.displayName = 'CompositionChart';

export default CompositionChart;






