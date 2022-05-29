/* Project Setting */
/* Initialize node.js: npm init -y */
/* Install Apollo & GraphQL: npm install apollo-server graphql */
/* Install nodemon: npm install nodemon -D */
/* Add "dev": "nodemon server.js" (Run nodemon via 'npm run dev'), "type": "module" (To Use 'Import' Instead of 'require') in package.json */

/* Use ApolloServer from 'apollo-server' Instead of GraphQLServer from 'graphql-yoga' */
import { ApolloServer, gql } from "apollo-server";
import fetch from "node-fetch";

let tweets = [
    {
        id: "1",
        text: "First Tweet",
        userId: "2",
    },
    {
        id: "2",
        text: "Second Tweet",
        userId: "1",
    },
];

let users = [
    {
        id: "1",
        firstName: "Nico",
        lastName: "Las",
    },
    {
        id: "2",
        firstName: "Elon",
        lastName: "Musk",
    },
];

const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
    }
    type Tweet {
        id: ID!
        text: String!
        author: User
    }
    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String]!
        summary: String
        description_full: String!
        synopsis: String
        yt_trailer_code: String!
        language: String!
        background_image: String!
        background_image_original: String!
        small_cover_image: String!
        medium_cover_image: String!
        large_cover_image: String!
    }
    type Query {
        allTweets: [Tweet!]!
        allUsers: [User!]!
        tweet(id: ID!): Tweet
        allMovies: [Movie!]!
        movie(id: String!): Movie
    }
    type Mutation {
        postTweet(userId: ID!, text: String!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`;

const resolvers = {
    Query: {
        allTweets: () => tweets,
        allUsers: () => users,
        tweet: (_, { id }) => tweets.find(tweet => tweet.id === id),
        allMovies: () => fetch("https://yts.mx/api/v2/list_movies.json")
            .then(response => response.json())
            .then(json => json.data.movies),
        movie: (_, { id }) => fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
            .then(response => response.json())
            .then(json => json.data.movie)
    },
    Mutation: {
        postTweet: (_, { userId, text }) => {
            const newTweet = {
                id: tweets.length + 1,
                text: text,
                author: userId
            }
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet: (_, { id }) => {
            const tweet = tweets.find(tweet => tweet.id === id);
            if (!tweet) return false;
            tweets = tweets.filter(tweet => tweet.id !== id);
            return true;
        }
    },
    User: {
        fullName: ({firstName, lastName}) => `${firstName} ${lastName}`
    },
    Tweet: {
        author: ({ userId }) => users.find(user => user.id === userId)
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

/* ApolloServer: server.listen() */
/* GraphQLServer: server.start() */
server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
});