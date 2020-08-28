require('dotenv').config()
const ngrok = require('ngrok');
const colors = require('colors');
var config = require('../globals.js');
const axios = require('axios');

//const url = await ngrok.connect(port);


const updateSkillManifest = async (accessToken) => {
    const alexa_request = axios.create({
        baseURL: 'http://api.amazonalexa.com',
        headers: {
            'Authorization': accessToken
        }
    })
    var skillId = process.env.skill_id;

    try {
        var skillManifest = null;
        const getManifest = await alexa_request.get(`/v1/skills/${skillId}/stages/${config.stage}/manifest`);
        if (getManifest.statusCode == 200) {
            skillManifest = getManifest.body;
        } else {
            throw new Error(`Error fetching Skill Manifest: ${getManifest.statusCode}`);
        }

        skillManifest.manifest.apis.custom.endpoint.sslCertificateType = "Wildcard";
        skillManifest.manifest.apis.custom.endpoint.uri = url;

        const putManifest = await alexa_request.put(`/v1/skills/${skillId}/stages/${config.stage}/manifest`, {
            headers: {
                'Authorization': accessToken,
                'Content-Type': 'application/json'
            },
            data: skillManifest
        })

        if (putManifest.statusCode != 202) {
            throw new Error(`Error fetching Skill Manifest: ${putManifest.statusCode}`);
        }
    } catch (err) {
        throw new Error(err);
    }

}

function save_authentication(auth_token, type, expiration, scope) {
    data = {
        access_token: auth_token,
        token_type: type,
        expires_in: expiration,
        scope: scope
    }

    config.alexa_settings = data;
    fs.writeFile('../config.json', JSON.stringify(default_config), (err) => {
        if(err) console.log(err);
    });
}




//http://localhost:3001/oauth2/callback
//?access_token=Atza%7CIwEBIFkpKiPpqtxQfIOMz0mXnE8a7TNZALmXlDgUWWY98scNp9_7kmVi6eQZgqhtcyB5lKcYjb1FPnKnH8Ll70n0ngPpjrySmcgfVfil5o1YdR5oM7HSKoB73UinOPwkdcw8AWnirTX6nE_QiQEVrfAIvRWa6tj2alVMgQhF4ZkluYPxLK_bWoCJViT0M53_4jMQMIiYvXymc9TFaKoPfskq46dRIlS2k8TLwd030OKqOdgN35QBFT8NA6oHCiv1b-Q96_svO2YwJwPjor8dDfrRdNCZzO6h3tqy2lzuoO27lcecrxXAJaZOTMr-BvBQOc5SnuYjbE8AqzMvdNPvLO_7zyF_QB9XK5MWZW55gXSYIJeJaSL8OU_tM7L493XV9eKHJeZTghNiPv7uL9wQV9uFuDP2&
//token_type=bearer&
//expires_in=975&
//scope=alexa%3A%3Aask%3Askills%3Areadwrite