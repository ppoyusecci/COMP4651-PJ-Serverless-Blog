"use strict"

const redis = require("redis");
const fs = require('fs');

module.exports = (body, callback) => {
    const client = redis.createClient(6379, process.env.redis);
    client.exists(body, function(err, reply) {
    	if (reply === 1) {
       		client.get(body, (err, reply) => {
    			client.quit();
    			callback(null, reply.toString());
			});
    	} else {
        	var contents = fs.readFileSync('/home/app/function/html/' + body + '.html', 'utf8');
   	 		client.set(body, contents, () => {
    			client.quit();
    			callback(null, contents);
   		 	});
    	}
	});
    
}