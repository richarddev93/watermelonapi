import { v4 as uuidv4 } from "uuid";
import { PutCommand, ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

import { commandDb} from "../helpers/db.js";

const tableName = "lessons";


async function getAll(){
    const command = new ScanCommand({
      ProjectionExpression: "#id, lessonId, last_pull_change",
      ExpressionAttributeNames: { "#id": "id" },
      TableName: tableName,
    });
  
    const response = await commandDb(command);
    for (const bird of response.Items) {
      console.log(`bird`, response);
    }
    return response.Items;
  };

async function findByID(UserID) {
  const params = {
    TableName: tableName,
    Key: {
      UserID,
    },
  };

  try {
    const command = new GetCommand(params);
    const response = await commandDb(command);
    return response
  } catch (error) {
    console.error("Error in findByID:", error);
    throw error;
  }
}

async function create(data) {

  const params = {
    TableName: tableName,
    Item: {
      id: uuidv4(),
      lessonId: data.lessonId,
      books_id: data.books_id,
      last_pull_change: data.last_pull_change,
      id_device: data.id_device,
      id_user: data.id_user,
    },
  };

  try {
    const command = new PutCommand(params);
    const response = await commandDb(command);
    return response
  } catch (error) {
    console.error("Error in create:", error);
    throw error;
  }
}

async function update(id, data) {
  const params = {
    TableName: tableName,
    Key: {
      UserID: UserID,
    },
    UpdateExpression: `set #Username = :Username`,
    ExpressionAttributeNames: {
      "#Username": `Username`,
    },
    ExpressionAttributeValues: {
      ":Username": data.Username,
    },
    ReturnValues: `UPDATED_NEW`,
  };

  try {
    const update = await db.update(params).promise();
    return update.Attributes;
  } catch (error) {
    console.error("Error in update:", error);
    throw error;
  }
}

async function deleteByID(id) {
  const params = {
    TableName: tableName,
    Key: {
      UserID,
    },
  };

  try {
    const result = await db.delete(params).promise();
    return result;
  } catch (error) {
    console.error("Error in deleteByID:", error);
    throw error;
  }
}

export default {
    getAll,
  findByID,
  create,
  update,
  deleteByID,
};
