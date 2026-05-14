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

const mapAnimalFromAPI = (data: any): Animal => ({
    id: data.id,
    name: data.name,
    species: data.species,
    breed: data.breed,
    avatar: data.avatar,
    owner_id: data.client_id, // Note: client_id in DB, owner_id in interface
    description: data.description,
    birth_date: data.birth_date,
    weight: data.weight,
    height: data.height,
    sex: data.sex,
    status: data.status,
    animal_image: data.animal_image,
    information: data.information,
});

const mapAppointmentFromAPI = (data: any): Appointment => ({
    id: data.id,
    appointment_date: data.appointment_date,
    appointment_time: data.appointment_time,
    reason: data.reason,
    status: data.status,
    client_id: data.client_id,
    animal_id: data.animal_id,
    date: data.appointment_date,
    time: data.appointment_time,
    title: data.reason || 'Sin motivo',
    animal: data.animal ? {
        name: data.animal.name,
        animal_image: data.animal.animal_image,
        species: data.animal.species,
    } : undefined
});

const mapTreatmentFromAPI = (data: any): Treatment => ({
    id: data.id,
    description: data.description,
    medication: data.medication,
    dosage: data.dosage,
    appointment_id: data.appointment_id,
    employee_id: data.employee_id,
    animal_id: data.appointment?.animal?.id,
    animal_name: data.appointment?.animal?.name,
    date: data.appointment?.appointment_date || data.created_at,
    created_at: data.created_at,
    frequency_hours: data.frequency_hours,
    frequency_days: data.frequency_days,
    frequency_months: data.frequency_months,
    frequency_years: data.frequency_years,
    animal: data.appointment?.animal ? {
        name: data.appointment.animal.name
    } : undefined
});

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

                const response = await apiClient.get(`/animal`, {
                    params: {
                        select: '*',
                        client_id: `eq.${userId}`
                    }
                });

                const data = response.data.data ?? response.data;
                const mapped = Array.isArray(data) ? data.map(mapAnimalFromAPI) : [];
                this.animalsCache = mapped;
                return mapped;
            } catch (error: any) {
                console.error('Error fetching animals:', error);
                throw new Error(error.response?.data?.message || "No se pudo cargar la lista de animales.");
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
            const response = await apiClient.get(`/animal`, {
                params: {
                    select: '*',
                    status: 'eq.READY_FOR_ADOPTION'
                }
            });
            const data = response.data.data ?? response.data;
            return Array.isArray(data) ? data.map(mapAnimalFromAPI) : [];
        } catch (error: any) {
            console.error('Error fetching adoption animals:', error);
            throw new Error(error.response?.data?.message || "No se pudo cargar la lista de adopción.");
        }
    }

    /**
     * Fetch a single animal by ID
     */
    async getAnimalById(id: string): Promise<Animal | null> {
        try {
            const response = await apiClient.get(`/animal`, {
                params: {
                    select: '*',
                    id: `eq.${id}`
                },
                headers: {
                    'Accept': 'application/vnd.pgrst.object+json' // To get a single object instead of an array
                }
            });
            const data = response.data.data ?? response.data;
            if (data) {
                return mapAnimalFromAPI(data);
            }
            return null;
        } catch (error: any) {
            console.error(`Error fetching animal ${id}:`, error);
            throw new Error(error.response?.data?.message || "No se pudo obtener el animal.");
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

                const response = await apiClient.get(`/appointments`, {
                    params: {
                        select: '*,animal:animal_id(name,animal_image,species)',
                        client_id: `eq.${userId}`,
                        order: 'appointment_date.asc'
                    }
                });

                const data = response.data.data ?? response.data;
                const mapped = Array.isArray(data) ? data.map(mapAppointmentFromAPI) : [];
                this.appointmentsCache = mapped;
                return mapped;
            } catch (error: any) {
                console.error('Error fetching appointments:', error);
                throw new Error(error.response?.data?.message || "No se pudo cargar la lista de citas.");
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

            const response = await apiClient.get(`/treatments`, {
                params: {
                    select: '*,appointment:appointment_id(appointment_date,animal:animal_id(id,name))',
                    appointment_id: `in.(${appIds.join(',')})`,
                    order: 'created_at.desc'
                }
            });

            const data = response.data.data ?? response.data;
            return Array.isArray(data) ? data.map(mapTreatmentFromAPI) : [];
        } catch (error: any) {
            console.error('Error fetching treatments:', error);
            throw new Error(error.response?.data?.message || "No se pudo cargar la lista de tratamientos.");
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
