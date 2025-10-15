import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building2, FileText, MapPin } from 'lucide-react';

const CreateBusinessPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast({ variant: "destructive", title: "Error", description: "Debes iniciar sesión para crear un negocio." });
            return;
        }
        setLoading(true);

        const trialEndsAt = new Date();
        trialEndsAt.setDate(trialEndsAt.getDate() + 14);

        try {
            const { error } = await supabase.from('businesses').insert({
                name,
                description,
                address,
                owner_id: user.id,
                trial_ends_at: trialEndsAt.toISOString(),
                subscription_status: 'TRIAL'
            });

            if (error) throw error;

            toast({
                title: "¡Negocio creado!",
                description: `${name} ha sido añadido a tu lista.`,
            });
            navigate('/owner/dashboard');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error al crear el negocio",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Crear Negocio - Reserva Fácil</title>
                <meta name="description" content="Añade un nuevo negocio a tu cuenta." />
            </Helmet>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl"
                >
                    <Button variant="ghost" onClick={() => navigate('/owner/dashboard')} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al panel
                    </Button>
                    <div className="bg-white p-8 rounded-2xl shadow-lg border">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold gradient-text">Crea tu Negocio</h1>
                            <p className="text-gray-600">Rellena los detalles para empezar a recibir reservas.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre del Negocio</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Barbería Don Pepe" className="pl-10" required />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                 <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe tu negocio, servicios, etc." className="pl-10" />
                                 </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="address">Dirección</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ej: Av. Siempreviva 742" className="pl-10" required />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                {loading ? 'Creando...' : 'Crear Negocio'}
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default CreateBusinessPage;