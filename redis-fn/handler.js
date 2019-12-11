"use strict"

const redis = require("redis");
const fs = require('fs');

var pageCache = ["insertpost", "new", "list", "getpost"];

module.exports = (body, callback) => {
  const client = redis.createClient(6379, process.env.redis);
  if (body == "flush") {
    var len = pageCache.length;
    for (var i = 0; i < len; i++) {
      client.del(pageCache[i], (err, reply) => {});
    }
    client.quit();
    pageCache = [];
    callback(null, "del finished")
  }
  else {
    client.exists(body, function(err, reply) {
      if (reply === 1) {
     	    client.get(body, (err, reply) => {
  		    client.quit();
  		    callback(null, reply);
	      });
      } 
      else {
        var contents = fs.readFileSync('/home/app/function/html/' + body + '.html', 'utf8');
 	 	    client.set(body, contents, () => {
          pageCache.push(body);
          client.quit();
  		    callback(null, contents);
        });
      }
    });
  }

}