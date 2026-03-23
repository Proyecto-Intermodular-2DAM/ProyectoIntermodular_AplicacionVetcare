import apiClient from './apiClient';

export const vetService = {
    // Employees
    async getEmployees() {
        const response = await apiClient.get('/employees', {
            params: { select: '*' }
        });
        return response.data;
    },
    async createEmployee(data: any) {
        const response = await apiClient.post('/employees', data);
        return response.data;
    },
    async updateEmployee(id: string, data: any) {
        const response = await apiClient.patch('/employees', data, {
            params: { id: `eq.${id}` }
        });
        return response.data;
    },
    async deleteEmployee(id: string) {
        await apiClient.delete('/employees', {
            params: { id: `eq.${id}` }
        });
    },

    // Users
    async getUsers() {
        const response = await apiClient.get('/users', {
            params: { select: '*' }
        });
        return response.data;
    },
    async updateUserRole(id: string, role: string) {
        const response = await apiClient.patch('/users', { role }, {
            params: { id: `eq.${id}` }
        });
        return response.data;
    },

    // Appointments
    async getAppointments() {
        const response = await apiClient.get('/appointments', {
            params: { select: '*,animal:animal_id(name),client:client_id(first_name,last_name)' }
        });
        return response.data;
    },

    // Centers
    async getCenters() {
        const response = await apiClient.get('/center', {
            params: { select: '*' }
        });
        return response.data;
    },

    // Animals
    async getAnimals() {
        const { data } = await apiClient.get('/animals?select=*,client:users(*)');
        return data;
    },
    async createAnimal(data: any) {
        return await apiClient.post('/animals', data);
    },

    // Rooms
    async getRooms() {
        const { data } = await apiClient.get('/rooms');
        return data;
    },
    async createRoom(data: any) {
        return await apiClient.post('/rooms', data);
    },

    // Treatments
    async getTreatments() {
        const { data } = await apiClient.get('/treatments');
        return data;
    },
    async createTreatment(data: any) {
        return await apiClient.post('/treatments', data);
    },

    // Adoption History
    async getAdoptionHistory() {
        const { data } = await apiClient.get('/adoption_history');
        return data;
    },
    async createAdoption(data: any) {
        return await apiClient.post('/adoption_history', data);
    },

    // Clients
    async getClients() {
        const { data } = await apiClient.get('/users?role=eq.Cliente');
        return data;
    },
    async createClient(data: any) {
        return await apiClient.post('/users', data);
    }
};
