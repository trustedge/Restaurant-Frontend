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
          id: "string",
        },
        primaryIndex: { partitionKey: "id" },
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
      });

      stack.addOutputs({
        ApiEndpoint: api.url,
        SiteUrl: site.url,
      });
    });
  },
};
