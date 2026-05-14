import apiClient from './apiClient';

export const vetService = {
    // Employees (All users who are not CLIENT)
    async getEmployees() {
        const response = await apiClient.get('/users', {
            params: {
                role: 'neq.CLIENT',
                select: '*'
            }
        });
        return response.data;
    },
    async createEmployee(data: any) {
        const response = await apiClient.post('/users', data);
        return response.data;
    },
    async updateEmployee(id: string, data: any) {
        const response = await apiClient.patch('/users', data, {
            params: { id: `eq.${id}` }
        });
        return response.data;
    },
    async deleteEmployee(id: string) {
        await apiClient.delete('/users', {
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
            params: { select: '*,animal:animal_id(name),client:client_id(first_name,last_name,dni)' }
        });
        return response.data;
    },
    async createAppointment(data: any) {
        const response = await apiClient.post('/appointments', data);
        return response.data;
    },

    // Centers
    async getCenters() {
        const response = await apiClient.get('/centers', {
            params: { select: '*' }
        });
        return response.data;
    },
    async createCenter(data: any) {
        const response = await apiClient.post('/centers', data);
        return response.data;
    },
    async deleteCenter(id: string) {
        await apiClient.delete('/centers', {
            params: { id: `eq.${id}` }
        });
    },

    // Animals
    async getAnimals() {
        const { data } = await apiClient.get('/animal?select=*,client:client_id(first_name,last_name,dni),center:center_id(name,postcode)');
        return data;
    },
    async createAnimal(data: any) {
        return await apiClient.post('/animal', data);
    },
    async updateAnimal(id: string, data: any) {
        return await apiClient.patch('/animal', data, {
            params: { id: `eq.${id}` }
        });
    },
    async deleteAnimal(id: string) {
        await apiClient.delete('/animal', {
            params: { id: `eq.${id}` }
        });
    },

    // Rooms
    async getRooms() {
        const { data } = await apiClient.get('/rooms?select=*,center:center_id(name,postcode)');
        return data;
    },
    async createRoom(data: any) {
        return await apiClient.post('/rooms', data);
    },
    async updateRoom(id: string, data: any) {
        return await apiClient.patch('/rooms', data, {
            params: { id: `eq.${id}` }
        });
    },
    async deleteRoom(id: string) {
        await apiClient.delete('/rooms', {
            params: { id: `eq.${id}` }
        });
    },

    // Treatments
    async getTreatments() {
        const { data } = await apiClient.get('/treatments?select=*,appointment:appointment_id(animal:animal_id(name),client:client_id(dni))');
        return data;
    },
    async createTreatment(data: any) {
        return await apiClient.post('/treatments', data);
    },
    async updateTreatment(id: string, data: any) {
        return await apiClient.patch('/treatments', data, {
            params: { id: `eq.${id}` }
        });
    },
    async deleteTreatment(id: string) {
        await apiClient.delete('/treatments', {
            params: { id: `eq.${id}` }
        });
    },

    // Adoption History
    async getAdoptionHistory() {
        const { data } = await apiClient.get('/adoption_history?select=*,animal:animal_id(name,status),client:adopter_id(dni)');
        return data;
    },
    async createAdoption(data: any) {
        return await apiClient.post('/adoption_history', data);
    },
    async updateAdoption(id: string, data: any) {
        return await apiClient.patch('/adoption_history', data, {
            params: { id: `eq.${id}` }
        });
    },
    async deleteAdoption(id: string) {
        await apiClient.delete('/adoption_history', {
            params: { id: `eq.${id}` }
        });
    },

    // Clients
    async getClients() {
        const { data } = await apiClient.get('/users?role=eq.CLIENT');
        return data;
    },
    async createClient(data: any) {
        return await apiClient.post('/users', data);
    },
    async updateClient(id: string, data: any) {
        return await apiClient.patch('/users', data, {
            params: { id: `eq.${id}` }
        });
    },

    // Appointments (Update was missing)
    async updateAppointment(id: string, data: any) {
        return await apiClient.patch('/appointments', data, {
            params: { id: `eq.${id}` }
        });
    },
    async deleteAppointment(id: string) {
        await apiClient.delete('/appointments', {
            params: { id: `eq.${id}` }
        });
    },

    // Centers (Update was missing)
    async updateCenter(id: string, data: any) {
        return await apiClient.patch('/centers', data, {
            params: { id: `eq.${id}` }
        });
    }
};

