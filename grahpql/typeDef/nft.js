const gql = require('graphql-tag');

module.exports = gql`

    type Nft {

        id: ID!,
        user: User,
        background: String!,
        bodyType: String!,
        jewellery: String!, 
        tattoos: String!,
        hairStyle: String!,
        eyeColor: String!,
        facialHair: String!,
        clothing: String!, 
        shorts: String!,
        mouth: String!,
        headgear: String!,
        gloves: String!,
        bruisingOrBlood: String!,
        image: String!,
        fights:[Fight]
    }

    input NftDetails{
        background: String!,
        bodyType: String!,
        jewellery: String!, 
        tattoos: String!,
        hairStyle: String!,
        eyeColor: String!,
        facialHair: String!,
        clothing: String!, 
        shorts: String!,
        mouth: String!,
        headgear: String!,
        gloves: String!,
        bruisingOrBlood: String!,
        image: String!
    }

    type Query{
		getNfts: [Nft]!,
		getNft(nftID: ID!): Nft!,
        getNftFights(nftID: ID!): [Fight]
    }

	type Mutation{
	
	   	createNft(nftDetails: NftDetails!): Nft!,
		mintNft: Nft!,	
		
    }

`