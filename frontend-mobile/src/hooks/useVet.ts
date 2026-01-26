import { useEffect } from 'react';
import { useApi } from './useApi';
import { vetService, Appointment, Animal, Treatment } from '../services/vetService';

/**
 * Hook to fetch and manage appointments.
 */
export function useAppointments() {
    const { data: appointments, loading, error, request } = useApi<Appointment[], []>(
        () => vetService.getMyAppointments(),
        []
    );

    useEffect(() => {
        request();
    }, [request]);

    return { appointments, loading, error, refresh: request };
}

/**
 * Hook to fetch and manage animals.
 */
export function useAnimals() {
    const { data: animals, loading, error, request } = useApi<Animal[], []>(
        () => vetService.getMyAnimals(),
        []
    );

    useEffect(() => {
        request();
    }, [request]);

    return { animals, loading, error, refresh: request };
}

/**
 * Hook to fetch and manage treatments.
 */
export function useTreatments() {
    const { data: treatments, loading, error, request } = useApi<Treatment[], []>(
        () => vetService.getMyTreatments(),
        []
    );

    useEffect(() => {
        request();
    }, [request]);

    return { treatments, loading, error, refresh: request };
}

/**
 * Hook to fetch and manage animals for adoption.
 */
export function useAdoptionAnimals() {
    const { data: animals, loading, error, request } = useApi<Animal[], []>(
        () => vetService.getAnimalsForAdoption(),
        []
    );

    useEffect(() => {
        request();
    }, [request]);

    return { animals, loading, error, refresh: request };
}
/**
 * Hook to fetch and manage a single animal by ID.
 */
export function useAnimal(id: string | undefined) {
    const { data: animal, loading, error, request } = useApi<Animal | null, [string]>(
        (animalId) => vetService.getAnimalById(animalId),
        null
    );

    useEffect(() => {
        if (id) {
            request(id);
        }
    }, [id, request]);

    return { animal, loading, error, refresh: () => id && request(id) };
}
