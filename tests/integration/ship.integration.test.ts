import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';

dotenv.config()

const URL = process.env.HOST! + process.env.PORT!
const APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk4NTU5NTN9.g52M-1DDC4oVmSndrVpifgQ1JnRGbRYseTHkWAIiv0w'
const app = request(URL);

describe('Ship API integration tests', () => {
    it('GET /summary - should fetch summary',  async () => {
        app
        .get('/ships/summary')
        .set('api-key', APIKEY)
        .end(function(err, res) {
            expect(res.statusCode).toEqual(200)
            expect(res.body.hasOwnProperty('total_ships'))
            expect(res.body.hasOwnProperty('total_active_ships'))
            expect(res.body.hasOwnProperty('total_inactive_ships'))
            expect(res.body.hasOwnProperty('ship_types'))
            expect(res.body.hasOwnProperty('min_year_built'))
            expect(res.body.hasOwnProperty('max_year_built'))
        });
    });

    it('GET /{id} - should fetch ship by id',  async () => {
        app
        .get('/ships/5ea6ed2d080df4000697c901')
        .set('api-key', APIKEY)
        .end(function(err, res) {
            expect(res.statusCode).toEqual(200)
            expect(res.body.hasOwnProperty('id'))
            expect(res.body.hasOwnProperty('name'))
            expect(res.body.hasOwnProperty('type'))
            expect(res.body.hasOwnProperty('year_built'))
            expect(res.body.hasOwnProperty('active'))
            expect(res.body.hasOwnProperty('roles'))
        });
    });
  });
