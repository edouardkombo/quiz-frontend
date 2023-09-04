# Quiz Frontend demo

A simple fully responsive, SPA quiz with SSR, built with Vue.js, Tailwind CSS with Nginx proxies. 
The backend part is built using Api-platform from Symfony.

Live version available here: [quizz.xtipper.com](https://quizz.xtipper.com)

To access the back-end and websocket repositories, [please follow this blog post](https://edouardkombo.wordpress.com/2023/09/04/quiz-application-using-api-platform-vuejs-3/)

## Installation

To run the project simply 

1. Copy the nginx file `nginx_quiz.txt` to your nginx sites-enabled folder (make sure to change directories and ports accordingly)

2. Setup the standalone websocket server [located here](https://github.com/edouardkombo/quiz-websockets)

3. Setup the backend api built under API-PLATFORM and Symfony [here](https://github.com/edouardkombo/quiz-api-backend)

4. install the dependencies using: `npm install` and then run:

```
npm run dev
```

