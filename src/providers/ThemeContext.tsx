// ThemeContext.js
import React, { createContext, useState, useEffect } from 'react';
import '../App.css';

export const ThemeContext = createContext<{ darkMode: boolean; toggleDarkMode: () => void }>({
      darkMode: false,
      toggleDarkMode: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
      const [darkMode, setDarkMode] = useState(false);

      // Kiểm tra trạng thái đã lưu khi ứng dụng khởi động
      useEffect(() => {
            const savedMode = localStorage.getItem('darkMode');
            if (savedMode) {
                  setDarkMode(JSON.parse(savedMode));
            }
      }, []);

      // Cập nhật class cho body và lưu trạng thái vào localStorage
      useEffect(() => {
            localStorage.setItem('darkMode', JSON.stringify(darkMode));
            if (darkMode) {
                  document.body.classList.add('dark-mode');
            } else {
                  document.body.classList.remove('dark-mode');
            }
      }, [darkMode]);

      const toggleDarkMode = () => {
            setDarkMode(!darkMode);
      };

      return (
            <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
                  {children}
            </ThemeContext.Provider>
      );
};