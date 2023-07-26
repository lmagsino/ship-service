import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import dotenv from 'dotenv';

dotenv.config()

const host: string = process.env.HOST ?? 'localhost';
const port: string = process.env.PORT ?? '3000';
const URL: string = host + port;
const APIKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6Im5leHRwYXkiLCJpYXQiOjE2OTAzNTA2OTd9.M4bwN_V1S5nirdrghB4hW4oEEoiFv7448qjp3RdmJLY';
const app = request(URL);

describe('Ship API integration tests', () => {
  it('GET /summary - should fetch summary', async () => {
    app
      .get('/ships/summary')
      .set('api-key', APIKEY)
      .end(function(err, res) {
        expect(err === null);
        expect(res.statusCode).toEqual(200)
        expect(Object.hasOwn(res.body, 'total_ships'))
        expect(Object.hasOwn(res.body, 'total_active_ships'))
        expect(Object.hasOwn(res.body, 'total_inactive_ships'))
        expect(Object.hasOwn(res.body, 'ship_types'))
        expect(Object.hasOwn(res.body, 'min_year_built'))
        expect(Object.hasOwn(res.body, 'max_year_built'))
      });
  });

  it('GET /{id} - should fetch ship by id', async () => {
    app
      .get('/ships/5ea6ed2d080df4000697c901')
      .set('api-key', APIKEY)
      .end(function(err, res) {
        expect(err === null);
        expect(res.statusCode).toEqual(200)
        expect(Object.hasOwn(res.body, 'id'))
        expect(Object.hasOwn(res.body, 'name'))
        expect(Object.hasOwn(res.body, 'type'))
        expect(Object.hasOwn(res.body, 'year_built'))
        expect(Object.hasOwn(res.body, 'active'))
        expect(Object.hasOwn(res.body, 'roles'))
      });
  });

  it('GET /query?type - should fetch ships by type', async () => {
    app
      .get('/ships/query?type=Cargo')
      .set('api-key', APIKEY)
      .end(function(err, res) {
        expect(err === null);
        expect(res.statusCode).toEqual(200)
        expect(Object.hasOwn(res.body, 'ships'))
      });
  });

  it('GET /query?role - should fetch ships by role', async () => {
    app
      .get('/ships/query?role=Support Ship')
      .set('api-key', APIKEY)
      .end(function(err, res) {
        expect(err === null);
        expect(res.statusCode).toEqual(200)
        expect(Object.hasOwn(res.body, 'ships'))
      });
  });

  it('GET /query?name - should fetch ships by name', async () => {
    app
      .get('/ships/query?name=Just Read')
      .set('api-key', APIKEY)
      .end(function(err, res) {
        expect(err === null);
        expect(res.statusCode).toEqual(200)
        expect(Object.hasOwn(res.body, 'ships'))
      });
  });

  it('GET /query?year_built_start - should fetch ships by year_built_start', async () => {
    app
      .get('/ships/query?year_built_start=2000')
      .set('api-key', APIKEY)
      .end(function(err, res) {
        expect(err === null);
        expect(res.statusCode).toEqual(200)
        expect(Object.hasOwn(res.body, 'ships'))
      });
  });

  it('GET /query?year_built_start=2000&year_built_end=2008 - should fetch ships by date range', async () => {
    app
      .get('/ships/query?year_built_start=2000&year_built_end=2008')
      .set('api-key', APIKEY)
      .end(function(err, res) {
        expect(err === null);
        expect(res.statusCode).toEqual(200)
        expect(Object.hasOwn(res.body, 'ships'))
      });
  });

  it('GET /query?page=1&page_size=3 - should fetch ships with pagination', async () => {
    app
      .get('/ships/query?page=1&page_size=3')
      .set('api-key', APIKEY)
      .end(function(err, res) {
        expect(err === null);
        expect(res.statusCode).toEqual(200)
        expect(Object.hasOwn(res.body, 'ships'))
      });
  });
});
