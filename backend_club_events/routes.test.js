const request = require('supertest');
const app = require('./app'); 
const db = require('./db'); 

jest.mock('./db');

beforeEach(() => {
    db.query.mockClear();
});

test('Create sign up and get complete list of students accounts', async () => {
   
    const mockStudents = {
        student_name: 'test',
        student_surname: 'test',
        student_email: 'test@test.test',
        student_password: 'testtest',
    };

    db.query.mockResolvedValueOnce({
        rows: [mockStudents]
    });

    let response = await request(app)
        .post('/users/signup')
        .send(mockStudents);
    expect(db.query).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');

    db.query.mockResolvedValueOnce({
        rows: [mockStudents],
    });

    response = await request(app).get('/users/signup');
    expect(db.query).toHaveBeenCalled();
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([mockStudents]);
});

test('Empty request body', async () => {
    let response = await request(app)
        .post('/users/signup')
        .send({});
    expect(response.statusCode).toBe(400);
});

test('Missing values', async () => {
    const mockStudents = {
        student_name: 'test',
        student_surname: 'test',
        // student_email: 'test@test.test', // Missing email
        student_password: 'testtest',
    };

    let response = await request(app)
        .post('/users/signup')
        .send(mockStudents);
    expect(response.statusCode).toBe(400); 
});

test('Invalid email format', async () => {
    const mockStudents = {
        student_name: 'test',
        student_surname: 'test',
        student_email: 'invalid_email',
        student_password: 'testtest',
    };

    let response = await request(app)
        .post('/users/signup')
        .send(mockStudents);
    expect(response.statusCode).toBe(400);
});


test('Invalid password format', async () => {
    const mockStudents = {
        student_name: 'test',
        student_surname: 'test',
        student_email: 'test@test.test', 
        student_password: 'test',
    };

    let response = await request(app)
        .post('/users/signup')
        .send(mockStudents);
    expect(response.statusCode).toBe(400);
});
