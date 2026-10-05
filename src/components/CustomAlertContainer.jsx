import React from 'react';
import { useAlert } from '../context/AlertContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const CustomAlertContainer = () => {
  const { alerts, removeAlert } = useAlert();

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="alert-toast-container">
      {alerts.map(alert => (
        <div key={alert.id} className={`alert-toast alert-toast-${alert.type}`}>
          <div style={{ marginTop: '2px', flexShrink: 0 }}>
            {alert.type === 'success' && <CheckCircle2 size={22} color="var(--success)" />}
            {alert.type === 'danger' && <AlertCircle size={22} color="var(--danger)" />}
            {alert.type === 'warning' && <AlertTriangle size={22} color="var(--warning)" />}
            {alert.type === 'info' && <Info size={22} color="var(--info)" />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {alert.title && (
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '3px', color: 'var(--text-main)' }}>
                {alert.title}
              </div>
            )}
            <div style={{ fontSize: '0.875rem', lineHeight: 1.45, color: 'var(--text-main)' }}>
              {alert.message}
            </div>
          </div>
          <button 
            onClick={() => removeAlert(alert.id)}
            style={{ 
              color: 'var(--text-muted)', 
              cursor: 'pointer', 
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: '0.5rem'
            }}
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};
