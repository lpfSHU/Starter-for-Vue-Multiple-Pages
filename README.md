## Vue Multiple Pages Starter

### Base on
    webpack4
    vue-loader15

### Features
* Hot reload, api proxy in development
* Long term cache
* HTML, JS, CSS, IMG compressed
* Code split (vue lazy loading routes)

### Usage
* development
  * cd client
  * npm i
  * npm run dev (client dev service : 127.0.0.1:8000)
  * cd server
  * npm i
  * npm run dev (server dev service : 127.0.0.1:3000)


  **A directory with the app.js app.html in the pages folder will be packaged to generate the corresponding html file.**

  then you can visit the following urls

  http://127.0.0.1:8000/public/index

  http://127.0.0.1:8000/public/pageA

  http://127.0.0.1:8000/public/pageA

  http://127.0.0.1:8000/public/pageC/pageC1

  http://127.0.0.1:8000/public/pageC/pageC2

  http://127.0.0.1:8000/api (proxy to service)
* production
  * cd client
  * npm run build (The packaged files will be in the server/public folder)
  * cd server
  * npm run dev (127.0.0.1:3000) (recommend use pm2)

