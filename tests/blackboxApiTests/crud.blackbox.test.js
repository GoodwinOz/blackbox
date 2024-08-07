const chai = require('chai')
const axios = require('axios')
let MockAdapter = require('axios-mock-adapter')

const expect = chai.expect
let mock = new MockAdapter(axios)

describe('GET functions', function() {
    beforeEach(async () => {
        mock.reset()
    })
    it('should get the endpoint', function(done) {
        let data = { response: true }
        mock.onGet('https://localhost:3000/api/users').reply(200, data)
        expect(200)
        done()
    })

    it('should return a users', async function() {
        mock.onGet('https://localhost:3000/api/users').reply(200, [
            {
            id: '16',
            login: "Test",
            nameAndSurname: "Redrick Shukhart",
            password: "$2a$10$hP6YSba7rrLAPf8pOjD7LuoVHhdFATwzpzFrV3ZLbR/fO3fgm/gw2",
            mobileNumber: "380668123",
            gender: "male",
            email: "test@gmail.com",
            status: "admin"
            }
        ])
        return await axios.get('https://localhost:3000/api/users')
            .then(response => {
                expect(response.data.length).to.equal(1)
                expect(response.data[0]).to.have.property('id')
                expect(response.data[0]).to.have.property('login')
                expect(response.data[0]).to.have.property('email')
                expect(response.data[0]).to.have.property('nameAndSurname')
                expect(response.data[0]).to.have.property('password')
            })
    })

    it('should return a posts', async function() {
        mock.onGet('https://localhost:3000/api/users').reply(200, [
            {
                userID: '1',
                title: 'Test post',
                text: 'Test text'
            }
        ])
        return await axios.get('https://localhost:3000/api/users')
            .then((res) => {
                expect(res.data[0]).to.have.property('title')
                expect(res.data[0]).to.have.property('text')
                expect(res.data[0]).to.have.property('userID')
                expect(200)
            })
    })
})

describe('Post function', function() {
    let instance
    beforeEach(() => {
        instance = axios.create()
        mock.reset()
    })
    it('should simulate user registation', function() {
        mock.onPost('https://localhost:3000/api/users/register', 
                {
                    login: "Test1",
                    nameAndSurname: "Redrick Shukhart",
                    password: "qwerty123",
                    mobileNumber: "380668123",
                    gender: "male",
                    email: "test1@gmail.com",
                    status: "admin"
                })
                .reply(201)
        return instance
            .post('https://localhost:3000/api/users/register',
            {
                login: "Test1",
                nameAndSurname: "Redrick Shukhart",
                password: "qwerty123",
                mobileNumber: "380668123",
                gender: "male",
                email: "test1@gmail.com",
                status: "admin"
            })
            .then((request) => {
                expect(request.status).to.equal(201)
            })
    })

    it('should simulate post creation', async function() {
        mock.onPost('https://localhost:3000/api/posts', 
                {
                    userID: '1',
                    title: 'Test post',
                    text: 'Test text'
                })
                .reply(201)
        return await instance
            .post('https://localhost:3000/api/posts',
            {
                userID: '1',
                title: 'Test post',
                text: 'Test text'
            })
            .then((req) => {
                expect(req.status).to.equal(201)
            })
    })
})