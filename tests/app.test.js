const request = require('supertest');
const app = require('../src/app');

describe('App - Root Endpoint', () => {

    test('GET / should return 200 with welcome message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Hello from My Node.js App!');
    });

    test('GET / should return JSON content type', async () => {
        const res = await request(app).get('/');
        expect(res.headers['content-type']).toMatch(/json/);
    });

    test('GET /unknown should return 404', async () => {
        const res = await request(app).get('/unknown-route');
        expect(res.statusCode).toBe(404);
    });

});