import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import mongooseToSwagger from 'mongoose-to-swagger';
import { User } from './models/user.js' 
import { Order } from './models/order.js';
import { Coupon } from './models/coupon.js';
import { Product } from './models/product.js';

const userSchemaSwagger = mongooseToSwagger(User);
const productSchemaSwagger = mongooseToSwagger(Product);
const orderSchemaSwagger = mongooseToSwagger(Order);
const couponSchemaSwagger = mongooseToSwagger(Coupon);

const options: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'dot-ecom server',
      version: '1.0.0',
      description: `
         To access the protected routes, you need to retrieve your Firebase token(some work to be done eh?). Follow these steps:

         1. Go to the frontend (Sign up or Login page).
         2. Complete the Sign up or Login action.
         3. In the Developer Tools (F12 or Ctrl+Shift+I), go to the Network tab.
         4. Find the request related to Sign up or Login (e.g., POST /api/v1/signup or POST /api/v1/login).
         5. In the Response Headers or Cookies, find the Firebase ID Token.

         6. Use the token here to test the protected routes.
         7. Click on the Authorize button in Swagger UI.
         8. Enter the token in the following format:

         <Firebase-ID-Token> [note:-Don't include Bearer(It is included by default)]

        Happy testing the API! If you ran into any issues, feel free to hit me up on the social links provided on the github profile.

        special note:- to avoid the token retrieval process from frontend, a separate api could have been created(that basically returns test token and that could be used to test the 
        protected routes)
        but i was lazy to do that haha, so you have to go through the process. If you are interested, create a PR and I will be more than happy to merge it.
      `,
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Local server',
      },
      {
        url:'https://dot-ecom-server.vercel.app',
        description:'Prod-server',
      }
    ],
    components: {
      schemas: {
        User: {
          ...userSchemaSwagger,
          properties: {
            ...userSchemaSwagger.properties,
            _id:{
              description:"Firebase uid"
            },
            age: {
              type: 'integer',
              description: 'Calculated age (virtual field)',
            },
          },
        },
        Product:productSchemaSwagger,
        Order:orderSchemaSwagger,
        Coupon:couponSchemaSwagger,
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;