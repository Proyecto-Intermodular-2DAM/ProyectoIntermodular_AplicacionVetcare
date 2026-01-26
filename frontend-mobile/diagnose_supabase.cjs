
const https = require('https');

const supabaseUrl = 'https://bixdljpamugqsjzbkiyz.supabase.co';
const anonKey = 'sb_publishable_5a9AbtELGYYXSyBuJS6NZA_QpH23kxU';

console.log(`--- Diagnostics for Supabase ---`);
console.log(`URL: ${supabaseUrl}`);

const options = {
    method: 'GET',
    headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
    }
};

const req = https.request(`${supabaseUrl}/rest/v1/animal?select=id&limit=1`, options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Response body:', data);
        if (res.statusCode === 200) {
            console.log('✅ Connectivity test PASSED');
        } else {
            console.log('❌ Connectivity test FAILED with status ' + res.statusCode);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Connectivity test ERROR: ${e.message}`);
    if (e.code === 'ECONNRESET') {
        console.error('The connection was reset. This often indicates a firewall, VPN, or ISP block.');
    }
});

req.end();
