//RESOLVERS
//For each query or mutuation there is a resolver, which processes any sort of logic
const Nft = require('../../models/Nft');
const Tournament = require('../../models/Tournament')
const Fight = require('../../models/Fight');
const checkAuth = require('../../middleware/checkAuth');
const { AuthenticationError } = require('apollo-server');
const { getCurrentTournament } = require('./tournament');
const { UserInputError } = require('apollo-server');


const findFirstFight = async (tournament, nftId) => {

	const round = tournament.round
	const fights = tournament.fights;
	for (let i = 0; i < fights.length; i++) {
		const length = fights[i].nfts.length
		if(fights[1].nfts.length === 1 ){
			tournament.status = "ready";
	 		await tournament.save();
		}
		if(round === 1 && (length === 0  || length === 1)){
			fights[i].nfts.push(nftId);
			await fights[i].save();
			break;
		}
		if(round > 1 && length === 1){
			fights[i].nfts.push(nftId);
			await fights[i].save();
			break;
		}
	}
}

const putNftIntoAvailibleFight = async function (nftId) {
	//check if any fight is empty if not then make a new
	let roundNumberTracker
	try {
		//this is getting the first "pending" tournament
		const tournament = await getCurrentTournament();
		await tournament.populate('fights');
        // let mintRoundNumber = tournament.round
        roundNumberTracker = tournament.round + 1;
        await findFirstFight(tournament, nftId)
		
	
        const remainingRounds = (3 - tournament.round)
        for (i=0; i < remainingRounds; i++) {
            let allTournamentsInRound = await Tournament.find({round: roundNumberTracker}).populate('fights')
			breakingLoops:
			for (let j = 0; j < allTournamentsInRound.length; j++) {
				const fights = allTournamentsInRound[j].fights
				for (let i = 0; i < fights.length; i++) {
					const length = fights[i].nfts.length
					if(length === 0  && (fights[i].tournamentIndex < 2)){
						fights[i].nfts.push(nftId);
						await fights[i].save();
						break breakingLoops;
					}
				}
			}
            if (roundNumberTracker < 10) {
                roundNumberTracker++
            }
        }
		
		// if (!firstFight){ // when 
		// 	 throw new UserInputError('Tournament is full');
		// } 

		const  tournaments = await getCurrentTournament();
		await tournaments.populate('fights');
	} catch (error) {

		throw new UserInputError(error);
	}
		
};

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
