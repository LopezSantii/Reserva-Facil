import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Building2, MapPin, Edit, Calendar as CalendarIcon, Loader2, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const OwnerDashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [businesses, setBusinesses] = useState([]);
    const [bookings, setBookings] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchBusinessesAndBookings = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data: businessData, error: businessError } = await supabase
                .from('businesses')
                .select('*')
                .eq('owner_id', user.id);

            if (businessError) throw businessError;
            setBusinesses(businessData);

            const businessIds = businessData.map(b => b.id);
            if (businessIds.length > 0) {
                const { data: bookingData, error: bookingError } = await supabase
                    .from('bookings')
                    .select('*, client:profiles(name, id)')
                    .in('business_id', businessIds)
                    .order('start_at', { ascending: true });

                if (bookingError) throw bookingError;

                const bookingsByBusiness = bookingData.reduce((acc, booking) => {
                    if (!acc[booking.business_id]) {
                        acc[booking.business_id] = [];
                    }
                    acc[booking.business_id].push(booking);
                    return acc;
                }, {});
                setBookings(bookingsByBusiness);
            }

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error al cargar datos",
                description: "No se pudieron cargar los negocios o las reservas.",
            });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        fetchBusinessesAndBookings();
    }, [fetchBusinessesAndBookings]);
    
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
                 <header className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                           <CalendarIcon className="h-6 w-6 text-purple-600" />
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
                        <h2 className="text-3xl font-bold text-gray-800">Mis Negocios</h2>
                        <Button onClick={() => navigate('/owner/create-business')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Negocio
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center mt-16"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>
                    ) : businesses.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg mt-8">
                            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-xl font-semibold text-gray-900">Aún no tienes negocios</h3>
                            <p className="mt-1 text-base text-gray-500">Comienza creando tu primer negocio para empezar a recibir reservas.</p>
                            <div className="mt-6">
                                <Button onClick={() => navigate('/owner/create-business')} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                    <PlusCircle className="mr-2 h-5 w-5" />
                                    Crear mi Primer Negocio
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-1 gap-8">
                            {businesses.map((business) => (
                                <div key={business.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-1">{business.name}</h3>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                <span>{business.address || 'Dirección no especificada'}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2 sm:mt-0">
                                            <Button variant="outline" onClick={() => navigate(`/owner/manage-schedule/${business.id}`)}>
                                               <CalendarIcon className="mr-2 h-4 w-4" /> Gestionar Horarios
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={handleNotImplemented}>
                                                <Edit className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="text-lg font-semibold mb-2 flex items-center"><BookOpen className="mr-2 h-5 w-5 text-purple-600"/> Próximas Reservas</h4>
                                        {bookings[business.id] && bookings[business.id].length > 0 ? (
                                             <ul className="space-y-2">
                                                {bookings[business.id].slice(0, 5).map(booking => (
                                                    <li key={booking.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                                                        <div>
                                                            <p className="font-semibold">{booking.client?.name || 'Cliente anónimo'}</p>
                                                            <p className="text-sm text-gray-600">{new Date(booking.start_at).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                                        </div>
                                                        <Button variant="ghost" size="sm" onClick={handleNotImplemented}>Ver Detalles</Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">No hay reservas próximas para este negocio.</p>
                                        )}
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