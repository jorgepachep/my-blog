import { MongoClient, ServerApiVersion } from 'mongodb'

const WithDB = async (operations) => {
  try {
    const client = await CreateConnection().connect()
    const db = await client.db('my-blog')

    await operations(db)

    client.close()
  } catch (error) {
    res
      .status(500)
      .json({ message: 'something went wrong!!', errors: error, errores })
  }
}

const CreateConnection = () => {
  const uri =
    'mongodb+srv://jpache:test12345@cluster0.jkdbun3.mongodb.net/?retryWrites=true&w=majority'
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  })
  return client
}

export { CreateConnection, WithDB }
