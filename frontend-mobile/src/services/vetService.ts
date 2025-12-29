import { supabase } from '../lib/supabase';

export interface Animal {
    id: number;
    name: string;
    type: string;
    breed?: string;
    avatar?: string;
    owner_id: string;
}

export interface Appointment {
    id: string;
    title: string;
    date: string;
    time: string;
    veterinarian_id?: string;
    animal_id: number;
    animal?: {
        name: string;
        avatar?: string;
        type?: string;
    };
    veterinarian?: {
        name: string;
        avatar?: string;
    };
}

export interface Treatment {
    id: string;
    title: string;
    description: string;
    date: string;
    animal_id: number;
    animal_name?: string;
}

class VetService {
    /**
     * Fetch all animals belonging to the current user
     */
    async getMyAnimals() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user logged in');

            const { data, error } = await supabase
                .from('animal')
                .select('*')
                .eq('owner_id', user.id);

            if (error) throw error;
            return data as Animal[];
        } catch (error) {
            console.error('Error fetching animals:', error);
            return [];
        }
    }

    /**
     * Fetch all appointments for the current user's animals
     */
    async getMyAppointments() {
        try {
            const animals = await this.getMyAnimals();
            if (animals.length === 0) return [];

            const animalIds = animals.map(a => a.id);

            // Fetch appointments joins with animal info if possible
            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    animal:animal_id (name, avatar, type)
                `)
                .in('animal_id', animalIds)
                .order('date', { ascending: true });

            if (error) throw error;
            return data as Appointment[];
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
            const animals = await this.getMyAnimals();
            if (animals.length === 0) return [];

            const animalIds = animals.map(a => a.id);

            const { data, error } = await supabase
                .from('treatments')
                .select(`
                    *,
                    animal:animal_id (name)
                `)
                .in('animal_id', animalIds)
                .order('date', { ascending: false });

            if (error) throw error;
            return data as (Treatment & { animal: { name: string } })[];
        } catch (error) {
            console.error('Error fetching treatments:', error);
            return [];
        }
    }
}

export const vetService = new VetService();
