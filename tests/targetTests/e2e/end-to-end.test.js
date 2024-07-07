// Create user => get token after creation => post something to "posts" with userID => get post by id => delete post by ID
const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const request = require('supertest')

// const app = require('../../../crud_project_testing/blackbox/server.js') //or: request(127.0.0.1:${PORT}) if no path to sever.js/app.js file

//Assert syle
const should = chai.should()
chai.should()
chai.use(chaiHttp)

const newUser = {
    login: "newUser17",
    nameAndSurname: "NewTest User",
    password: "qwerty123",
    mobileNumber: "3800001",
    gender: "male",
    email: "newUser17@gmail.com",
    status: "admin"
}

const newE2ePost = {
    userID: '1',
    title: 'e2e test post',
    text: 'e2e test post text'
}

const postId = 39


describe('Async e2e tests', () => {
    it('should run a process of async. testing', async function() {
        const resReg = await request('127.0.0.1:3000').post('/api/users/register').send(newUser)
        expect(resReg.statusCode).eq(200)
        expect(resReg.body).should.be.a('object')
        expect(resReg.body).to.have.property('login')
        expect(resReg.body).to.have.property('nameAndSurname')
        expect(resReg.body).to.have.property('mobileNumber')
        expect(resReg.body).to.have.property('gender')
        expect(resReg.body).to.have.property('email')
        // expect(resReg.body).to.have.property('login').eq('newUser0') //Enter valid login property

        const resLogin = await request('127.0.0.1:3000').post('/api/users/login').send({email: newUser.email, password: newUser.password})
        let token = resLogin.body.token
        expect(resLogin.statusCode).eq(200)
        expect(resLogin.body).to.have.property('token')

        const resGetPosts = await request('127.0.0.1:3000').get('/api/posts').set('Authorization', token)
        expect(resGetPosts.statusCode).eq(200)
        expect(resGetPosts.body).to.be.a('array')

        const resNewPost = await request('127.0.0.1:3000').post('/api/posts').set('Authorization', token).send(newE2ePost)
        expect(resNewPost.statusCode).eq(200)
        expect(resNewPost.body).to.have.property('userID')
        expect(resNewPost.body).to.have.property('title')
        expect(resNewPost.body).to.have.property('text')

        const resGetPostById = await request('127.0.0.1:3000').get('/api/posts/73').set('Authorization', token)
        expect(resGetPostById.statusCode).eq(200)
        expect(resGetPostById.body).to.have.property('id')
        expect(resGetPostById.body).to.have.property('userID')
        expect(resGetPostById.body).to.have.property('title')
        expect(resGetPostById.body).to.have.property('text')
        
        const resDeletePostById = await request('127.0.0.1:3000').del('/api/posts/' + postId).set('Authorization', token)
        expect(resDeletePostById.statusCode).eq(204)
    })
})