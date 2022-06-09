import {
  ApolloServer,
  gql
} from "apollo-server-express";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";

import { AppConstants } from "../constants/app.constants";
import resolvers from "../graphql/resolvers";
import { RedisPubSub } from "graphql-redis-subscriptions";

const SCHEMA = loadSchemaSync(AppConstants.GRAPHQL_SCHEMA_PATH, {
  loaders: [new GraphQLFileLoader()],
});

const graphqlSchema = addResolversToSchema({
  schema: SCHEMA,
  resolvers
});

const mockDbContext = {
  db: {
    createMessage: jest.fn()
  }
}

const mockRedisClient = {
  publish: jest.fn(),
  subscribe: jest.fn(),
  on: () => {} 
};

const mockOptions = {
  publisher: (mockRedisClient as any),
  subscriber: (mockRedisClient as any),
};
const pubsub = new RedisPubSub(mockOptions);

const createMessageMutation = gql`
  mutation CreateMessage($senderId: String!, $receiverId: String!, $message: String!) {
    createMessage(senderId: $senderId, receiverId: $receiverId, message: $message) {
      message
    }
  }
`

describe('[Mutation.createMessage]', () => {
  let testServer: ApolloServer;
  const senderEmail = 'user001@example.com';
  const { createMessage } = mockDbContext.db;
  const { publish } = mockRedisClient;
  const targetMessage = 'hello world';

  beforeAll(() => {
    testServer = new ApolloServer({
      schema: graphqlSchema,
      context: () => ({ isUserLogged: true, email: senderEmail, db: mockDbContext.db, pubsub }) // bypass auth verification
    });
  });

  afterAll(async () => {
    await testServer?.stop();
  })


  it('should returns correct message and call pubshb functions', async () => {
    createMessage.mockReturnValue({ message: targetMessage });

    const result = await testServer.executeOperation({
      query: createMessageMutation,
      variables: { senderId: '', receiverId: '', message: targetMessage },
    });

    expect(createMessage.call.length).toBe(1);
    expect(publish.call.length).toBe(1);
    expect(result.data?.createMessage.message).toBe(targetMessage);
    pubsub.close();
  })
})