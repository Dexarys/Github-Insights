const { default: ApolloClient, gql } = require('apollo-boost');
const httpie = require('httpie');

async function getUserInfo(githubToken) {
    const client = new ApolloClient({
        uri: `https://api.github.com/graphql?access_token=${githubToken}`,
        fetch: async (uri, options) => {
            const {method} = options
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
            id
            name
            location
            login
            avatarUrl
            bio
            followers {
                totalCount
            }
            following {
                totalCount
            }
            projects {
                totalCount
            }
            repositories {
                totalCount
            }
          }
        }
        `;

    return await client.query({
        query: QUERY,
    });
}

async function traitementOrga(githubToken, githubOrganization) {
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

    const orgaInfos = await getOrgaInfos();

    async function getOrgaInfos() {
        const QUERY = gql`
        {
          organization(login: "${githubOrganization}") {
            name
            description
            avatarUrl
            location
            repositories {
                totalCount
            }
            projects {
                totalCount
            }
          }
          viewer {
            name
            avatarUrl
            login
          }
        }
        `;

        return await client.query({
            query: QUERY,
        });
    }

    return orgaInfos;
}


module.exports.getUserInfo = getUserInfo;
module.exports.traitementOrga = traitementOrga;

