import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchUserProfile = useCallback(async (user) => {
    if (!user) return null;
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', user.id)
        .single(); 

      if (error) {
        console.error("Error fetching profile, might be temporary:", error);
        return user;
      }

      if (data) {
        return { ...user, role: data.role, name: data.name };
      }
      return user;

    } catch (error) {
      console.error("Unhandled error fetching profile:", error);
      toast({
        variant: "destructive",
        title: "Error de Perfil",
        description: "No se pudo cargar la información del perfil.",
      });
      return user;
    } finally {
      setProfileLoading(false);
    }
  }, [toast]);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    if (session?.user) {
      const profile = await fetchUserProfile(session.user);
      setUser(profile);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [fetchUserProfile]);

  useEffect(() => {
    setLoading(true);
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, name, role) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: role,
        }
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Fallo el registro",
        description: error.message || "Algo salió mal",
      });
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast({
            variant: "destructive",
            title: "Usuario ya existe",
            description: "Este correo electrónico ya está en uso. Por favor, inicia sesión.",
        });
        navigate('/login');
    } else {
      toast({
        title: "¡Registro exitoso!",
        description: "Revisa tu email para confirmar tu cuenta.",
      });
      navigate('/login');
    }
    setLoading(false);
    return { data, error };
  }, [toast, navigate]);

  const signIn = useCallback(async (email, password) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Fallo el inicio de sesión",
        description: error.message || "Email o contraseña incorrectos.",
      });
    } else {
       toast({
        title: "¡Bienvenido de vuelta!",
        description: "Has iniciado sesión correctamente.",
      });
    }
    setLoading(false);
    return { error };
  }, [toast]);

  const signOut = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        variant: "destructive",
        title: "Fallo al cerrar sesión",
        description: error.message || "Algo salió mal",
      });
    } else {
      setUser(null);
      setSession(null);
      navigate('/');
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
      });
    }
    setLoading(false);
    return { error };
  }, [toast, navigate]);

  const value = useMemo(() => ({
    user,
    session,
    loading: loading || profileLoading,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, profileLoading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};