import { StackContext, App, Api, Table, NextjsSite } from "sst/constructs";

export default {
  config(_input: any) {
    return {
      name: process.env.PATH_PREFIX?.substring(1)+"-restaurantfrontend",
      region: "us-east-1"
    };
  },
  stacks(app: App) {
    app.stack(function Site({ stack }: StackContext) {
      const table = new Table(stack, "Orders", {
        fields: {
          OrderNumber: "string",
        },
        primaryIndex: { partitionKey: "OrderNumber" },
      });

      const api = new Api(stack, "Api", {
        cors: true,
        routes: {
          "GET /api/orders": {
            function: {
              handler: "functions/orders.handler",
              environment: {
                DYNAMODB_ORDERS_TABLE: table.tableName,
              },
              permissions: [table],
            },
          },
          "GET /api/menu": {
            function: {
              handler: "functions/menu.handler",
              environment: {
                DYNAMODB_MENU_TABLE: process.env.DYNAMODB_MENU_TABLE_NAME || 'Menu',
              },
              permissions: ["dynamodb:*"],
            },
          },
          "GET /api/menu/{id}": {
            function: {
              handler: "functions/menu.handler",
              environment: {
                DYNAMODB_MENU_TABLE: process.env.DYNAMODB_MENU_TABLE_NAME!,
              },
              permissions: ["dynamodb:*"],
            },
          },
          "POST /api/menu": {
            function: {
              handler: "functions/menu.handler",
              environment: {
                DYNAMODB_MENU_TABLE: process.env.DYNAMODB_MENU_TABLE_NAME!,
              },
              permissions: ["dynamodb:*"],
            },
          },
          "PUT /api/menu/{id}": {
            function: {
              handler: "functions/menu.handler",
              environment: {
                DYNAMODB_MENU_TABLE: process.env.DYNAMODB_MENU_TABLE_NAME!,
              },
              permissions: ["dynamodb:*"],
            },
          },
          "DELETE /api/menu/{id}": {
            function: {
              handler: "functions/menu.handler",
              environment: {
                DYNAMODB_MENU_TABLE: process.env.DYNAMODB_MENU_TABLE_NAME!,
              },
              permissions: ["dynamodb:*"],
            },
          },
          "GET /api/settings": {
            function: {
              handler: "functions/settings.handler",
              environment: {
                PATH_PREFIX: process.env.PATH_PREFIX || "",
              },
              permissions: ["ssm:GetParameter", "ssm:PutParameter"],
            },
          },
          "PUT /api/settings": {
            function: {
              handler: "functions/settings.handler",
              environment: {
                PATH_PREFIX: process.env.PATH_PREFIX || "",
              },
              permissions: ["ssm:GetParameter", "ssm:PutParameter"],
            },
          },
        },
      });

      const site = new NextjsSite(stack, "Web", {
        environment: {
          NEXT_PUBLIC_API_URL: api.url,
        },
        customDomain:
          stack.stage === "prod"
            ? {
                domainName: process.env.PATH_PREFIX?.substring(1)+"."+process.env.DOMAIN_URL,
                domainAlias: "www."+process.env.PATH_PREFIX?.substring(1)+"."+process.env.DOMAIN_URL,
                hostedZone: process.env.DOMAIN_URL,
                // acmCertificate: process.env.CERTIFICATE_ARN
              }
            : undefined,
      });

      stack.addOutputs({
        ApiEndpoint: api.url,
        CloudFrontURL: site.url,
        SiteURL:process.env.PATH_PREFIX?.substring(1)+"."+process.env.DOMAIN_URL
      });
    });
  },
};
