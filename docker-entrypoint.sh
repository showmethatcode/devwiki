# docker-entrypoint.sh for node.js

echo "wait db server"
dockerize -wait tcp://db:5432 -timeout 20s

echo "start node server"
npx prisma migrate dev --name=init
npm start