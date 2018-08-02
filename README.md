# CVS Spike

## AWS AppSync Offline

This repository contains a proof of concept to show how AWS-AppSync and graphql can be used to store and syncronise data for an offline first hybrid application.

### Setup
To get the project working locally you'll need to install git secrets as this is used as a prepush check to mitigate the release of secrets into the public. For more information check the [Git Secrets Github Repo](https://github.com/awslabs/git-secrets).

- git clone repo
- npm install
- Create aws config file (aws-config.ts) in the root of the project.
  - The API url and key can be retreived from the cvs-spike api in AWS AppSync

```javascript
export default {
  graphqlEndpoint: "GraphQL Endpoint",
  region: "AWS Region",
  authenticationType: "AppSync Authentication Type"
};

export const config = {
  auth: {
    ClientId: "AWS Cognito Client ID", 
    clientSecret: "AWS Cognito Client Secret",
    cognitoUrl:
      "AWS Cognito User Pool  URL", 
    region: "AWS Region",
    identityProvider: "AWS Cognito Identity Provider - Links to Azure AD Application.",
    userPoolWebClientId: "AWS Cognito Application Client Id",
    UserPoolId: "AWS Cognito User Pool Id",
    identityPoolId: "AWS Cognito Identity Pool Id",
    redirectUri: "Azure AD Redirect URI", 
    logoutUri: "AWS Cognito Logout URI",
    responseType: "OAuth Response Type",  
    scope: "Required Authorization Scope", 
    oAuthEndpoint: "OAuth endpoint (e.g. .../token)"
  },
  cookies: {
    auth: "Auth Cookie Name",
    refresh: "Refresh Cookie Name",
    creds: "Credentials Cookie Name"
  },
  jwt: {
    keysHost: "AWS Cognito Keys Host Name",
    keysPath: "AWS Cognito Keys Path"
  }
};
```

### Running the application

npm run ionic:serve
