const gql = require('graphql-tag');

module.exports = gql `
    scalar Date

    type Tournament {
        id: ID!,
        startDate: Date,
        status: String,
        fights: [Fight],
        round: Number!
    }   

    input CreateTournament{
        startDate: Date,
        status: String,
        round: Number!
    }

    input TournamentInput{
        id: ID!,
        startDate: Date,
        status: String,
        fights:[FightInput],
        round: Number!
    }

    type Query{

        getTournaments: [Tournament],
        getTournament(tournamentId: ID!): Tournament!,
        getCurrentTournament: Tournament!

    },

    type Mutation{

        createTournament(createTournament: CreateTournament): Tournament!, 
        updateTournament(tournament: TournamentInput): Tournament!  

    }

`