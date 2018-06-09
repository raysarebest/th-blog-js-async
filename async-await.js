const download = require("request-promise-native");
const Cache = require("node-cache-promise");
const express = require("express");

const server = express();
const cache = new Cache();
const responseCacheKey = "response";

server.get("/", async (serverRequest, serverResponse) => {
    const cachedValue = await cache.get(responseCacheKey);
    if(cachedValue){
        serverResponse.send(cachedValue);
        console.log("Responded from cache");
    }
    else{
        try{
            const body = await download("https://example.com");
            cache.set(responseCacheKey, body, 60);
            serverResponse.send(body);
            console.log("Downloaded from network");
        }
        catch(error){
            serverResponse.send("<h1>There was an error</h1><p>Please try again later</p>");
        }
    }
});

server.listen(3000);