const localConfig = {
  hostname: "localhost",
  baseUrl: "http://localhost:3000",
  inviteLink: "http://localhost:3000/invite?inviteId=",
  resourcesLink: "http://localhost:3000/api/resources",
  devMode: true,
  invoice: {
    receiptType: '011',
    sellPoint: 7,
    concept: 1,
    cuit: 20289094149,
  },
  receipt: {
    receiptType: '015',
    sellPoint: 7,
    concept: 1,
    cuit: 20289094149,
  },
  creditNote: {
    receiptType: '013',
    sellPoint: 7,
    concept: 1,
    cuit: 20289094149,
  }
}

const devConfig = {
  hostname: "crear-app-a94ef456bf1a.herokuapp.com",
  baseUrl: "https://crear-app-a94ef456bf1a.herokuapp.com",
  inviteLink: "https://crear-app-a94ef456bf1a.herokuapp.com/invite?inviteId=",
  resourcesLink: "http://localhost:3000/api/resources",
  devMode: false,
  devel: false,
  invoice: {
    receiptType: '011',
    sellPoint: 7,
    concept: 1,
    cuit: 20289094149,
  },
  receipt: {
    receiptType: '015',
    sellPoint: 7,
    concept: 1,
    cuit: 20289094149,
  },
  creditNote: {
    receiptType: '013',
    sellPoint: 7,
    concept: 1,
    cuit: 20289094149,
  }
}

const prodConfig = {
  hostname: "crear-prod-532897b63fc6.herokuapp.com",
  baseUrl: "https://crear-prod-532897b63fc6.herokuapp.com",
  inviteLink: "https://crear-prod-532897b63fc6.herokuapp.com/invite?inviteId=",
  resourcesLink: "https://crear-app-a94ef456bf1a.herokuapp.com/api/resources",
  devMode: false,
  devel: false,
  invoice: {
    receiptType: '011',
    sellPoint: 4,
    concept: 1,
    cuit: 30640241698,
  },
  receipt: {
    receiptType: '015',
    sellPoint: 4,
    concept: 1,
    cuit: 30640241698,
  },
  creditNote: {
    receiptType: '013',
    sellPoint: 4,
    concept: 1,
    cuit: 30640241698,
  }
}

let config;

if (window.location.hostname === localConfig.hostname) {
  console.log('env local')
  config = require("./local.config.js");  
}

if (window.location.hostname === devConfig.hostname) {
  console.log('env dev')
  config = require("./dev.config.js");  
}

if (window.location.hostname === prodConfig.hostname) {
  console.log('env prod')
  config = require("./prod.config.js");  
}

module.exports = config;