export const authService = {
    signIn: async (email: string, pass: string) => {
        console.log('Mock sign in', email, pass);
        // Simulate success or failure
        if (email === 'error@test.com') {
            return { error: 'Mock error' };
        }
        return { error: null, user: { email } };
    },
    resetPassword: async (email: string) => {
        console.log('Mock reset password', email);
        if (email === 'error@test.com') return { error: { message: 'Mock error' } };
        return { error: null };
    }
};
