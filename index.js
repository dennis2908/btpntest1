const express = require('express');

const path = require('path');
// Type 3: Persistent datastore with automatic loading
const Datastore = require('nedb');

//dir to save db file

const pathToData = path.resolve(__dirname, "db/dennis")
const db = new Datastore({ filename: pathToData});

const NodeCache = require( "node-cache" );

const myCache = new NodeCache();


db.loadDatabase();

const app = express();

const jwt = require('jsonwebtoken');
const fs = require('fs');

var cors = require('cors');


// Send files from the public directory
app.use(express.static( path.resolve(__dirname, 'public') ));

// Handling JSON data 
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({extended:true})); // to support URL-encoded bodies
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// our API
// GET - /api
app.get("/api", isAuthenticated,(request, response) => {    
    const value = myCache.get("yayah2@yahoo.com");
	//console.log(value);
    db.find({}, function (err, docs) {
        if(err){
            return err;
        } 
        response.json(docs);
    });
});

app.get("/api/findByaccountNumber",isAuthenticated, (request, response) => {    
//console.log(request.body.accountNumber);
    db.find({accountNumber: request.body.accountNumber}, function (err, docs) {
        if(err){
            return err;
        } 
        response.json(docs);
    });
});

app.get("/api/findByIdentityNumber",isAuthenticated, (request, response) => {    
console.log(request.body.IdentityNumber);
    db.find({identityNumber: request.body.IdentityNumber}, function (err, docs) {
        if(err){
            return err;
        } 
        response.json(docs);
    });
});

// POST - /api
app.post("/api",isAuthenticated, (request, response) => {
    // our unix timestamp
    const unixTimeCreated = new Date().getTime();
    // add our unix time as a "created" property and add it to our request.body
    const newData = Object.assign({"Id": unixTimeCreated}, request.body)

    // add in our data object to our database using .insert()
	
	//const obj = { my: "Special", variable: 42 };
	//myCache.set( newData.Id, newData, 10000000000);
	success = myCache.set( toString(newData.Id), newData,10000);
	console.log(newData.Id);
	//console.log(success);
    db.insert(newData, (err, docs) =>{
        if(err){
            return err;
        }
        response.json(docs);
    });
})


// PUT - /api
app.put("/api/:id",isAuthenticated, (request, response)=> {
    // we get the id of the item we want from request.params.id ==> this matches the :id of the URL parameter
    const selectedItemId = parseInt(request.params.id);
    const updatedDataProperties = request.body;
	
	console.log(myCache.get( toString(selectedItemId) ));
	
	//delete cache data
	
	myCache.del(toString(selectedItemId));
	
	//insert to new cache data as if an update with same Id as deleted
	
    success = myCache.set( toString(selectedItemId), updatedDataProperties,10000);
    
   // Set an existing field's value
   db.update({ Id: selectedItemId  }, { $set: updatedDataProperties }, (err, numReplaced) => {
       if(err){
           response.status(404).send("uh oh! something went wrong on update");
       }
        // redirect to "GET" all the latest data
        response.redirect("/api")
   });

});

// DELETE - /api
app.delete('/api/:id',isAuthenticated, (request, response) => {
    // we get the id of the item we want from request.params.id ==> this matches the :id of the URL parameter
    const selectedItemId = parseInt(request.params.id);
	
	console.log(myCache.get( toString(selectedItemId) ));
	
	//delete cache data
	
	myCache.del(toString(selectedItemId));
	
	//delete mongo lite

    db.remove({ Id: selectedItemId }, {}, function (err, numRemoved) {
        if(err){
           response.status(404).send("uh oh! something went wrong on delete");
          }
         // numRemoved = 1
		
		
         response.redirect("/api")
      });

})

app.post("/api/login", (request, response) => {
    if(request.body.username=="dennis" && request.body.password=="12345678"){
		let privateKey = fs.readFileSync('secret/private.pem', 'utf8');
		let token = jwt.sign({ "body": "authorization" }, privateKey, { algorithm: 'HS256',expiresIn: '20m'});
		response.json({"bearer_token":token});
	}
	else {
        response.send('Username or password incorrect');
    }
})

function isAuthenticated(req, res, next) {
	  const authHeader = req.headers['authorization'];
	  //console.log(authHeader);
	  const token = authHeader && authHeader.split(' ')[1];

	  if (token == null) return res.sendStatus(401);
		  let privateKey = fs.readFileSync('secret/private.pem', 'utf8');
	      jwt.verify(token, privateKey, (err, user) => {
				if (err) {
					return res.sendStatus(403);
				}

				req.user = user;
				next();
			});
}

const port = process.env.PORT || 3000

app.listen(port, ()=>{
  console.log(`your app is listening in http://localhost:${port}`);
})