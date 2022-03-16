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

        const findFirstFight = async (roundNo) => {
            firstFight =  tournament.fights.find( async (fight, index)  => {
                const length = fight.nfts.length;
                if(index === 1 && length ===1) {
                    tournament.status = "ready";
                    await tournament.save();
                }
                return tournament.round === 1 ? length < 2 : length === 1

            })
			firstFight.nfts.push(nftId);
			await firstFight.save();
        }

        await findFirstFight(tournament.round)

		
        const remainingRounds = (3 - tournament.round)
        for (i=0; i < remainingRounds; i++) {

            let nextTournament = await Tournament.findOne({round: roundNumberTracker}).populate('fights')

            let fightToSave = nextTournament.fights.find(async (fight, index) => {


                let length = fight.nfts.length;
                
                if(index === 1 && length ===1) {
                    tournament.status = "ready";
                    await tournament.save();
                }
                return length === 0
            })
                
            if (roundNumberTracker < 10) {
                roundNumberTracker++
            }

            fightToSave.nfts.push(nftId);
            await fightToSave.save();

        }
		
		if (!firstFight){ // when 
			 throw new UserInputError('Tournament is full');
		} 

		const  tournaments = await getCurrentTournament();
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
