import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { createLogger } from '@libs/logger';
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
    const params = {
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
}
