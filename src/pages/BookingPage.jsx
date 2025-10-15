import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { add, format, startOfDay, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Building2, Clock, MapPin, ChevronLeft, ChevronRight, Loader2, PartyPopper } from 'lucide-react';

const BookingPage = () => {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();

    const [business, setBusiness] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [date, setDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    const today = startOfDay(new Date());

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data: businessData, error: businessError } = await supabase
                .from('businesses')
                .select('*')
                .eq('id', businessId)
                .single();
            if (businessError) throw businessError;
            setBusiness(businessData);

            const { data: scheduleData, error: scheduleError } = await supabase
                .from('schedules')
                .select('*')
                .eq('business_id', businessId);
            if (scheduleError) throw scheduleError;
            setSchedule(scheduleData);

        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo cargar la información del negocio." });
            navigate('/search');
        } finally {
            setLoading(false);
        }
    }, [businessId, navigate, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const generateSlots = useCallback(async (selectedDate) => {
        if (!schedule || !business) return;

        setSlotsLoading(true);
        setSelectedSlot(null);
        setAvailableSlots([]);

        const dayOfWeek = getDay(selectedDate);
        const daySchedule = schedule.find(s => s.day_of_week === dayOfWeek);

        if (!daySchedule) {
            setSlotsLoading(false);
            return;
        }

        const { start_time, end_time, slot_duration_minutes } = daySchedule;

        const startDateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${start_time}`);
        const endDateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${end_time}`);

        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('start_at')
            .eq('business_id', businessId)
            .gte('start_at', format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss'Z'"))
            .lt('start_at', format(add(endDateTime, { days: 1 }), "yyyy-MM-dd'T'HH:mm:ss'Z'"));
        
        if (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar las reservas existentes.' });
            setSlotsLoading(false);
            return;
        }
        
        const bookedSlots = bookings.map(b => new Date(b.start_at).getTime());
        const slots = [];
        let currentSlot = startDateTime;

        while (currentSlot < endDateTime) {
            if (currentSlot > new Date() && !bookedSlots.includes(currentSlot.getTime())) {
                slots.push(new Date(currentSlot));
            }
            currentSlot = add(currentSlot, { minutes: slot_duration_minutes });
        }
        
        setAvailableSlots(slots);
        setSlotsLoading(false);
    }, [schedule, business, businessId, toast]);

    useEffect(() => {
        generateSlots(date);
    }, [date, generateSlots]);

    const handleBooking = async () => {
        if (!user) {
            toast({
                title: "Inicia sesión para reservar",
                description: "Necesitas una cuenta para poder agendar un turno.",
                action: <Button onClick={() => navigate('/login')}>Iniciar Sesión</Button>,
            });
            return;
        }
        if (!selectedSlot) {
            toast({ variant: 'destructive', title: 'Selecciona un horario', description: 'Debes elegir una hora para tu turno.' });
            return;
        }
        setBookingLoading(true);
        
        const { error } = await supabase.from('bookings').insert({
            business_id: businessId,
            client_id: user.id,
            start_at: selectedSlot.toISOString(),
            end_at: add(selectedSlot, { minutes: schedule.find(s => s.day_of_week === getDay(date)).slot_duration_minutes }).toISOString(),
            status: 'CONFIRMED'
        });

        if (error) {
             toast({ variant: 'destructive', title: 'Error al reservar', description: error.message });
        } else {
             toast({
                title: "¡Reserva confirmada!",
                description: `Tu turno en ${business.name} el ${format(selectedSlot, "PPPP", {locale: es})} a las ${format(selectedSlot, "p", {locale: es})} está agendado.`,
            });
            navigate('/client/dashboard');
        }
        setBookingLoading(false);
    };

    const disabledDays = useMemo(() => {
        if (!schedule) return [{ before: today }];
        const activeDays = schedule.map(s => s.day_of_week);
        return [{ before: today }, (d) => !activeDays.includes(getDay(d))];
    }, [schedule, today]);


    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>;

    return (
        <>
            <Helmet><title>Reservar en {business?.name || 'Negocio'}</title></Helmet>
            <div className="container mx-auto px-4 py-12">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4"><ChevronLeft className="mr-2 h-4 w-4" /> Volver</Button>
                <div className="bg-white p-8 rounded-2xl shadow-lg border grid md:grid-cols-2 gap-8">
                    <div className="border-r-0 md:border-r pr-0 md:pr-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Building2 className="h-10 w-10 text-purple-600" />
                            <div>
                                <h1 className="text-3xl font-bold gradient-text">{business?.name}</h1>
                                <p className="text-gray-500">{business?.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-6">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{business?.address}</span>
                        </div>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={disabledDays}
                            className="rounded-md border"
                            locale={es}
                            footer={
                                <div className="flex justify-between items-center pt-2">
                                    <Button variant="outline" size="sm" onClick={() => setDate(add(date, { months: -1 }))} disabled={date <= today}><ChevronLeft className="h-4 w-4" /></Button>
                                    <span className="capitalize text-sm font-medium">{format(date, "MMMM yyyy", { locale: es })}</span>
                                    <Button variant="outline" size="sm" onClick={() => setDate(add(date, { months: 1 }))}><ChevronRight className="h-4 w-4" /></Button>
                                </div>
                            }
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Selecciona un horario</h2>
                        <h3 className="text-lg font-medium text-purple-700 mb-4">{format(date, 'EEEE, d \'de\' MMMM', { locale: es })}</h3>
                        {slotsLoading ? (
                             <div className="flex justify-center items-center h-48"><Loader2 className="h-8 w-8 animate-spin text-purple-600" /></div>
                        ) : availableSlots.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {availableSlots.map((slot) => (
                                    <Button
                                        key={slot.toISOString()}
                                        variant={selectedSlot?.getTime() === slot.getTime() ? 'default' : 'outline'}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={selectedSlot?.getTime() === slot.getTime() ? 'bg-purple-600 hover:bg-purple-700' : ''}
                                    >
                                        <Clock className="mr-2 h-4 w-4" />
                                        {format(slot, 'HH:mm')}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
                                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-semibold text-gray-800">No hay turnos disponibles</h3>
                                <p className="mt-2 text-gray-500">Prueba seleccionando otro día.</p>
                            </div>
                        )}
                         {selectedSlot && (
                            <div className="mt-8 bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
                                <p className="font-semibold text-purple-800">Turno seleccionado:</p>
                                <p className="text-lg font-bold text-purple-900">
                                    {format(selectedSlot, 'EEEE, d \'de\' MMMM \'a las\' HH:mm', { locale: es })}
                                </p>
                            </div>
                        )}
                        <Button onClick={handleBooking} disabled={!selectedSlot || bookingLoading} className="w-full mt-8 bg-gradient-to-r from-purple-600 to-blue-600">
                            {bookingLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Confirmando...</> : <><PartyPopper className="mr-2 h-4 w-4" />Confirmar Reserva</>}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingPage;