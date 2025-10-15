import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { PlusCircle, Building2, MapPin, Edit, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const OwnerDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBusinesses = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('owner_id', user.id);

            if (error) throw error;
            setBusinesses(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error al cargar negocios",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);
    
    const handleNotImplemented = () => {
        toast({
            title: "🚧 ¡Función en construcción!",
            description: "Esta característica aún no está implementada. ¡Pero puedes pedirla en tu próximo mensaje! 🚀",
        });
    };

    return (
        <>
            <Helmet>
                <title>Panel de Negocio - Reserva Fácil</title>
                <meta name="description" content="Gestiona tu negocio, horarios y reservas." />
            </Helmet>
            <div className="min-h-screen bg-gray-50">
                 <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                           <Calendar className="h-6 w-6 text-purple-600" />
                           <h1 className="text-xl font-bold gradient-text">Reserva Fácil</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600 hidden sm:block">Hola, {user?.name || user?.email}</span>
                            <Button onClick={signOut} variant="outline" size="sm">Cerrar Sesión</Button>
                        </div>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Mis Negocios</h2>
                        <Button onClick={() => navigate('/owner/create-business')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Negocio
                        </Button>
                    </div>

                    {loading ? (
                         <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                             <div className="bg-white p-6 rounded-lg shadow animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ) : businesses.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No tienes negocios</h3>
                            <p className="mt-1 text-sm text-gray-500">Comienza creando tu primer negocio para empezar.</p>
                            <div className="mt-6">
                                <Button onClick={() => navigate('/owner/create-business')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Crear Negocio
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {businesses.map((business) => (
                                <div key={business.id} className="bg-white p-6 rounded-lg shadow-md card-hover border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{business.name}</h3>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                <span>{business.address || 'Dirección no especificada'}</span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={handleNotImplemented}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="mt-4 pt-4 border-t">
                                        <Button variant="outline" className="w-full" onClick={handleNotImplemented}>
                                            Gestionar Horarios y Reservas
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default OwnerDashboard;