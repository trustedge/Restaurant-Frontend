/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: process.env.PATH_PREFIX!.substring(1) + "-restaurantfrontend",
      home: "aws",
      removal: input?.stage === "prod" ? "retain" : "remove",
      providers: { aws: "6.71.0" },
      region: "us-east-1"
    };
  },
  async run() {
   
    // Create the API
    const api = new sst.aws.ApiGatewayV2("Api", {
      cors: true,
    });
    
    // Add routes to the API
    api.route("GET /api/orders", { 
      handler: "functions/orders.handler",
      environment: {
        DYNAMODB_ORDERS_TABLE: process.env.DYNAMODB_ORDER_TABLE_NAME! ,
      },
      permissions: [{
        actions: ["dynamodb:*"],
        resources: ["*"]
      }],
    });
    
    api.route("GET /api/menu", { 
      handler: "functions/menu.handler",
      environment: {
        DYNAMODB_MENU_TABLE: process.env.DYNAMODB_MENU_TABLE_NAME!,
      },
      permissions: [{
        actions: ["dynamodb:*"],
        resources: ["*"]
      }],
    });
    
    api.route("GET /api/menu/{id}", { 
      handler: "functions/menu.handler",
      environment: {
        DYNAMODB_MENU_TABLE: process.env.DYNAMODB_MENU_TABLE_NAME!,
      },
      permissions: [{
        actions: ["dynamodb:*"],
        resources: ["*"]
      }],
    });
    
    api.route("POST /api/menu", { 
      handler: "functions/menu.handler",
      environment: {
        DYNAMODB_MENU_TABLE: process.env.DYNAMODB_MENU_TABLE_NAME!,
      },
      permissions: [{
        actions: ["dynamodb:*"],
        resources: ["*"]
      }],
    });
    
    api.route("PUT /api/menu/{id}", { 
      handler: "functions/menu.handler",
      environment: {
        DYNAMODB_MENU_TABLE: process.env.DYNAMODB_MENU_TABLE_NAME!,
      },
      permissions: [{
        actions: ["dynamodb:*"],
        resources: ["*"]
      }],
    });
    
    api.route("DELETE /api/menu/{id}", { 
      handler: "functions/menu.handler",
      environment: {
        DYNAMODB_MENU_TABLE: process.env.DYNAMODB_MENU_TABLE_NAME!,
      },
      permissions: [{
        actions: ["dynamodb:*"],
        resources: ["*"]
      }],
    });
    
    api.route("GET /api/settings", { 
      handler: "functions/settings.handler",
      environment: {
        PATH_PREFIX: process.env.PATH_PREFIX || "",
      },
      permissions: [{
        actions: ["ssm:GetParameter", "ssm:PutParameter"],
        resources: ["*"]
      }],
    });
    
    api.route("PUT /api/settings", { 
      handler: "functions/settings.handler",
      environment: {
        PATH_PREFIX: process.env.PATH_PREFIX || "",
      },
      permissions: [{
        actions: ["ssm:GetParameter", "ssm:PutParameter"],
        resources: ["*"]
      }],
    });

    // Create the NextJS site
    const site = new sst.aws.Nextjs("RestaurantFrontend", {
      environment: {
        NEXT_PUBLIC_API_URL: api.url,
      },
      domain: process.env.DOMAIN_URL ? {
        name: process.env.PATH_PREFIX?.substring(1) + "." + process.env.DOMAIN_URL,
        aliases: ["www." + process.env.PATH_PREFIX?.substring(1) + "." + process.env.DOMAIN_URL],
        dns: sst.aws.dns({
          zone: process.env.HOSTED_ZONE
        })
      } : undefined,
    });

    // Return outputs
    return {
      ApiEndpoint: api.url,
      CloudFrontURL: site.url,
      SiteURL: process.env.PATH_PREFIX?.substring(1) + "." + process.env.DOMAIN_URL
    };
  },
});
