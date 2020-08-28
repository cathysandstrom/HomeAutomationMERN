const fs = require('fs');

try {
    module.exports = require("./config.json")
}
catch (e) {
    console.log(e)
    let default_config = {
        port: 4000, 
        stage: "development", 
        alexa_settings: {
            access_token: "",
            token_type: "",
            expires_in: -1,
            scope: ""
        }
    }
    fs.writeFileSync('config.json', JSON.stringify(default_config));
    module.exports = default_config
}

// [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
//     process.on(eventType, cleanUpServer.bind(null, eventType));
//   })