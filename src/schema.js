import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import fetch from 'isomorphic-fetch'
import tuesday from 'mnv-tuesday'

import {
  formSunlightRequest,
  genElectionName,
  isUpForElection
} from './utils'

async function fetchRepsForZipcode (zipcode) {
  try {
    const response = await fetch(formSunlightRequest(zipcode))
    const json = await response.json()
    return json.results
  } catch (error) {
    console.error(error)
  }
}

const ElectionType = new GraphQLObjectType({
  name: 'Election',
  description: 'An election for a United States federal, state, or local office',

  fields: () => ({
    year: {
      type: GraphQLString,
      description: 'Year of the election'
    },
    date: {
      type: GraphQLString,
      description: 'The date of the election',
      resolve: ({ year }) => tuesday(11, year)
    },
    name: {
      type: GraphQLString,
      description: 'Name of the election',
      resolve: ({ year }) => genElectionName(year)
    },
    reps: {
      type: new GraphQLList(RepType),
      description: 'List of representatives whose seat is up during the specified election',
      resolve: async ({ year, zipcode }) =>
        isUpForElection(await fetchRepsForZipcode(zipcode), year)
    }
  })
})

const RepType = new GraphQLObjectType({
  name: 'Rep',

  fields: () => ({
    firstName: {
      type: GraphQLString,
      description: 'Name of rep',
      resolve: rep => rep.first_name
    },
    lastName: {
      type: GraphQLString,
      description: 'Last name of rep',
      resolve: rep => rep.last_name
    },
    title: {
      type: GraphQLString,
      description: 'Title of the representative',
      resolve: rep => rep.title
    }
  })
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: () => ({
    election: {
      type: ElectionType,
      args: {
        year: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'The year you would like to see for the election'
        },
        zipcode: {
          type: new GraphQLNonNull(GraphQLInt),
          description: 'The zipcode for the requesting user'
        }
      },
      resolve: (root, { year, zipcode }) => ({ year, zipcode })
    }
  })
})

export default new GraphQLSchema({
  query: QueryType
})
