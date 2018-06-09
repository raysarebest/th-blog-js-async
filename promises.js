const download = require("request-promise-native");
const Cache = require("node-cache-promise");
const express = require("express");

const server = express();
const cache = new Cache();
const responseCacheKey = "response";

server.get("/", (serverRequest, serverResponse) => {
    function downloadFromNetwork(){
        return download("https://example.com").then((body) => {
            cache.set(responseCacheKey, body, 60);
            serverResponse.send(body);
        }).catch((error) => {
            serverResponse.send("<h1>There was an error</h1><p>Please try again later</p>");
        });
    }
    cache.get(responseCacheKey).then((cachedValue) => {
        if(cachedValue){
            serverResponse.send(cachedValue);
            console.info("Responded from cache");
        }
        else{
            downloadFromNetwork();
            console.info("Downloaded from network");
        }
    }).catch(downloadFromNetwork);
});

server.listen(3000);