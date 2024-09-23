# My Event Manager
This project is oriented to the creation, manipulation and management of events and invitations to them

### Characteristics
- Login and Registration system
- Events Creation and edition
- Invitation creation
- Invitation acceptance and rejection
- Event Subscription and Unsubscription
- File system that provides the respective media to the application ( multer, gridfs and express)

## Future Characteristics:
- User profile edition. (frontend and backend)
- Home page extra functionalities (frontend)
- Invitation deletion ( frontend )



## Installation:

### Do wanna run this project on your own? Follow this steps:
- Install node v20.12.2 or more recent versions and npm 10.5.0 or more recent
- Clone this repository
- Create a Mongo db host (on your own) or a Mongo Atlas cluster
- Create an "auth.json" file in the folder "backend\services\db\" with the following information: { connectionString: " mongodb conection string " }
- Run in the terminal:
  - For production: 
    - npm install
    - npm run build ( vite build process)
    - npm run start 
  - For development:
    - npm install
    - npm run dev 
    - npm run css:watch ( tailwind CLI ) 

