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
    animal?: {
        name: string;
    };
}

class VetService {
    /**
     * Fetch all animals belonging to the current user
     */
    async getMyAnimals() {
        try {
            const userId = await authService.getPublicUserId();
            console.log('Fetching animals for public userId:', userId);
            if (!userId) return [];

            const { data, error } = await supabase
                .from('animal')
                .select('*')
                .eq('client_id', userId); // Schema shows client_id links to users.id

            if (error) throw error;
            return data as Animal[];
        } catch (error) {
            console.error('Error fetching animals:', error);
            return [];
        }
    }

    /**
     * Fetch all animals available for adoption
     */
    async getAnimalsForAdoption() {
        try {
            const { data, error } = await supabase
                .from('animal')
                .select('*')
                .or('status.eq.INTAKE,status.eq.ADOPTION'); // Covering common statuses

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
        try {
            const userId = await authService.getPublicUserId();
            if (!userId) {
                console.warn('No public userId found for getMyAppointments');
                return [];
            }

            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    animal:animal_id (name, animal_image, species)
                `)
                .eq('client_id', userId)
                .order('appointment_date', { ascending: true });

            if (error) throw error;

            return data.map((item: any) => ({
                ...item,
                date: item.appointment_date,
                time: item.appointment_time
            })) as Appointment[];
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
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
