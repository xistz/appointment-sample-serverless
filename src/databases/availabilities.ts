import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { createLogger } from '@libs/logger';
import { Availability } from '@models/availability';
import { v4 as uuidv4 } from 'uuid';

export class AvailabilitiesDB {
  constructor(
    private readonly docClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
    }),
    private readonly logger = createLogger('AvailabilitiesDB'),
    private readonly availabilitiesTable = process.env.AVAILABILITIES_TABLE
  ) {}

  async createAvailability(fpId: string, from: string): Promise<string> {
    this.logger.info('creating availability');

    const id = uuidv4();
    const params: PutItemCommandInput = {
      TableName: this.availabilitiesTable,
      Item: {
        id: { S: id },
        fpId: { S: fpId },
        from: { S: from },
      },
    };

    const data = await this.docClient.send(new PutItemCommand(params));

    this.logger.info('availability created', data);

    return id;
  }

  async listAvailabilities(
    fpId: string,
    from: string,
    to: string
  ): Promise<Availability[]> {
    this.logger.info('listing availabilities');

    const params: QueryCommandInput = {
      KeyConditionExpression: 'fpId = :fpId and from between :from and :to',
      ExpressionAttributeValues: {
        ':fpId': { S: fpId },
        ':from': { S: from },
        ':to': { S: to },
      },
      TableName: this.availabilitiesTable,
    };

    const result = await this.docClient.send(new QueryCommand(params));
    const items = result.Items;

    return (items as unknown) as Availability[];
  }
}
