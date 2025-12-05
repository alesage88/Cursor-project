import React from 'react';
import { TrendingUp, BarChart2, Users, TableIcon, FileSpreadsheet, Upload } from 'lucide-react';

const tabs = [
  { id: 'mrr', label: 'Revenus', icon: TrendingUp },
  { id: 'growth', label: 'Croissance', icon: BarChart2 },
  { id: 'churn', label: 'Churn', icon: Users },
  { id: 'performance', label: 'Performance', icon: BarChart2 },
  { id: 'client_mrr', label: 'Matrice Client', icon: TableIcon },
  { id: 'licences', label: 'Contrat client', icon: FileSpreadsheet },
  { id: 'import', label: 'Import', icon: Upload }
];

const TabNavigation = React.memo(({ activeTab, onChange }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap border-b-2 ${
                isActive
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});

TabNavigation.displayName = 'TabNavigation';

export default TabNavigation;






