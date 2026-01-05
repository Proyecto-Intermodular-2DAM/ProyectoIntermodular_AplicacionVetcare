import { supabase } from '../lib/supabase';
import { authService } from './authService';

export interface Animal {
    id: string; // Changed to string (UUID in SQL)
    name: string;
    species: string; // Changed from type
    breed?: string;
    avatar?: string;
    owner_id: string;
    description?: string;
    birth_date?: string;
    weight?: number;
    height?: number;
    sex?: string;
    status?: string; 
    animal_image?: string; // Correct column name
    information?: string; // Added field for adoption details
}

export interface Appointment {
    id: string;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    status: string;
    client_id: string;
    animal_id: string;
    date: string; // Alias for UI
    time: string; // Alias for UI
    title?: string; // Add title for UI compatibility
    animal?: {
        name: string;
        animal_image?: string;
        species?: string;
    };
}

export interface Treatment {
    id: string; // UUID
    description: string;
    medication?: string;
    dosage?: string;
    appointment_id: string;
    employee_id: string;
    animal_id?: string;
    animal_name?: string;
    date?: string;
    created_at?: string;
    frequency_hours?: number;
    frequency_days?: number;
    frequency_months?: number;
    frequency_years?: number;
    animal?: {
        name: string;
    };
}

class VetService {
    private animalsCache: Animal[] | null = null;
    private appointmentsCache: Appointment[] | null = null;
    private animalsPromise: Promise<Animal[]> | null = null;
    private appointmentsPromise: Promise<Appointment[]> | null = null;

    /**
     * Fetch all animals belonging to the current user
     */
    async getMyAnimals() {
        if (this.animalsCache) return this.animalsCache;
        if (this.animalsPromise) return this.animalsPromise;

        this.animalsPromise = (async () => {
            try {
                const userId = await authService.getPublicUserId();
                if (!userId) return [];

                const { data, error } = await supabase
                    .from('animal')
                    .select('*')
                    .eq('client_id', userId);

                if (error) throw error;
                this.animalsCache = data as Animal[];
                return this.animalsCache;
            } catch (error) {
                console.error('Error fetching animals:', error);
                return [];
            } finally {
                this.animalsPromise = null;
            }
        })();

        return this.animalsPromise;
    }

    /**
     * Fetch all animals available for adoption
     */
    async getAnimalsForAdoption() {
        try {
            const { data, error } = await supabase
                .from('animal')
                .select('*')
                .eq('status', 'READY_FOR_ADOPTION'); // Only show animals ready for adoption

            if (error) throw error;
            return data as Animal[];
        } catch (error) {
            console.error('Error fetching adoption animals:', error);
            return [];
        }
    }

    /**
     * Fetch a single animal by ID
     */
    async getAnimalById(id: string) {
        try {
            const { data, error } = await supabase
                .from('animal')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Animal;
        } catch (error) {
            console.error(`Error fetching animal ${id}:`, error);
            return null;
        }
    }

    /**
     * Fetch all appointments for the current user's animals
     */
    async getMyAppointments() {
        if (this.appointmentsCache) return this.appointmentsCache;
        if (this.appointmentsPromise) return this.appointmentsPromise;

        this.appointmentsPromise = (async () => {
            try {
                const userId = await authService.getPublicUserId();
                if (!userId) return [];

                const { data, error } = await supabase
                    .from('appointments')
                    .select(`
                        *,
                        animal:animal_id (name, animal_image, species)
                    `)
                    .eq('client_id', userId)
                    .order('appointment_date', { ascending: true });

                if (error) throw error;

                const mapped = data.map((item: any) => ({
                    ...item,
                    date: item.appointment_date,
                    time: item.appointment_time,
                    title: item.reason || 'Sin motivo'
                })) as Appointment[];

                this.appointmentsCache = mapped;
                return mapped;
            } catch (error) {
                console.error('Error fetching appointments:', error);
                return [];
            } finally {
                this.appointmentsPromise = null;
            }
        })();

        return this.appointmentsPromise;
    }

    /**
     * Fetch all treatments for the current user's animals
     */
    async getMyTreatments() {
        try {
            const userId = await authService.getPublicUserId();
            if (!userId) return [];

            // 1. Get user's appointments first to get IDs
            const myApps = await this.getMyAppointments();
            const appIds = myApps.map(a => a.id);
            
            if (appIds.length === 0) return [];

            // 2. Fetch treatments linked to those appointments
            const { data, error } = await supabase
                .from('treatments')
                .select(`
                    *,
                    appointment:appointment_id (
                        appointment_date,
                        animal:animal_id (id, name)
                    )
                `)
                .in('appointment_id', appIds)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data.map((t: any) => ({
                ...t,
                animal_id: t.appointment?.animal?.id,
                animal_name: t.appointment?.animal?.name,
                animal: t.appointment?.animal,
                date: t.appointment?.appointment_date || t.created_at
            })) as Treatment[];
        } catch (error) {
            console.error('Error fetching treatments:', error);
            return [];
        }
    }
}
export const vetService = new VetService();
