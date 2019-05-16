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

async function traitementUser(githubToken) {
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

    let userRepositories = await getRepositories();


    async function getRepositories() {
        let result = [];
        let repositoriesEdges = [];

        do {
            const repositoriesCursor = repositoriesEdges.length ? repositoriesEdges[repositoriesEdges.length - 1].cursor : '';
            await sleep(100);
            const QUERY = gql`
                {
                    viewer {
                        repositories(first: 100${repositoriesCursor !== '' ? `, after: "${repositoriesCursor}"` : ''}, isFork: false, isLocked: false, orderBy: { field: STARGAZERS, direction: DESC }) {
                            edges {
                                node {
                                    description
                                    name
                                    url
                                    primaryLanguage {
                                        name
                                    }
                                    stargazers {
                                        totalCount
                                    }
                                    owner {
                                        login
                                    }
                                }
                                cursor
                            }
                        }
                    }
                }
                `;

            const response = await client.query({
                query: QUERY,
            });

            repositoriesEdges = response.data.viewer.repositories.edges;
            if (repositoriesEdges.length) {
                const currentBatch = repositoriesEdges.map(edge => edge.node);
                result = [...result, ...currentBatch];
            }

        } while (repositoriesEdges.length > 0);
        return result;
    }

    return userRepositories;
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

    let orgaInfos = await getOrgaInfos();
    let members;
    let memberRepositories;

    try {
        members = await getMembers();
    } catch(e) {
        console.error("Error while fetching element", JSON.stringify(e, undefined, 2));
    }
    console.log(`Number of members: ${members.length}`);

    let membersInError = [];
    let getOrganizationRepositories = makeGetRepositories('organization');
    let getMemberRepositories = makeGetRepositories('user');

    for (member of members) {
        await sleep(25);
        try {
            memberRepositories = await getMemberRepositories(member.login);
        } catch(e) {
            memberRepositories = [];
            console.error('Error while fetching repositories');
            membersInError.push(member.login);
        }
    }

    const organizationRepositories = await getOrganizationRepositories(githubOrganization);


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

    async function getMembers() {
        let result = [];
        let membersEdges = [];

        do {
            const membersCursor = membersEdges.length ? membersEdges[membersEdges.length - 1].cursor : '';
            await sleep(25);
            const QUERY = gql`
            {
                organization(login: "${githubOrganization}") {
                    membersWithRole(first: 100${membersCursor !== '' ? `, after: "${membersCursor}"` : ''}) {
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
                query: QUERY,
            });

            membersEdges = response.data.organization.membersWithRole.edges;
            if (membersEdges.length) {
                const currentBatch = membersEdges.map(edge => edge.node);
                result = [...result, ...currentBatch];
            }
        } while (membersEdges.length > 0);

        return result;
    }


    function makeGetRepositories(field) {
        return async function(login) {
            let result = [];
            let repositoriesEdges = [];

            do {
                const repositoriesCursor = repositoriesEdges.length ? repositoriesEdges[repositoriesEdges.length - 1].cursor : '';
                await sleep(100);
                const QUERY = gql`
                {
                    ${field}(login: "${login}") {
                        repositories(first: 100${repositoriesCursor !== '' ? `, after: "${repositoriesCursor}"` : ''}, isFork: false, isLocked: false) {
                            edges {
                                node {
                                    description
                                    name
                                    url
                                    primaryLanguage {
                                        name
                                    }
                                    stargazers {
                                        totalCount
                                    }
                                    owner {
                                        login
                                    }
                                }
                                cursor
                            }
                        }
                    }
                }
                `;

                const response = await client.query({
                    query: QUERY,
                });

                repositoriesEdges = response.data[field].repositories.edges;
                if (repositoriesEdges.length) {
                    const currentBatch = repositoriesEdges.map(edge => edge.node);
                    result = [...result, ...currentBatch];
                }

            } while (repositoriesEdges.length > 0);
            return result;
        }
    }

    return { orgaInfos, organizationRepositories, memberRepositories };
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.traitementUser = traitementUser;
module.exports.getUserInfo = getUserInfo;
module.exports.traitementOrga = traitementOrga;

