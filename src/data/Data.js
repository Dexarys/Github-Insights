const { default: ApolloClient, gql } = require('apollo-boost');
const httpie = require('httpie');

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

        client.query({
            query: QUERY,
        })
            .then(resolve).catch((error) => {
            console.log(error);
        });
    })
}


module.exports.getUserInfo = getUserInfo;

