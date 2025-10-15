import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Search, Building2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast.js';
import { motion } from 'framer-motion';

const SearchBusinesses = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setResults([]);
            setSearched(true);
            return;
        }

        setLoading(true);
        setSearched(true);
        try {
            // Use textSearch for full-text search. The column must have a full-text search index.
            // Let's create a tsvector column on businesses if it's not there.
            // For now, using 'ilike' for broader matching on multiple columns.
            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

            if (error) throw error;
            setResults(data);

        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error en la búsqueda',
                description: 'No se pudieron obtener los resultados. Inténtalo de nuevo.'
            });
        } finally {
            setLoading(false);
        }
    }, [searchTerm, toast]);

    const handleNotImplemented = () => {
        toast({
            title: "🚧 ¡Función en construcción!",
            description: "La página de reservas aún no está lista. ¡Pídela en tu próximo prompt! 🚀",
        });
    };

    return (
        <>
            <Helmet>
                <title>Buscar Negocios - Reserva Fácil</title>
                <meta name="description" content="Encuentra y reserva en los mejores locales." />
            </Helmet>

            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">
                        Encuentra tu próximo turno
                    </h1>
                    <p className="text-lg text-gray-600">Busca entre cientos de locales y reserva al instante.</p>
                </div>

                <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <Input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre, servicio o ubicación..."
                            className="pl-4 pr-24 h-14 text-lg rounded-full shadow-lg"
                        />
                        <Button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-full px-6 bg-gradient-to-r from-purple-600 to-blue-600">
                            <Search className="h-5 w-5 mr-2" />
                            {loading ? 'Buscando...' : 'Buscar'}
                        </Button>
                    </div>
                </form>

                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    ) : searched && results.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
                            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-xl font-semibold text-gray-800">No se encontraron resultados</h3>
                            <p className="mt-2 text-gray-500">Intenta con otros términos de búsqueda.</p>
                        </motion.div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {results.map((business, index) => (
                                <motion.div
                                    key={business.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-6 rounded-lg shadow-md card-hover border border-gray-200 flex flex-col justify-between"
                                >
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{business.name}</h3>
                                        <p className="text-gray-600 mb-3 text-sm line-clamp-2">{business.description || 'Sin descripción.'}</p>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                                            <span>{business.address || 'Dirección no especificada'}</span>
                                        </div>
                                    </div>
                                    <Button onClick={() => navigate(`/booking/${business.id}`)} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                                        Ver Disponibilidad
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SearchBusinesses;