import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';

dotenv.config()

const URL = process.env.HOST! + process.env.PORT
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

    it('GET /query?type - should fetch ships by type',  async () => {
        app
        .get('/ships/query?type=Cargo')
        .set('api-key', APIKEY)
        .end(function(err, res) {
            expect(res.statusCode).toEqual(200)
            expect(res.body.hasOwnProperty('ships'))
        });
    });

    it('GET /query?role - should fetch ships by role',  async () => {
        app
        .get('/ships/query?role=Support Ship')
        .set('api-key', APIKEY)
        .end(function(err, res) {
            expect(res.statusCode).toEqual(200)
            expect(res.body.hasOwnProperty('ships'))
        });
    });

    it('GET /query?name - should fetch ships by name',  async () => {
        app
        .get('/ships/query?name=Just Read')
        .set('api-key', APIKEY)
        .end(function(err, res) {
            expect(res.statusCode).toEqual(200)
            expect(res.body.hasOwnProperty('ships'))
        });
    });

    it('GET /query?year_built_start - should fetch ships by year_built_start',  async () => {
        app
        .get('/ships/query?year_built_start=2000')
        .set('api-key', APIKEY)
        .end(function(err, res) {
            expect(res.statusCode).toEqual(200)
            expect(res.body.hasOwnProperty('ships'))
        });
    });

    it('GET /query?year_built_start=2000&year_built_end=2008 - should fetch ships by date range',  async () => {
        app
        .get('/ships/query?year_built_start=2000&year_built_end=2008')
        .set('api-key', APIKEY)
        .end(function(err, res) {
            expect(res.statusCode).toEqual(200)
            expect(res.body.hasOwnProperty('ships'))
        });
    });

    it('GET /query?page=1&page_size=3 - should fetch ships with pagination',  async () => {
        app
        .get('/ships/query?page=1&page_size=3')
        .set('api-key', APIKEY)
        .end(function(err, res) {
            expect(res.statusCode).toEqual(200)
            expect(res.body.hasOwnProperty('ships'))
        });
    });

  });

