import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Clock, Save, Trash2, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ManageSchedulePage = () => {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [businessName, setBusinessName] = useState('');
    const [schedules, setSchedules] = useState({});
    const [loading, setLoading] = useState(true);
    const [slotDuration, setSlotDuration] = useState(30);

    const weekDays = [
        { id: 1, label: 'Lunes' }, { id: 2, label: 'Martes' },
        { id: 3, label: 'Miércoles' }, { id: 4, label: 'Jueves' },
        { id: 5, label: 'Viernes' }, { id: 6, label: 'Sábado' }, { id: 0, label: 'Domingo' }
    ];

    const timeOptions = Array.from({ length: 48 }, (_, i) => {
        const hour = Math.floor(i / 2).toString().padStart(2, '0');
        const minute = (i % 2 === 0 ? '00' : '30');
        return `${hour}:${minute}`;
    });

    const fetchSchedule = useCallback(async () => {
        setLoading(true);
        try {
            const { data: businessData, error: businessError } = await supabase
                .from('businesses')
                .select('name')
                .eq('id', businessId)
                .single();
            if (businessError) throw businessError;
            setBusinessName(businessData.name);

            const { data: scheduleData, error: scheduleError } = await supabase
                .from('schedules')
                .select('*')
                .eq('business_id', businessId);
            if (scheduleError) throw scheduleError;
            
            const initialSchedules = {};
            let duration = 30; // default duration
            scheduleData.forEach(s => {
                initialSchedules[s.day_of_week] = {
                    enabled: true,
                    startTime: s.start_time.substring(0, 5),
                    endTime: s.end_time.substring(0, 5),
                };
                 if (s.slot_duration_minutes) {
                    duration = s.slot_duration_minutes;
                }
            });
            setSchedules(initialSchedules);
            setSlotDuration(duration);

        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudo cargar la configuración de horarios.' });
        } finally {
            setLoading(false);
        }
    }, [businessId, toast]);

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    const handleScheduleChange = (day, field, value) => {
        setSchedules(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const handleSaveSchedules = async () => {
        setLoading(true);
        try {
            // First, delete all existing schedules for this business to handle deletions
            const { error: deleteError } = await supabase.from('schedules').delete().match({ business_id: businessId });
            if(deleteError) throw deleteError;
            
            // Then, insert the new schedules
            const schedulesToInsert = weekDays
                .filter(day => schedules[day.id]?.enabled)
                .map(day => {
                    const schedule = schedules[day.id];
                    return {
                        business_id: businessId,
                        day_of_week: day.id,
                        start_time: schedule.startTime || '09:00',
                        end_time: schedule.endTime || '17:00',
                        slot_duration_minutes: slotDuration,
                    };
                });

            if (schedulesToInsert.length > 0) {
                 const { error: insertError } = await supabase.from('schedules').insert(schedulesToInsert);
                 if (insertError) throw insertError;
            }

            toast({ title: '¡Guardado!', description: 'Tus horarios han sido actualizados correctamente.' });
            fetchSchedule(); // Refresh data
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error al guardar', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Gestionar Horarios - {businessName}</title>
            </Helmet>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    <Button variant="ghost" onClick={() => navigate('/owner/dashboard')} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al panel
                    </Button>
                    <div className="bg-white p-8 rounded-2xl shadow-lg border">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold gradient-text">Gestionar Horarios</h1>
                            <p className="text-gray-600">Define los horarios de atención para {businessName}.</p>
                        </div>
                        
                        <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <Label htmlFor="slotDuration" className="font-semibold text-purple-800">Duración del turno (en minutos)</Label>
                            <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-5 h-5 text-purple-600"/>
                                <Input 
                                    id="slotDuration" 
                                    type="number" 
                                    value={slotDuration}
                                    onChange={(e) => setSlotDuration(Number(e.target.value))}
                                    className="w-24"
                                    min="5"
                                    step="5"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {weekDays.map(day => (
                                <div key={day.id} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 p-4 rounded-lg border">
                                    <div className="flex items-center space-x-2 md:col-span-1">
                                        <Checkbox
                                            id={`enabled-${day.id}`}
                                            checked={schedules[day.id]?.enabled || false}
                                            onCheckedChange={(checked) => handleScheduleChange(day.id, 'enabled', checked)}
                                        />
                                        <Label htmlFor={`enabled-${day.id}`} className="font-semibold text-lg">{day.label}</Label>
                                    </div>
                                    <div className="flex items-center gap-2 md:col-span-3">
                                        <div className="w-full">
                                            <Label htmlFor={`start-${day.id}`}>Desde</Label>
                                            <Select
                                                value={schedules[day.id]?.startTime || '09:00'}
                                                onValueChange={(value) => handleScheduleChange(day.id, 'startTime', value)}
                                                disabled={!schedules[day.id]?.enabled}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>{timeOptions.map(t => <SelectItem key={`start-${t}`} value={t}>{t}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-full">
                                            <Label htmlFor={`end-${day.id}`}>Hasta</Label>
                                            <Select
                                                value={schedules[day.id]?.endTime || '17:00'}
                                                onValueChange={(value) => handleScheduleChange(day.id, 'endTime', value)}
                                                disabled={!schedules[day.id]?.enabled}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>{timeOptions.map(t => <SelectItem key={`end-${t}`} value={t}>{t}</SelectItem>)}</SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button onClick={handleSaveSchedules} disabled={loading} className="w-full mt-8 bg-gradient-to-r from-purple-600 to-blue-600">
                            <Save className="mr-2 h-4 w-4" /> {loading ? 'Guardando...' : 'Guardar Horarios'}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageSchedulePage;