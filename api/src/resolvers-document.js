const { collection, prepare } = require('@apland/mongo')
const { ObjectId } = require('mongodb')
const categoryResolvers = require('./resolvers-category')
const userResolver = require('./resolvers-user')
const tenantResolver = require('./resolvers-tenant')

const resolvers = {
  Query: {
    documents: async (obj, args, context) => {
      // Set filter from args
      const filter = args.filter ? args.filter : {}
      // Build sorter
      const sortBy = {}
      if (args.sortBy) {
        sortBy[args.sortBy.field] = args.sortBy.order === 'ASC' ? 1 : -1
      }
      // Filter by tenant if user is logged in
      if (context.user && context.user.tenant) {
        filter.tenant = context.user.tenant
      }
      return (await (await collection('documents')).find(filter).sort(sortBy).toArray()).map(prepare)
    },
    document: async (obj, args, context) => {
      const filter = { _id: ObjectId(args.id) }
      // Filter by tenant
      filter.tenant = context.user.tenant
      return prepare(await (await collection('documents')).findOne(filter))
    },
    documentSearch: async (obj, args, context) => {
      const filter = { $text: { $search: args.query } }
      if (context.user && context.user.tenant) {
        filter.tenant = context.user.tenant
      }
      const field = { score: { $meta: 'textScore' } }
      return (await (await collection('documents')).find(filter).project(field).sort(field).toArray()).map(prepare)
    }
  },
  Mutation: {
    createDocument: async (obj, args, context) => {
      args.created = new Date()
      args.created_by = context.user.id
      args.tenant = context.user.tenant
      return prepare((await (await collection('documents')).insertOne(args)).ops[0])
    },
    updateDocument: async (obj, args, context) => {
      args.updated = new Date()
      args.updated_by = context.user.id
      const filter = { _id: ObjectId(args.id) }
      delete args.id
      return { success: (await (await collection('documents')).updateOne(filter, { $set: args })).result.ok }
    },
    deleteDocument: async (obj, args, context) => {
      args._id = ObjectId(args.id)
      delete args.id
      return { success: (await (await collection('documents')).deleteOne(args)).result.ok }
    }
  },
  Document: {
    category: async (obj, args, context) => {
      return categoryResolvers.Query.category(obj, { id: obj.category }, context)
    },
    created_by: async (obj, args, context) => {
      return userResolver.Query.user(obj, { id: obj.created_by }, context)
    },
    updated_by: async (obj, args, context) => {
      return userResolver.Query.user(obj, { id: obj.updated_by }, context)
    },
    tenant: async (obj, args, context) => {
      return tenantResolver.Query.tenant(obj, { id: obj.tenant }, context)
    }
  }
}

module.exports = resolvers
