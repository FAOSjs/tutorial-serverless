import { APIGatewayProxyHandler } from "aws-lambda"
import chromium from "chrome-aws-lambda"
import { S3 } from "aws-sdk"
import handlebars from "handlebars"

import { document } from "../utils/dynamodbClient"

import { join } from "path"
import { readFileSync } from "fs"

interface ICreateCertificate { 
   id: string;
   name: string;
   grade: string;
}

interface ITemplate {
   id: string,
   name: string, 
   template: string, 
   medalB64: string, 
   date: string
}

const compileTemplate = async (data: ITemplate) => {
   const filePath = join(process.cwd(), "src", "templates", "certificate.hbs")

   const html = readFileSync(filePath, "utf-8")

   return handlebars.compile(html)(data)

}

export const handler: APIGatewayProxyHandler = async (event) => {
   const { id, name, grade } = JSON.parse(event.body) as ICreateCertificate

   const response = await document.query({
      TableName: "user_certificate",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
         ":id": id
      }
   })
   .promise()
   
   const user = response.Items[0] 

   if(user) {
      return {
         statusCode: 400,
         body: JSON.stringify({ message: "user already exists"})
      }
   }

   document.put({
      TableName: "user_certificate",
      Item: {
         id,
         name,
         grade,
         created_at: new Date().getTime()
      }
   })
   .promise();

   const medalPath = join(process.cwd(), "midia", "selo.png")
   const medalB64 = readFileSync(medalPath, "base64")

   const data: ITemplate = {
      id,
      name,
      grade,
      created_at: new Date(),
      medal: medalB64
   }

   const content= await compileTemplate(data)

   const browser = chromium.puppeteer.launch({
      args: chromiun.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
   })

   const page = await browser.newPage();
   await page.setContent(content)
   const pdf = await page.pdf({
      format: "a4",
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
      path: process.env.IS_OFFLINE ? "./midia/certificate.pdf" : null
   })
   
   await browser.close()

   const s3 = new S3()
   await s3.putObject({
      Bucket: "certificateignite-ls",
      Key: `${id}.pdf`,
      ACL: "public-read",
      Body: pdf,
      ContentType: "application/pdf" 
   }).promise()

   return {
      statusCode: 201,
      body: JSON.stringify({
         message: "certificate was created with successfully",
         url: `https://certificateignite-ls.s3.amazonaws.com/${id}.pdf`
      })
   }
}
