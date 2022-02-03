const supertest = require('supertest')
const server = require('../src/app')

const API = supertest(server.app)

describe('General application tests', () => {
    test('GET request to Root path works', async () => {
        await API
        .get('/')
        .expect(200)
    })
})