const chai = require('chai');
const assert = require('assert');
const {isFinalFightFilled, findIfEmptySlotAvailible, findEmptyFight, addWins} = require('../grahpql/resolvers/nft');

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

    const roundTournaments2 = [
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
                nfts: [0],
                fightIndex: 0
            }
        ]},
        {fights: [
            {
                nfts: [],
                fightIndex: 1
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
    it('should return the fight obj with empty nfts & fightIndex 1', function (){
        assert.deepEqual(findEmptyFight(roundTournaments2), {nfts: [], fightIndex: 1} )
    })
});

describe('Adds wins to the method', () => {
    nfts = [
        {
            id: "62404456fbefcdc3e770f319",
            fights: [
            {
                id: "62404451fbefcdc3e770f158",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404452fbefcdc3e770f198",
                "winnerId": null
            },
            {
                id: "62404453fbefcdc3e770f218",
                "winnerId": null
            }
            ],
        },
        {
            id: "62404456fbefcdc3e770f31b",
            fights: [
            {
                id: "62404451fbefcdc3e770f158",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404452fbefcdc3e770f19a",
                "winnerId": null
            },
            {
                id: "62404453fbefcdc3e770f21a",
                "winnerId": null
            },
            {
                id: "62404451fbefcdc3e770f178",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404451fbefcdc3e770f188",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404452fbefcdc3e770f190",
                "winnerId": "62404456fbefcdc3e770f337"
            }
            ],
        },
    ]

    nftsWithWins = [
        {
            id: "62404456fbefcdc3e770f319",
            fights: [
            {
                id: "62404451fbefcdc3e770f158",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404452fbefcdc3e770f198",
                "winnerId": null
            },
            {
                id: "62404453fbefcdc3e770f218",
                "winnerId": null
            }
            ],
            wins: 0
        },
        {
            id: "62404456fbefcdc3e770f31b",
            fights: [
            {
                id: "62404451fbefcdc3e770f158",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404452fbefcdc3e770f19a",
                "winnerId": null
            },
            {
                id: "62404453fbefcdc3e770f21a",
                "winnerId": null
            },
            {
                id: "62404451fbefcdc3e770f178",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404451fbefcdc3e770f188",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404452fbefcdc3e770f190",
                "winnerId": "62404456fbefcdc3e770f337"
            }
            ],
            wins: 3
        },
    ]

    nftsWithWrongWins = [
        {
            id: "62404456fbefcdc3e770f319",
            fights: [
            {
                id: "62404451fbefcdc3e770f158",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404452fbefcdc3e770f198",
                "winnerId": null
            },
            {
                id: "62404453fbefcdc3e770f218",
                "winnerId": null
            }
            ],
            wins: 0
        },
        {
            id: "62404456fbefcdc3e770f31b",
            fights: [
            {
                id: "62404451fbefcdc3e770f158",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404452fbefcdc3e770f19a",
                "winnerId": null
            },
            {
                id: "62404453fbefcdc3e770f21a",
                "winnerId": null
            },
            {
                id: "62404451fbefcdc3e770f178",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404451fbefcdc3e770f188",
                "winnerId": "62404456fbefcdc3e770f31b"
            },
            {
                id: "62404452fbefcdc3e770f190",
                "winnerId": "62404456fbefcdc3e770f337"
            }
            ],
            wins: 4
        },
    ]

    it('should return an array of nfts with two win fields', function (){
        assert.deepEqual(addWins(nfts), nftsWithWins )
    })

    it('should return an array of nfts with wrong win fields', function (){
        assert.equal(addWins(nfts) === nftsWithWrongWins, false);
    })
});