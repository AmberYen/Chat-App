import { GraphQLError } from 'graphql';
import { AppConstants } from '../constants/app.constants';
import { ErrorConstants } from '../constants/errors.constants';

export function VerifyAuthorization(
  _target: any,
  _propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
) {
  const fn = descriptor.value!;
  descriptor.value = async function DescriptorValue(...args: any[]) {
    try {
      if (!args[1][AppConstants.IS_USER_LOGGED]) {
        throw new GraphQLError(ErrorConstants.USER_NOT_AUTHORIZED);
      }
      return await fn.apply(this, args);
    } catch (error) {
      console.log('error', error);
      throw new GraphQLError(ErrorConstants.UNEXPECTED_ERROR);
    }
  };
  return descriptor;
}