
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('reserva_facil_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const users = JSON.parse(localStorage.getItem('reserva_facil_users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Credenciales inválidas');
      }

      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;

      setUser(userWithoutPassword);
      localStorage.setItem('reserva_facil_user', JSON.stringify(userWithoutPassword));

      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión correctamente',
      });

      if (foundUser.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/client/dashboard');
      }

      return userWithoutPassword;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const users = JSON.parse(localStorage.getItem('reserva_facil_users') || '[]');
      
      if (users.find(u => u.email === email)) {
        throw new Error('El email ya está registrado');
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('reserva_facil_users', JSON.stringify(users));

      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;

      setUser(userWithoutPassword);
      localStorage.setItem('reserva_facil_user', JSON.stringify(userWithoutPassword));

      toast({
        title: '¡Registro exitoso!',
        description: 'Tu cuenta ha sido creada correctamente',
      });

      if (role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/client/dashboard');
      }

      return userWithoutPassword;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('reserva_facil_user');
    navigate('/');
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión correctamente',
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
  