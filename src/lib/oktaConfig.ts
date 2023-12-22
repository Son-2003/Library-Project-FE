export const oktaConfig = {
    clientId: '0oadxukcp2c2lfj7C5d7',
    issuer: 'https://dev-71427604.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
} 