import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

try {
    const envContent = fs.readFileSync('.env', 'utf-8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join('=').trim();
            envVars[key] = value;
        }
    });

    const supabaseUrl = envVars.VITE_SUPABASE_URL;
    const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

    // Use the anon key, just like the frontend
    const supabase = createClient(supabaseUrl, supabaseKey);

    async function diagnose() {
        console.log('--- Simulating Frontend Login Flow ---');

        // 1. Sign In
        console.log('Attempting login for: rubenexvi@gmail.com');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: 'rubenexvi@gmail.com',
            password: 'Rubenico*00'
        });

        if (authError) {
            console.error('Login Failed:', authError.message);
            return;
        }

        const authUser = authData.user;
        const accessToken = authData.session.access_token;
        console.log('Login Successful.');
        console.log(`Auth User ID: ${authUser.id}`);
        console.log(`Access Token Length: ${accessToken.length}`);
        console.log(`API Key Length: ${supabaseKey.length}`);

        // 2. Resolve Public User
        console.log('\n--- Resolving Public User ---');
        console.log(`Searching public.users for auth_id = ${authUser.id}...`);

        const { data: publicUser, error: dbError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', authUser.id)
            .maybeSingle();

        if (dbError) {
            console.error('Database Error querying public.users:', dbError);
        } else if (!publicUser) {
            console.error('CRITICAL MISMATCH: No record found in public.users for this auth_id!');
            console.log('This explains why no data is loading. The link is broken.');

            // Allow debugging: See what auth_id the "Ruben" user actually has
            console.log('\nChecking what auth_id is currently assigned to the data owner (Rubén Expósito)...');
            const { data: rubenData } = await supabase
                .from('users')
                .select('id, first_name, last_name, auth_id, email')
                .eq('email', 'rubenexvi@gmail.com') // Assuming email column exists and is populated
                .maybeSingle();

            if (rubenData) {
                console.log('Found "Rubén Expósito" in public.users:');
                console.log(`- ID: ${rubenData.id}`);
                console.log(`- Stored auth_id: ${rubenData.auth_id}`);
                console.log(`- Email in DB: ${rubenData.email}`);
                console.log(`- Is it a match? ${rubenData.auth_id === authUser.id ? 'YES' : 'NO'}`);
            } else {
                console.log('Could not find user by email in public.users either.');
            }

        } else {
            console.log('Success! Public User found.');
            console.log(`Public User ID: ${publicUser.id}`);
            console.log(`Name: ${publicUser.first_name} ${publicUser.last_name}`);

            // 3. Test Data access with this user's context
            console.log('\n--- Testing Data Access (RLS Check) ---');

            // Animals
            const { data: animals, error: animError } = await supabase
                .from('animal')
                .select('*')
                .eq('client_id', publicUser.id);

            if (animError) console.error('Error fetching animals:', animError);
            else console.log(`Found ${animals.length} animals for this user.`);

            // Appointments
            const { data: appts, error: appError } = await supabase
                .from('appointments')
                .select('*')
                .eq('client_id', publicUser.id);

            if (appError) console.error('Error fetching appointments:', appError);
            else console.log(`Found ${appts.length} appointments for this user.`);
        }
    }

    diagnose();

} catch (err) { console.error('Script Error:', err); }
