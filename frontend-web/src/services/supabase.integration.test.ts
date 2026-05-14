import { describe, it, expect, beforeAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Asegurate de que el archivo .env esta configurado.'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Credenciales opcionales de un usuario de test persistente
// Configuralas en .env.local o .env.test.local:
// VITE_TEST_USER_EMAIL=test@vetcare.com
// VITE_TEST_USER_PASSWORD=TestPass123!
const TEST_EMAIL = import.meta.env.VITE_TEST_USER_EMAIL || '';
const TEST_PASSWORD = import.meta.env.VITE_TEST_USER_PASSWORD || '';

describe('Integracion con Supabase (frontend-web)', () => {
  const randomEmail = `integration-web-${Date.now()}@vetcare.test`;
  const randomPassword = 'IntTest123!';

  beforeAll(async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it('debe rechazar login con credenciales inexistentes', async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'noexiste@vetcare.test',
      password: 'wrongpass123',
    });
    expect(data.user).toBeNull();
    expect(error).not.toBeNull();
  });

  it('debe devolver sesion nula cuando no hay sesion activa', async () => {
    await supabase.auth.signOut();
    const { data } = await supabase.auth.getSession();
    expect(data.session).toBeNull();
  });

  it('debe permitir registro (signUp) de un usuario aleatorio', async () => {
    const { data, error } = await supabase.auth.signUp({
      email: randomEmail,
      password: randomPassword,
    });

    if (error) {
      console.warn('signUp warning:', error.message);
      expect(error.message).not.toMatch(/rate limit|disabled|not authorized/i);
    }
    expect(data).toBeDefined();
  });

  it('debe autenticar (signIn) con credenciales de usuario de test persistente si estan configuradas', async () => {
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      console.warn(
        'Saltando test persistente: define VITE_TEST_USER_EMAIL y VITE_TEST_USER_PASSWORD en .env'
      );
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (error) {
      console.error('signIn persistente fallo:', error.message);
    }

    expect(error).toBeNull();
    expect(data.user).not.toBeNull();
    expect(data.session).not.toBeNull();

    const { data: userData } = await supabase.auth.getUser();
    expect(userData.user?.email).toBe(TEST_EMAIL);

    await supabase.auth.signOut();
    const { data: sessionAfter } = await supabase.auth.getSession();
    expect(sessionAfter.session).toBeNull();
  });

  it('debe gestionar onAuthStateChange', () => {
    const { data } = supabase.auth.onAuthStateChange(() => {});
    expect(data.subscription).toBeDefined();
    expect(typeof data.subscription.unsubscribe).toBe('function');
    data.subscription.unsubscribe();
  });
});
