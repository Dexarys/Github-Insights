var express = require('express');
var { default: ApolloClient, gql } = require('apollo-boost');
var httpie = require('httpie');
var process = require('process');
var envConf = require('dotenv').config();
var ProgressBar = require('progress');

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

        const QUERY = gql`
        {
          viewer {
            login
            avatarUrl
          }
        }
        `;

        client.query({
            query: QUERY,
        })
            .then(resolve).catch((error) => {
            console.log(error);
        });
    })
}


async function traitement(githubToken,githubOrganization,githubId) {
    const client = new ApolloClient({
        uri: `https://api.github.com/graphql?access_token=${githubToken}`,
        fetch: async (uri, options) => {
            const { method } = options
            options.family = 4
            options.headers = {
                ...options.headers,
                'User-Agent': githubId
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

    const orgaInfos = await getOrgaInfos();
    let members;
    try {
        members = await getMembers();
    } catch(e) {
        console.error('Error while fetching members', JSON.stringify(e, undefined, 2));
        process.exit(1);
    }
    console.log(`Number of members: ${members.length}`);

    return { orgaInfos: orgaInfos, members: members };


    async function getOrgaInfos() {
        let result = [];

        const QUERY = gql`
            {
                organization(login: "${githubOrganization}") {
                    name
                    description
                    avatarUrl
                    location
                }
            }
        `;
        return await client.query({
            query: QUERY
        });
    }

    async function getMembers() {
        let result = [];
        let membersEdges = [];

        do {
            const membersCursor = membersEdges.length ? membersEdges[membersEdges.length - 1].cursor : '';
            await sleep(25);
            const QUERY = gql`
                    {
                        organization(login: "${githubOrganization}") {
                            membersWithRole(first: 20${membersCursor !== '' ? `, after: "${membersCursor}"` : ''}) {
                                edges {
                                    node {
                                        login
                                        name
                                    }
                                    cursor
                                }
                            }
                        }
                    }
                `;
            const response = await client.query({
                query: QUERY
            });
            membersEdges = response.data.organization.membersWithRole.edges;
            if (membersEdges.length) {
                const currentBatch = membersEdges.map(edge => edge.node);
                result = [...result, ...currentBatch];
            }
        } while (membersEdges.length > 0);

        return result;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}







module.exports.getUserInfo = getUserInfo;
module.exports.traitement = traitement;

