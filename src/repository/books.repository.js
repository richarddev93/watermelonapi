import { v4 as uuidv4 } from "uuid";
import {
  PutCommand,
  ScanCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { commandDb } from "../helpers/db.js";
import { ExportConflictException } from "@aws-sdk/client-dynamodb";

const tableName = "books";

async function getByIdLastPullChange(idUser, last_pull_change) {
  console.log("3 - repository - getByIdLastPullChange", last_pull_change);
  const isHaveLastPullDate =
    last_pull_change === "null" ? null : last_pull_change;
  let ExpressionAttributeValues = {
    ":value1": parseInt(last_pull_change),
  };

  let FilterExpression = "last_pulled_at  > :value1";

  try {
    if (idUser && isHaveLastPullDate) {
      ExpressionAttributeValues = !!isHaveLastPullDate
        ? {
            ":value1": idUser,
            ":value2": parseInt(last_pull_change),
          }
        : {
            ":value1": idUser,
          };
      FilterExpression = !!isHaveLastPullDate
        ? "id = :value1 AND last_pulled_at > :value2"
        : "id  = :value1";
    }


    const params = !isHaveLastPullDate ? {
      ProjectionExpression:
        "#id, title, id_book, body,is_pinned,created_at,updated_at, last_pulled_at, lessons",
      ExpressionAttributeNames: { "#id": "id" },
      TableName: tableName,
    } : {
      ProjectionExpression:
        "#id, title, id_book, body,is_pinned,created_at,updated_at, last_pulled_at, lessons",
      FilterExpression: FilterExpression,
      ExpressionAttributeNames: { "#id": "id" },
      ExpressionAttributeValues: ExpressionAttributeValues,
      TableName: tableName,
    }
    
    console.log(params)
    const command = new ScanCommand(params);

    const response = await commandDb(command);
    return response.Items || [];
  } catch (error) {
    console.error("ERROR - repository - book", error);
  }
}

async function getAll() {
  const command = new ScanCommand({
    ProjectionExpression:
      "#id, title, id_book, body,is_pinned,created_at,updated_at, last_pulled_at, lessons",
    ExpressionAttributeNames: { "#id": "id" },
    TableName: tableName,
  });

  const response = await commandDb(command);
  return response.Items;
}

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
    return response;
  } catch (error) {
    console.error("Error in findByID:", error);
    throw error;
  }
}

async function create(data) {
  const params = {
    TableName: tableName,
    Item: {
      ...data,
    },
  };

  try {
    const command = new PutCommand(params);
    const response = await commandDb(command);
    return response;
  } catch (error) {
    console.error("Error in create:", error);
    throw error;
  }
}

async function update(id, data) {
  const ExpressionAttributeValues = {};
  for (const [key, value] of Object.entries(data)) {
    ExpressionAttributeValues[`:${key}`] = value;
  }

  ExpressionAttributeValues[":updated_at"] = Date.now();

  const ExpressionAttributeNames = {};
  for (const [key, value] of Object.entries(data)) {
    ExpressionAttributeNames[`#${key}`] = key;
  }
  ExpressionAttributeNames["#updated_at"] = "updated_at";

  const UpdateExpression =
    "set " +
    Object.keys(data)
      .map((key) => `#${key} = :${key}`)
      .join(", ") +
    `, #updated_at = :updated_at`;

  const params = {
    TableName: tableName,
    Key: {
      id: id,
    },
    UpdateExpression: UpdateExpression,
    ExpressionAttributeNames: ExpressionAttributeNames,
    ExpressionAttributeValues: ExpressionAttributeValues,
    ReturnValues: `UPDATED_NEW`,
  };

  try {
    const command = new UpdateCommand(params);
    const response = await commandDb(command);
    return response;
  } catch (error) {
    console.error("Error in create:", error);
    throw error;
  }
}

async function deleteByID(id) {
  const params = {
    TableName: tableName,
    Key: {
      id: id,
    },
  };

  try {
    const command = new DeleteCommand(params);
    const response = await commandDb(command);
    return response;
  } catch (error) {
    console.error("Error in deleteByID:", error);
    throw error;
  }
}

export default {
  getByIdLastPullChange,
  getAll,
  findByID,
  create,
  update,
  deleteByID,
};
