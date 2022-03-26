const chai = require('chai');
const assert = require('assert');
const {isFinalFightFilled, findIfEmptySlotAvailible, findEmptyFight} = require('../grahpql/resolvers/nft');

describe('check if Final Fight filled returning correct response', () => {
    it('Should return true', function (){
        const fights = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {nfts: [0, 0]}]
        assert.equal(isFinalFightFilled(fights), true )
    })
    it('Should return false', function (){
        const fights = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {nfts: [0]}]
        assert.equal(isFinalFightFilled(fights), false)
    })
});

describe('Checks if findIfEmptySlotAvailible() returns correct function when round = 1', () => {
    const isFinalFightFilled = findIfEmptySlotAvailible(1);
    it('should return a function that returns true when slotsOccupied equals 0', function (){
        assert.equal(isFinalFightFilled(0), true )
    })
    it('should return a function that returns true when slotsOccupied equals 1', function (){
        assert.equal(isFinalFightFilled(1), true )
    })
    it('should return a function that returns false when slotsOccupied equals 2', function (){
        assert.equal(isFinalFightFilled(2), false )
    })


});

describe('Checks if findIfEmptySlotAvailible() returns correct function when round > 1', () => {
    const isFinalFightFilled = findIfEmptySlotAvailible(2);
    it('should return true if only 1 slot filled', function (){
        assert.equal(isFinalFightFilled(1), true )
    })
    it('should return false if 0 slots filled', function (){
        assert.equal(isFinalFightFilled(0), false )
    })
    it('should return false if 2 slots filled', function (){
        assert.equal(isFinalFightFilled(2), false )
    })


});

describe('Finds first empty slot', () => {
    const isFinalFightFilled = findIfEmptySlotAvailible(2);
    it('should return true if only 1 slot filled', function (){
        assert.equal(isFinalFightFilled(1), true )
    })
    it('should return false if 0 slots filled', function (){
        assert.equal(isFinalFightFilled(0), false )
    })
    it('should return false if 2 slots filled', function (){
        assert.equal(isFinalFightFilled(2), false )
    })
});

describe('Finds the first empty fight slot within multiple tournaments', () => {
    const roundTournaments = [
        {fights: [
            {
                nfts: [0, 0]
            },
            {
                nfts: [0, 0]
            },
            {
                nfts: [0]
            },
            {
                nfts: [],
                fightIndex: 0
            }
        ]},
        {fights: [
            {
                nfts: [0, 0]
            },
            {
                nfts: [0, 0]
            },
            {
                nfts: [0]
            },
            {
                nfts: []
            }
        ]}
    ]
    
    it('should return the fight obj with empty nfts', function (){
        assert.deepEqual(findEmptyFight(roundTournaments), {nfts: [], fightIndex: 0} )
    })
});