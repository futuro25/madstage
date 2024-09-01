const config = {
  mongo_uri: 'mongodb+srv://madstagedbuser:madstagepassword@madstage.vqiomwa.mongodb.net/madstage?retryWrites=true&w=majority',
  api_url: 'https://madstage-a16bef77c5b8.herokuapp.com',
  env: 'dev',
  mercadopago: {
    appId: "4605538507969464",
    clientId: "4605538507969464",
    publicKey: "APP_USR-6caf154b-70d0-41a7-b383-911f86f1db69",
    accessToken: "APP_USR-4605538507969464-082617-4bc28467da08978e692566911a5385e4-99922095",
    clientSecret: "sfzWzgl1R6rK0gCn6ZSNVbiDSkRaB78s",
    preference: {
      back_urls: {
        success: 'http://madstage.com/success',
        failure: 'http://madstage.com/failure',
        pending: 'http://madstage.com/pending',
      },
      additional_info: 'Tu compra en Madstage store',
      auto_return: 'all',
      binary_mode: true,
      marketplace: 'marketplace',
      notification_url: 'http://madstage.com/payment-notifications',
      statement_descriptor: 'Mad stage store',
    },
  }
}

module.exports = config;