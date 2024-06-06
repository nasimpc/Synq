# Secure Group Chat Application

## How to use

* step 1: download from git repo
* step 2: npm install
* step 3: .env file creating (example model):
```sh
PORT='3000'
JWT_SECRET_KEY='secretkey'
SIB_API_KEY ='qwiwegnkasdjvakdglasefdiaskdfasdkasgasdkjdfkjadsfkng'

WEBSITE="http://localhost:3000"

BUCKET_NAME = 'jasdfjasdf'
AWS_ACCESS_KEY_ID='asdfasdfasdf'
AWS_SECRET_ACCESS_KEY='asdfasdfasdf'

DATABASE_NAME='chat'
DATABASE_USERNAME='root'
DATABASE_PASSWORD='asdfasdfasdf'
DATABASE_DIALECT='mysql'
DATABASE_HOST='localhost'
```
* step 4: npm start
* step 5: url to start the web application eg: http://localhost:3000(port number)/
* Thank you for using Chat-app. for any futher enquery and support, email: nasimpcm@gmail.com

  # Api documentation
  
  ## List of available Routes
  
  **chat route**:
  
  * `POST chat/add-chat`- for sending chat
  * `POST chat/chat-Image`- for sending images as chat
  * `GET chat/get-chats`- getting chats of all groups
  * `GET chat/get-messages`- getting chats of a specific group (for optimization of the chat application)
  
  **group route**:
  
  * `POST group/create-group`- creating a new group by  a prime user
  * `GET group/groups` - get all groups that the current user have access to
  * `GET group/group` - get group with given groupId
  * `GET get-group-members` - to get other group user details
  
  **purchase route**:
  
  * `POST puchase/buy-premium`- changing from nrmal user to premium user
  
  **user route**:
  
  * `POST user/add-user`- signup
  * `POST user/login`-login
  * `GET user/get-users`- get details about all other users
  * `GET user/get-user`- to get details of current user from saved JWT token in local storage
  
  
  
  
  
