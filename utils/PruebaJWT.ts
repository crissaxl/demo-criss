import jwt from 'jsonwebtoken';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

export async function getSalesforceToken() {

    // 1. Configuración de tus credenciales
    const consumerKey = process.env.CONSUMER_KEY;
    const username = process.env.USERNAME;
    const loginUrl = process.env.LOGIN_URL; // Quitamos la barra final para evitar errores en el aud

    try {
        const privateKey = fs.readFileSync('./certs/server.key', 'utf8');

        // 2. Crear el Payload del JWT
        const payload = {
            iss: consumerKey,
            sub: username,
            aud: loginUrl,
            exp: Math.floor(Date.now() / 1000) + (3 * 60)
        };

        // 3. Firmar el JWT
        const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

        // 4. Intercambiar el JWT por el Access Token
        const params = new URLSearchParams();
        params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
        params.append('assertion', token);

        const response = await fetch(`${loginUrl}/services/oauth2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        const data: any = await response.json();

        if (!response.ok) {
            console.error(' Error en el Login de Salesforce:');
            console.error(JSON.stringify(data, null, 2));
            throw new Error(`Error de Salesforce: ${data.error_description || data.error}`);
        }

        console.log('Login Exitoso');
        return {
            accessToken: data.access_token,
            instanceUrl: data.instance_url
        };

    } catch (error) {
        console.error('Error crítico durante el proceso:');
        throw error;
    }
}