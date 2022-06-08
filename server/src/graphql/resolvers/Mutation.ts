import { ResolverContext } from "../resolvers"
import { MutationResolvers } from "../../resolvers-types.generated"
import { MessageControllers } from '../../controllers/message.controllers';

const messageControllers = new MessageControllers();

const mutationMessageResolver: MutationResolvers<ResolverContext> = {
    createMessage: (_parent, args, ctx) => {
      return messageControllers.createMessage(args, ctx);
    },
}
export default mutationMessageResolver