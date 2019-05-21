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

Create your OAuth credential on Github.

Next create a .env file with with the following content :

```
adress="http://localhost:<PORT>"
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
docker run -p 80:<PORT> -e VAR_ADRESS=<url> -e VAR_GITHUB_KEY=<YOUR-GITHUB-OAUTH-KEY> -e VAR_GITHUB_SECRET=<YOUR-GITHUB-OAUTH-SECRET-KEY> <container-name> 
```

## Examples

![dashboard](https://github.com/Remanx/Github-Insights/raw/master/examples/dashboard.png)

## Licence

This repository is under Beerware licence, more information into LICENCE file
