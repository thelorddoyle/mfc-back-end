const chai = require('chai');
const assert = require('assert');
const {getTier} = require('../grahpql/resolvers/tournament');


const expect = chai.expect;
const url = `http://localhost:4000/`;
const request = require('supertest')(url);

describe('Getting correct Tier', () => {
    it('Should return a value of 1', function (){
        assert.equal(getTier(15), 1)
    })
    it('Should return a value of 2', function (){
        assert.equal(getTier(16), 2)
    })
    it('Should return a value of 2', function (){
        assert.equal(getTier(23), 2)
    })
    it('Should return a value of 3', function (){
        assert.equal(getTier(24), 3)
    })
    it('Should return a value of 4', function (){
        assert.equal(getTier(28), 4)
    })
    it('Should return a value of 5', function (){
        assert.equal(getTier(30), 5)
    })
    it('Should return a value of undefined', function (){
        assert.equal(getTier(31), undefined)
    })
});

