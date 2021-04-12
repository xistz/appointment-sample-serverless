import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { createLogger } from '@libs/logger';
import { Availability } from '@models/availability';
import { v4 as uuidv4 } from 'uuid';
import { formatISO } from 'date-fns';

export class AvailabilitiesDB {
  constructor(
    private readonly docClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
    }),
    private readonly logger = createLogger('AvailabilitiesDB'),
    private readonly availabilitiesTable = process.env.AVAILABILITIES_TABLE
  ) {}

  async create(fpId: string, from: string): Promise<Availability['id']> {
    this.logger.info('creating availability');
    this.logger.info(`from ${from}`);
    const date = new Date(from);
    this.logger.info(`date.toISOString() ${date.toISOString()}`);
    this.logger.info(`formatISO() ${formatISO(date)}`);

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

  async list(fpId: string, from: string, to: string): Promise<Availability[]> {
    this.logger.info('listing availabilities');

    const params: QueryCommandInput = {
      KeyConditionExpression: 'fpId = :fpId and #from between :from and :to',
      ExpressionAttributeNames: {
        '#from': 'from',
      },
      ExpressionAttributeValues: {
        ':fpId': { S: fpId },
        ':from': { S: from },
        ':to': { S: to },
      },
      TableName: this.availabilitiesTable,
    };

    try {
      const result = await this.docClient.send(new QueryCommand(params));
      const items = result.Items;

      this.logger.info('availabilities', result.Items);

      return (items as unknown) as Availability[];
    } catch (error) {
      this.logger.error('error listing availabilities', error);
      return [];
    }
  }

  async delete(id: string, fpId: string): Promise<void> {
    this.logger.info('deleting availability');

    const params: DeleteItemCommandInput = {
      TableName: this.availabilitiesTable,
      Key: {
        id: { S: id },
        fpId: { S: fpId },
      },
    };
    try {
      await this.docClient.send(new DeleteItemCommand(params));
    } catch (error) {
      this.logger.error('could not delete availability', error);
    }
  }
}
