var express = require('express');
var { default: ApolloClient, gql } = require('apollo-boost');
var httpie = require('httpie');
var process = require('process');
var envConf = require('dotenv').config();

function getUserInfo(githubToken) {
    return new Promise((resolve, reject) => {
        const client = new ApolloClient({
            uri: `https://api.github.com/graphql?access_token=${githubToken}`,
            fetch: async (uri, options) => {
                const { method } = options
                options.family = 4
                options.headers = {
                    ...options.headers,
                    'User-Agent': "github-insight"
                }
                const res = await httpie.send(method, uri, options)
                return {
                    text: async () => JSON.stringify(res.data),
                    json: async () => res.data,
                }
            },
            request: operation => {
                operation.setContext({
                    headers: {
                        authorization: `Bearer ${githubToken}`,
                    },
                });
            },
        });

        const GET_USER = gql`
        {
          viewer {
            login
            avatarUrl
          }
        }
        `;

        client.query({
            query: GET_USER,
        })
            .then(resolve).catch((error) => {
            console.log(error);
        });
    })
}


async function traitement(githubToken,githubOrganization,githubId) {
    let urlVizu = `${process.env.adress}/vizu?organization=${githubOrganization}`;

    const client = new ApolloClient({
        uri: `https://api.github.com/graphql?access_token=${githubToken}`,
        fetch: async (uri, options) => {
            const { method } = options;
            options.family = 4;
            options.headers = {
                ...options.headers,
                'User-Agent': githubId
            };
            const res = await httpie.send(method, uri, options);
            return {
                text: async () => JSON.stringify(res.data),
                json: async () => res.data,
            };
        },
    });


}


module.exports.getUserInfo = getUserInfo;

