import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql';

import authRoutes from './routes/authRoutes.js'
import childRoutes from './routes/childRoutes.js'
import videoRoutes from './routes/videoRoutes.js'
import playlistRoutes from './routes/playlistRoutes.js'
import { graphQLschema } from './graphql/schema.js'
import { graphqlResolvers } from './graphql/resolver.js';


const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

// GraphQL configuration
app.use('/graphql', graphqlHTTP({
  schema: graphQLschema,
  rootValue: graphqlResolvers,
  graphiql: true,
}));


// Routes
app.use('/api', authRoutes);
app.use('/api', childRoutes);
app.use('/api', videoRoutes);
app.use('/api', playlistRoutes);

export default app;