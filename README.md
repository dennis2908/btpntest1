# Used technology :

1. node JS
2. mongo lite (neDB) because mongo DB online is not available for me
3. node-cache will update to node-cache each time on add,update,delete case because redis online is not available.
4. jsonwebtoken
5. Postman
6. Auth token auto generate 
7. bearer token Authorization

# Instalation and running server locally :
1. Use command prompt and direct to root folder and type :</br>
  $ npm install</br>
  $ npm start</br>
  Server will run on localhost:3000
2. Open Postman and import API Test BTPN.postman_collection.json from postman folder.</br>
3. On Postman, click API POST Login and click send.</br>
   It will generate and response a bearer Token.</br> 
   Use it for another request by putting the bearer token to Authorization</br>
   
# Running server online (https://michaeldennis.herokuapp.com):
1. Open Postman and import API michaeldennis.herokuapp.com.postman_collection.json from postman folder.</br>
2. On Postman, click API POST Login and click send.</br>
   It will generate and response a bearer Token.</br> 
   Use it for another request by putting the bearer token to Authorization</br>   