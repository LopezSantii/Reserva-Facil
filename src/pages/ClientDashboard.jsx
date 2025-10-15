import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';

const ClientDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>Panel de Cliente - Reserva Fácil</title>
                <meta name="description" content="Gestiona tus próximas reservas." />
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
                            <Button onClick={() => navigate('/search')} variant="outline" size="sm"><Search className="h-4 w-4 mr-2" />Buscar</Button>
                            <Button onClick={signOut} variant="ghost" size="sm">Cerrar Sesión</Button>
                        </div>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Mis Reservas</h2>
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-gray-500">Aún no tienes reservas.</p>
                            <Button onClick={() => navigate('/search')} className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                Buscar un negocio para reservar
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default ClientDashboard;