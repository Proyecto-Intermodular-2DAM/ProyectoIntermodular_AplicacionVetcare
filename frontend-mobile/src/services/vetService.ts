import { authService } from './authService';
import apiClient from './apiClient';

export interface Animal {
    id: string;
    name: string;
    species: string;
    breed?: string;
    avatar?: string;
    owner_id: string;
    description?: string;
    birth_date?: string;
    weight?: number;
    height?: number;
    sex?: string;
    status?: string; 
    animal_image?: string;
    information?: string;
}

export interface Appointment {
    id: string;
    appointment_date: string;
    appointment_time: string;
    reason: string;
    status: string;
    client_id: string;
    animal_id: string;
    date: string;
    time: string;
    title: string;
    animal?: {
        name: string;
        animal_image?: string;
        species?: string;
    };
}

export interface Treatment {
    id: string;
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
    async getMyAnimals(): Promise<Animal[]> {
        if (this.animalsCache) return this.animalsCache;
        if (this.animalsPromise) return this.animalsPromise;

        this.animalsPromise = (async () => {
            try {
                const userId = await authService.getPublicUserId();
                if (!userId) return [];

                const response = await apiClient.get<Animal[]>(`/animal`, {
                    params: {
                        select: '*',
                        client_id: `eq.${userId}`
                    }
                });

                this.animalsCache = response.data;
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
    async getAnimalsForAdoption(): Promise<Animal[]> {
        try {
            const response = await apiClient.get<Animal[]>(`/animal`, {
                params: {
                    select: '*',
                    status: 'eq.READY_FOR_ADOPTION'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching adoption animals:', error);
            return [];
        }
    }

    /**
     * Fetch a single animal by ID
     */
    async getAnimalById(id: string): Promise<Animal | null> {
        try {
            const response = await apiClient.get<Animal[]>(`/animal`, {
                params: {
                    select: '*',
                    id: `eq.${id}`
                },
                headers: {
                    'Accept': 'application/vnd.pgrst.object+json' // To get a single object instead of an array
                }
            });
            return response.data as unknown as Animal;
        } catch (error) {
            console.error(`Error fetching animal ${id}:`, error);
            return null;
        }
    }

    /**
     * Fetch all appointments for the current user's animals
     */
    async getMyAppointments(): Promise<Appointment[]> {
        if (this.appointmentsCache) return this.appointmentsCache;
        if (this.appointmentsPromise) return this.appointmentsPromise;

        this.appointmentsPromise = (async () => {
            try {
                const userId = await authService.getPublicUserId();
                if (!userId) return [];

                const response = await apiClient.get<any[]>(`/appointments`, {
                    params: {
                        select: '*,animal:animal_id(name,animal_image,species)',
                        client_id: `eq.${userId}`,
                        order: 'appointment_date.asc'
                    }
                });

                const mapped = response.data.map((item: any) => ({
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
    async getMyTreatments(): Promise<Treatment[]> {
        try {
            const userId = await authService.getPublicUserId();
            if (!userId) return [];

            const myApps = await this.getMyAppointments();
            const appIds = myApps.map(a => a.id);
            
            if (appIds.length === 0) return [];

            const response = await apiClient.get<any[]>(`/treatments`, {
                params: {
                    select: '*,appointment:appointment_id(appointment_date,animal:animal_id(id,name))',
                    appointment_id: `in.(${appIds.join(',')})`,
                    order: 'created_at.desc'
                }
            });

            return response.data.map((t: any) => ({
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

    /**
     * Clear all caches
     */
    clearCache() {
        this.animalsCache = null;
        this.appointmentsCache = null;
    }
}
export const vetService = new VetService();
