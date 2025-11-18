const request = require('supertest');

const mockQuery = jest.fn();

jest.mock('pg', () => {
  return {
    Pool: jest.fn(() => ({
      query: mockQuery,
    })),
  };
});

const app = require('../server');

describe('API routes', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  test('GET / returns users from DB', async () => {
    const users = [{ id: 1, name: 'Alice' }];
  mockQuery.mockResolvedValueOnce({ rows: users });

    const res = await request(app).get('/').expect(200);
    expect(res.body).toEqual(users);
  expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM users');
  });

  test('POST /users inserts and returns the new user', async () => {
    const newUser = { id: 2, name: 'Bob' };
  mockQuery.mockResolvedValueOnce({ rows: [newUser] });

    const res = await request(app).post('/users').send({ name: 'Bob' }).expect(200);
    expect(res.body).toEqual(newUser);
  expect(mockQuery).toHaveBeenCalledWith('INSERT INTO users(name) VALUES($1) RETURNING *', ['Bob']);
  });

  test('GET / returns 500 on DB error', async () => {
  mockQuery.mockRejectedValueOnce(new Error('DB down'));

    const res = await request(app).get('/').expect(500);
    expect(res.text).toBe('Erreur DB');
  });
});
