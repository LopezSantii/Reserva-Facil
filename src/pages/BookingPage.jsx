
import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';

const BookingPage = () => {
    const { businessId } = useParams();
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>Reservar Turno - Reserva Fácil</title>
                <meta name="description" content="Selecciona un horario y reserva tu turno." />
            </Helmet>
            <div className="container mx-auto px-4 py-12">
                <Button onClick={() => navigate(-1)} variant="outline" className="mb-8">
                    &larr; Volver
                </Button>
                <h1 className="text-3xl font-bold mb-4">Reservar en [Nombre del Negocio]</h1>
                <p className="text-lg text-gray-600 mb-8">ID del Negocio: {businessId}</p>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-6">Selecciona un horario disponible</h2>
                    <p className="text-gray-500">El calendario de reservas aparecerá aquí.</p>
                    <p className="mt-4 text-gray-500">Página en construcción.</p>
                </div>
            </div>
        </>
    );
};

export default BookingPage;
  