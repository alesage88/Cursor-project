import React from 'react';
import { X } from 'lucide-react';

const DrillDownModal = React.memo(({ drillDownData, onClose, currencySymbol }) => {
  if (!drillDownData) return null;

  const { month, contracts } = drillDownData;

  const newContracts = contracts.filter(c => !c.isChurn && c.displayType === 'Nouveau');
  const upsellContracts = contracts.filter(c => !c.isChurn && c.displayType === 'Upsell');
  const crossSellContracts = contracts.filter(c => !c.isChurn && c.displayType === 'Cross-sell');
  const churnContracts = contracts.filter(c => c.isChurn);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">Détails - {month}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {newContracts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-500 rounded"></span>
                Nouveaux Clients ({newContracts.length})
              </h3>
              <div className="space-y-2">
                {newContracts.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{c.Nom}</p>
                      <p className="text-sm text-gray-600">Contrat #{c['# contract']} • {c.CSM}</p>
                    </div>
                    <p className="font-bold text-blue-600">+{currencySymbol}{Math.round(c.displayAmount).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {upsellContracts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-green-600 mb-3 flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded"></span>
                Upsells ({upsellContracts.length})
              </h3>
              <div className="space-y-2">
                {upsellContracts.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{c.Nom}</p>
                      <p className="text-sm text-gray-600">Contrat #{c['# contract']} • {c.CSM}</p>
                    </div>
                    <p className="font-bold text-green-600">+{currencySymbol}{Math.round(c.displayAmount).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {crossSellContracts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-purple-600 mb-3 flex items-center gap-2">
                <span className="w-4 h-4 bg-purple-500 rounded"></span>
                Cross-sells ({crossSellContracts.length})
              </h3>
              <div className="space-y-2">
                {crossSellContracts.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{c.Nom}</p>
                      <p className="text-sm text-gray-600">Contrat #{c['# contract']} • {c.CSM}</p>
                    </div>
                    <p className="font-bold text-purple-600">+{currencySymbol}{Math.round(c.displayAmount).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {churnContracts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded"></span>
                Churn ({churnContracts.length})
              </h3>
              <div className="space-y-2">
                {churnContracts.map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">{c.Nom}</p>
                      <p className="text-sm text-gray-600">Contrat #{c['# contract']} • {c.CSM}</p>
                    </div>
                    <p className="font-bold text-red-600">{currencySymbol}{Math.round(c.displayAmount).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contracts.length === 0 && (
            <p className="text-center text-gray-500 py-8">Aucun mouvement ce mois</p>
          )}
        </div>
      </div>
    </div>
  );
});

DrillDownModal.displayName = 'DrillDownModal';

export default DrillDownModal;






