//RESOLVERS
//For each query or mutuation there is a resolver, which processes any sort of logic
const Nft = require('../../models/Nft');
const Fight = require('../../models/Fight');
const checkAuth = require('../../middleware/checkAuth');
const { AuthenticationError } = require('apollo-server');
const { getCurrentTournament } = require('./tournament');
const { UserInputError } = require('apollo-server');

const putNftIntoAvailibleFight = async function (nftId) {
	
	//check if any fight is empty if not then make a new
	try {
		const  tournament  = await getCurrentTournament();
		await tournament.populate('fights');

		// finds first fight that has empty slot IF it is the last slot in tournament then change tournament.status to "ready"
		const firstFight = tournament.fights.find((fight, index) => { 
			const length = fight.nfts.length;
			
			if(index === 1 && length ===1) {
				tournament.status = "ready";
				tournament.save();
			}

			return length < 2;			
		})

		console.log('fight', firstFight);

		// const fight = 
		// (await Fight.findOne({ nfts: { $size: 1 } })) ||
		// (await Fight.findOne({ nfts: { $size: 0 } }));
		//current tournament to 'PENDING'
		
		if (!firstFight){ // when 
			throw new UserInputError('Tournament is full');
		} 
		//TODO: Instead of throwing new error we need to  trigger a new tournament and change
		firstFight.nfts.push(nftId);
		firstFight.save();


		const  tournaments  = await getCurrentTournament();
		await tournaments.populate('fights');
		
		console.log('tournaments', tournaments);
		
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
