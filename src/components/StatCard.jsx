import React from 'react';
import Card from './Card';

const StatCard = ({ icon: Icon, label, value, iconColor = 'text-blue-500', iconBg = 'bg-blue-50' }) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <Icon size={24} className={iconColor} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;






