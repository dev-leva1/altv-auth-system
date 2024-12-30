import * as alt from 'alt-server';
import pkg from 'crypto-js';
const { SHA256 } = pkg;
import { initDatabase, findUserByUsername, findUserByEmail, createUser, updateLastLogin } from './database.js';

alt.on('resourceStart', async () => {
    await initDatabase();
});

alt.on('playerConnect', (player) => {
    player.spawn(-1095.0, -2730.0, 0.0);
    player.visible = false;
    alt.emitClient(player, 'auth:showLoginForm');
});

alt.onClient('auth:tryLogin', async (player, loginData) => {
    try {
        if (!loginData.username || !loginData.password) {
            alt.emitClient(player, 'auth:loginResponse', false, 'Please fill in all fields');
            return;
        }

        const userData = await findUserByUsername(loginData.username);
        
        if (!userData) {
            alt.emitClient(player, 'auth:loginResponse', false, 'User not found');
            return;
        }

        const passwordHash = SHA256(loginData.password).toString();
        if (userData.password_hash !== passwordHash) {
            alt.emitClient(player, 'auth:loginResponse', false, 'Incorrect password');
            return;
        }

        await updateLastLogin(userData.id);

        player.userData = {
            id: userData.id,
            username: userData.username,
            email: userData.email
        };

        player.spawn(-1041.0, -2744.0, 21.0);
        player.visible = true;
        alt.emitClient(player, 'auth:loginResponse', true, 'Successfully logged in');
    } catch (error) {
        alt.emitClient(player, 'auth:loginResponse', false, 'Authentication error occurred');
    }
});

alt.onClient('auth:tryRegister', async (player, userData) => {
    try {
        if (!userData.username || !userData.password || !userData.email) {
            alt.emitClient(player, 'auth:registerResponse', false, 'Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            alt.emitClient(player, 'auth:registerResponse', false, 'Please enter a valid email address');
            return;
        }

        if (userData.password.length < 6) {
            alt.emitClient(player, 'auth:registerResponse', false, 'Password must be at least 6 characters long');
            return;
        }

        const existingUser = await findUserByUsername(userData.username);
        if (existingUser) {
            alt.emitClient(player, 'auth:registerResponse', false, 'Username already exists');
            return;
        }

        const existingEmail = await findUserByEmail(userData.email);
        if (existingEmail) {
            alt.emitClient(player, 'auth:registerResponse', false, 'Email already in use');
            return;
        }

        const passwordHash = SHA256(userData.password).toString();
        const userId = await createUser(userData.username, userData.email, passwordHash);

        if (!userId) {
            alt.emitClient(player, 'auth:registerResponse', false, 'Error creating user');
            return;
        }

        player.userData = {
            id: userId,
            username: userData.username,
            email: userData.email
        };

        player.spawn(-1041.0, -2744.0, 21.0);
        player.visible = true;
        alt.emitClient(player, 'auth:registerResponse', true, 'Registration successful');
    } catch (error) {
        alt.emitClient(player, 'auth:registerResponse', false, 'Registration error occurred');
    }
}); 