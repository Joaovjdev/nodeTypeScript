import { StatusCodes } from 'http-status-codes';

import { testServer } from '../jest.setup';


describe('User - SignUp', () => {
  it('Register user 1', async () => {
    const res1 = await testServer
      .post('/register')
      .send({
        password: '123456',
        name: 'Juca da Silva',
        email: 'jucasilva@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });
  it('Register user 2', async () => {
    const res1 = await testServer
      .post('/register')
      .send({
        password: '123456',
        name: 'Pedro da Rosa',
        email: 'pedro@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');
  });
  it('Error registering a user with duplicate email', async () => {
    const res1 = await testServer
      .post('/register')
      .send({
        password: '123456',
        name: 'Pedro da Rosa',
        email: 'pedroduplicado@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.CREATED);
    expect(typeof res1.body).toEqual('number');

    const res2 = await testServer
      .post('/register')
      .send({
        password: '123456',
        name: 'Juca da Silva',
        email: 'pedroduplicado@gmail.com',
      });
    expect(res2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res2.body).toHaveProperty('errors.default');
  });
  it('Error registering a user without email', async () => {
    const res1 = await testServer
      .post('/register')
      .send({
        password: '123456',
        name: 'Juca da Silva',
        // email: 'jucasilva@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });
  it('Error registering a username without', async () => {
    const res1 = await testServer
      .post('/register')
      .send({
        password: '123456',
        // name: 'Juca da Silva',
        email: 'jucasilva@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.name');
  });
  it('Error when registering a user without password', async () => {
    const res1 = await testServer
      .post('/register')
      .send({
        // password: '123456',
        name: 'Juca da Silva',
        email: 'jucasilva@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });
  it('Error registering a user with invalid email', async () => {
    const res1 = await testServer
      .post('/register')
      .send({
        password: '123456',
        name: 'Juca da Silva',
        email: 'jucasilva gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.email');
  });
  it('Error when registering a user with a password that is too small', async () => {
    const res1 = await testServer
      .post('/register')
      .send({
        password: '123',
        name: 'Juca da Silva',
        email: 'jucasilva@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.password');
  });
  it('Error when registering a user with a very small name', async () => {
    const res1 = await testServer
      .post('/register')
      .send({
        password: '123456',
        name: 'Ju',
        email: 'jucasilva@gmail.com',
      });
    expect(res1.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(res1.body).toHaveProperty('errors.body.name');
  });
});