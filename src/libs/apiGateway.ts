import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedBodyAPIGatewayProxyEvent<S> = Omit<
  APIGatewayProxyEvent,
  'body'
> & {
  body: FromSchema<S>;
};
export type ValidatedEventBodyAPIGatewayProxyEvent<S> = Handler<
  ValidatedBodyAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

type ValidatedQueryAPIGatewayProxyEvent<S> = Omit<
  APIGatewayProxyEvent,
  'queryStringParameters'
> & {
  queryStringParameters: FromSchema<S>;
};
export type ValidatedEventQueryAPIGatewayProxyEvent<S> = Handler<
  ValidatedQueryAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export const formatJSONResponse = (
  response: Record<string, unknown>,
  statusCode: number = 200
) => {
  return {
    statusCode,
    body: JSON.stringify(response),
  };
};
