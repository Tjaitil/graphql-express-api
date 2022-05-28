const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Import data
const playerData = require('./data/players');
const teamsData = require('./data/teams');

const schema = buildSchema(`
    type Query {
        player: Player,
        players: [Player],
        teams: [Team],
        team(name: String): Team,
    },
    type Player {
        id: Int!,
        name: String,
        team: Int,
        nationality: String,
    }
    type Team {
        id: Int,
        name: String,
        league: String,
        country: String,
        players: [Player],  
    }
`)

// Helper functions for resolvers
const getTeamPlayers = (id) => {
    return playerData.filter(player => player.team === id);
} 
const getTeam = (name) => {
    return teamsData.find(team => team.name === name);
}


const root = {
    players: () => playerData,
    teams: () => {
        // Return team with players
        return teamsData.map(team => ({
            ...team,
            players: getTeamPlayers(team.id),
        }));
    },
    team: arg => {
        // Find team based on argument
        const { name } = arg;
        const team = getTeam(name);
        return {
            ...team,
            players: getTeamPlayers(team.id),
        }
    },
    createPlayer: (arg) => {
        console.log(arg);

    }
};

const app = express();
// Initalize app, graphiql is set to true to get interface on frontend
app.listen(4000, () => console.log("App running on 4000"));
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}))
