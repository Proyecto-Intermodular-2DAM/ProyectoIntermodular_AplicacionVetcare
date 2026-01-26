import { useState, useCallback, useRef, useEffect } from 'react';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

/**
 * Custom hook to manage the state of an API request.
 * @returns {Object} { data, loading, error, request }
 */
export function useApi<T, Args extends any[]>(
    apiFunction: (...args: Args) => Promise<T>,
    initialData: T | null = null
) {
    const [state, setState] = useState<UseApiState<T>>({
        data: initialData,
        loading: false,
        error: null,
    });

    // Use a ref to store the latest apiFunction to keep the request callback stable
    const apiRef = useRef(apiFunction);
    apiRef.current = apiFunction;

    const request = useCallback(async (...args: Args) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const result = await apiRef.current(...args);
            setState({ data: result, loading: false, error: null });
            return result;
        } catch (err: any) {
            const errorMessage = err.userMessage || 'Error al procesar la solicitud.';
            setState(prev => ({ ...prev, loading: false, error: errorMessage }));
            throw err;
        }
    }, []); // Stable request function

    const setData = useCallback((newData: T) => {
        setState(prev => ({ ...prev, data: newData }));
    }, []);

    return {
        ...state,
        request,
        setData
    };
}
