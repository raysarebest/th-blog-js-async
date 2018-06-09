const download = require("request");
const Cache = require("node-cache");
const express = require("express");

const server = express();
const cache = new Cache();
const responseCacheKey = "response";

server.get("/", (serverRequest, serverResponse) => {
    cache.get(responseCacheKey, (cacheError, cachedValue) => {
        if(cacheError || !cachedValue){
            download("https://example.com", (networkError, siteResponse, body) => {
                cache.set(responseCacheKey, body, 60);
                serverResponse.send(body);
                console.log("Downloaded from network");
            });
        }
        else{
            serverResponse.send(cachedValue);
            console.log("Responded from cache");
        }
    });
});

server.listen(3000);