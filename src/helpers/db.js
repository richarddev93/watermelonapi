import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const ClientDB = new DynamoDBClient({
  endpoint: "http://192.168.1.154:8000/",
});

const docClient = DynamoDBDocumentClient.from(ClientDB);

export const commandDb = async (command) => {
  try {
    const response = await docClient.send(command);
    return response;
  } catch (error) {
    console.log("Error no client", error);
  }

};
