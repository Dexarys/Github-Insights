# GITHUB-INSIGHTS

Ne pas oublier le .env avec les infos correspondantes


## Install sequelize cli

npm install -g sequelize-cli

npm install sequelize mysql2 --save



sequelize db:init
sequelize db:create



sequelize model:create --name User --attributes 'avatar:string name:string username:string email:string repoNumber:INTEGER starNumber:INTEGER' --force

sequelize db:migrate

sequelize db:migrate:undo ou sequelize db:migrate:undo:all pour revenir et upgrade si besoin
