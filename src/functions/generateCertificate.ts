import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from "../utils/dynamodbClient"

interface ICreateCertificate { 
   id: string;
   name: string;
   grade: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
   const { id, name, grade } = JSON.parse(event.body)

   document.put({
      TableName: "user_certificate",
      Item: {
         id,
         name,
         grade,
         created_at: new Date()
      }
   })
   .promise();

   const response = await document.query({
      TableName: "user_certificate",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
         ":id": id
      }
   })
   .promise()

   return {
      statusCode: 201,
      body: JSON.stringify(response.body[0])
   }
}
