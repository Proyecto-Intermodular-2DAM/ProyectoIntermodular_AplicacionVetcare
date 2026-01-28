import { useState, useEffect, useRef } from 'react';
import { vetService, Appointment, Animal, Treatment } from '../services/vetService';

/**
 * Hook to fetch and manage appointments.
 */
export function useAppointments() {
    const fetched = useRef(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;

        const getAppointments = async () => {
            try {
                setLoading(true);
                const response = await vetService.getMyAppointments();
                setAppointments(response);
            } catch (err: any) {
                setError(err.userMessage || "No se han podido obtener las citas");
            } finally {
                setLoading(false);
            }
        };

        getAppointments();
    }, []);

    return { appointments, loading, error };
}

/**
 * Hook to fetch and manage animals.
 */
export function useAnimals() {
    const fetched = useRef(false);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;

        const getAnimals = async () => {
            try {
                setLoading(true);
                const response = await vetService.getMyAnimals();
                setAnimals(response);
            } catch (err: any) {
                setError(err.userMessage || "No se han podido obtener las mascotas");
            } finally {
                setLoading(false);
            }
        };

        getAnimals();
    }, []);

    return { animals, loading, error };
}

/**
 * Hook to fetch and manage treatments.
 */
export function useTreatments() {
    const fetched = useRef(false);
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;

        const getTreatments = async () => {
            try {
                setLoading(true);
                const response = await vetService.getMyTreatments();
                setTreatments(response);
            } catch (err: any) {
                setError(err.userMessage || "No se han podido obtener los tratamientos");
            } finally {
                setLoading(false);
            }
        };

        getTreatments();
    }, []);

    return { treatments, loading, error };
}

/**
 * Hook to fetch and manage animals for adoption.
 */
export function useAdoptionAnimals() {
    const fetched = useRef(false);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (fetched.current) return;
        fetched.current = true;

        const getAnimals = async () => {
            try {
                setLoading(true);
                const response = await vetService.getAnimalsForAdoption();
                setAnimals(response);
            } catch (err: any) {
                setError(err.userMessage || "No se han podido obtener los animales en adopción");
            } finally {
                setLoading(false);
            }
        };

        getAnimals();
    }, []);

    return { animals, loading, error };
}

/**
 * Hook to fetch and manage a single animal by ID.
 */
export function useAnimal(id: string | undefined) {
    const fetchedId = useRef<string | undefined | null>(null);
    const [animal, setAnimal] = useState<Animal | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id || fetchedId.current === id) return;
        fetchedId.current = id;

        const getAnimal = async () => {
            try {
                setLoading(true);
                const response = await vetService.getAnimalById(id);
                setAnimal(response);
            } catch (err: any) {
                setError(err.userMessage || "No se ha podido obtener la información del animal");
            } finally {
                setLoading(false);
            }
        };

        getAnimal();
    }, [id]);

    return { animal, loading, error };
}
