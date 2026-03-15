const request = require('supertest');
const app = require('../src/app');

describe('App - Health Check', () => {

    test('GET /health should return status UP', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('status', 'UP');
    });

});