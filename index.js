import { CreateTableCommand,DeleteTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ endpoint: "http://192.168.1.154:8000/"});


const commandDeleteTable = new DeleteTableCommand({
  TableName: "books",
});
const dynamoDBTable = {
    TableName: 'books',
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'id', KeyType: 'HASH' },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 2,
      WriteCapacityUnits: 2,
    }
  };

const commandCreateTableBooks = new CreateTableCommand(dynamoDBTable);


export const main = async () => {
//   const command = new CreateTableCommand({
//     TableName: "EspressoDrinks",
//     // For more information about data types,
//     // see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes and
//     // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.DataTypeDescriptors
//     AttributeDefinitions: [
//       {
//         AttributeName: "DrinkName",
//         AttributeType: "S",
//       },
//     ],
//     KeySchema: [
//       {
//         AttributeName: "DrinkName",
//         KeyType: "HASH",
//       },
//     ],
//     ProvisionedThroughput: {
//       ReadCapacityUnits: 1,
//       WriteCapacityUnits: 1,
//     },
//   });

  const response = await client.send(commandCreateTableBooks);
  console.log(response);
  return response;
};



main()

console.log(client)