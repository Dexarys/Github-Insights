# GITHUB-INSIGHTS

## Why

Try to get insights on an Github organization or personnal account.

## How

Minimum Node 8.0.0 is required.

Clone this repository :
```
git clone https://github.com/ripoul/github-insights.git
```

Don't forget to install the dependencies :

```
npm install
```

Next create a .env file with with the following content :

```
adress="http://localhost:3000"
GITHUB_KEY="YOUR-GITHUB-OAUTH-KEY"
GITHUB_SECRET="YOUR-GITHUB-OAUTH-SECRET-KEY"
```

After you can start the project :

Without Docker :

```
npm start
```

With Docker :

```
docker build . -t <container-name> 
docker run 
```

## Examples

## Licence

This repository is under Beerware licence, more information into LICENCE file
