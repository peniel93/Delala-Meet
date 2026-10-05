import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type, title, message, duration = 5000) => {
    const id = Date.now() + Math.random().toString();
    const newAlert = { id, type, title, message };
    setAlerts(prev => [...prev, newAlert]);

    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const showAlert = {
    success: (msg, title = "Success") => addAlert('success', title, msg),
    danger: (msg, title = "Error") => addAlert('danger', title, msg),
    error: (msg, title = "Error") => addAlert('danger', title, msg),
    warning: (msg, title = "Warning") => addAlert('warning', title, msg),
    info: (msg, title = "Info") => addAlert('info', title, msg)
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
