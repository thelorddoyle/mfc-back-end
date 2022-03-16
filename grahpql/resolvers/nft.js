//RESOLVERS
//For each query or mutuation there is a resolver, which processes any sort of logic
const Nft = require('../../models/Nft');
const Tournament = require('../../models/Tournament')
const Fight = require('../../models/Fight');
const checkAuth = require('../../middleware/checkAuth');
const { AuthenticationError } = require('apollo-server');
const { getCurrentTournament } = require('./tournament');
const { UserInputError } = require('apollo-server');

const putNftIntoAvailibleFight = async function (nftId) {
	
	//check if any fight is empty if not then make a new
	try {
		const tournament = await getCurrentTournament();
		await tournament.populate('fights');
        let firstFight;
        // let mintRoundNumber = tournament.round
        let roundNumberTracker = tournament.round + 1;

        const findFirstFight = (roundNo) => {

            firstFight = tournament.fights.find((fight, index) => {

                // this is the length of the nfts array we are currently inspecting
                const length = fight.nfts.length;
                
                // if it is the last NFT in the tournament, change the tournament.status to ready
                if(index === 1 && length ===1) {
                    tournament.status = "ready";
                    tournament.save();
                }
                // the first fight is the next fight you can find which has only 1 NFT in it

                // this return is telling us which type of fight to put an NFT in to
                // where length < 2 - ANY fight which is not full
                // where length === 0, this is ONLY fights that have no NFTs in them
                // where length  === 1, this is only fights that already have 1 NFT in them

                // THE REASON AN NFT THAT IS MINTED AFTER ROUND 1 ONLY NEEDS TO FIND A FIGHT THAT ALREADY HAS SOMEONE IN, IS BECAUSE WE ARE GOING TO (AS SOON AS AN NFT IS MINTED) POPULATE THE PROCEEDING ROUNDS FIGHTS AT POSITION 0 WITH NFTS FROM PREV ROUND

                return roundNo === 1 ? length < 2 : length === 1

            })
			firstFight.nfts.push(nftId);
			firstFight.save();
        }

        // initially calls the function that gets us our starting point
        findFirstFight(tournament.round)

        // Once we have the first fight populated. We then just need to put that NFT in to all proceeding rounds, fights that have 0 people in them. Doing this means they will autofill at index 0, as long as fight index === 1 && length ===1 is not true, as this wil mark tournament as ready
		
        const remainingRounds = (3 - tournament.round)
        for (i=0; i < remainingRounds; i++) {

            let nextTournament = await Tournament.findOne({round: roundNumberTracker}).populate('fights')
            // console.log(nextTournament.fights)

            let fightToSave = nextTournament.fights.find((fight, index) => {

                console.log(fight)

                let length = fight.nfts.length;
                
                if(index === 1 && length ===1) {
                    tournament.status = "ready";
                    tournament.save();
                }
                return length === 0
            })
                
            if (roundNumberTracker < 10) {
                roundNumberTracker++
            }

            fightToSave.nfts.push(nftId);
            fightToSave.save();

        }
		
		if (!firstFight){ // when 
			 throw new UserInputError('Tournament is full');
		} 
		//TODO: Instead of throwing new error we need to  trigger a new tournament and change
		

        // now use the tournament index of tournament in firstFight
        // 3 - roundNumber of firstFight = the number of loops that need to be made
        // beginning at tournament (firstFight round + 1), loop through x times
        // insert this NFT in to the first available fight

		const tournaments = await getCurrentTournament();
		await tournaments.populate('fights');

		
	} catch (error) {
		throw new UserInputError(error);
	}
};
// putNftIntoAvailibleFight('62305a5fce72d28cb91f5343');

module.exports = {
	Query: {
		async getNfts() {
		try {
			const result = await Nft.find();
			return result;
		} catch (error) {
			throw new Error(error);
		}
		},

		async getNft(_, { nftID }) {
			try {
				const result = await Nft.findById(nftID);
				if (result) {
				return result;
				} else {
				throw new Error('Nft not found');
				}
			} catch (error) {
				throw new Error('Nft not found');
			}
		},
	},

	Mutation: {
		async createNft(_, { createNft }, context) {
			try {
				const nft = await Nft({ ...createNft });
				await nft.save();

				return nft;
			} catch (err) {
				throw new Error(err);
			}
		},

		async mintNft(_, { userId }, context) {
		try {
				const nft = await Nft.findOne({ user: { $exists: false } });

				if (nft) {
					nft.user = userId; // this saves a reference to the User with the 'userId'
					await nft.save();
					await nft.populate('user'); // adds the user reference obj
					
					putNftIntoAvailibleFight(nft.id);
					return nft;
				} else {
					throw new Error('We are out of NFTs');
				}
			} catch (err) {
				throw new Error(err);
			}
		},
	},
};
