import React from 'react';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Search, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBusinesses = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <>
            <Helmet>
                <title>Buscar Negocios - Reserva Fácil</title>
                <meta name="description" content="Encuentra y reserva en los mejores locales." />
            </Helmet>

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Encuentra tu próximo turno
                </h1>

                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Buscar por nombre, servicio o ubicación..."
                            className="pl-10 h-12 text-lg"
                        />
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-gray-600">Resultados de la búsqueda aparecerán aquí.</p>
                    <p className="mt-4 text-gray-500">Página en construcción.</p>

                    <Button
                        onClick={handleGoHome}
                        className="mt-8 flex items-center gap-2 mx-auto"
                    >
                        <Home className="w-5 h-5" />
                        Volver al inicio
                    </Button>
                </div>
            </div>
        </>
    );
};

export default SearchBusinesses;
