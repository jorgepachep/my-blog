import express from 'express'
import bodyParser from 'body-parser'
import { CreateConnection, WithDB } from './mongodb.data'
import path from 'path'

const app = express()

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'/build')))
const articleEndPoint = '/api/articles'
const articleNameEndPoint = `${articleEndPoint}/:name`

app.get(articleNameEndPoint, async (req, res) => {
  const articleName = req.params.name
  WithDB(async (db) => {
    const articleInfo = await db.collection('articles').findOne({
      name: articleName,
    })
    res.status(200).json(articleInfo)
  })
})

app.post(`${articleNameEndPoint}/upvote`, async (req, res) => {
  WithDB(async (db) => {
    const articleName = req.params.name
    const articleCollection = db.collection('articles')
    const articleInfo = await articleCollection.findOne({ name: articleName })

    await articleCollection.updateOne(
      { name: articleName },
      { $set: { upvotes: articleInfo.upvotes + 1 } }
    )
    const updatedArticleInfo = await articleCollection.findOne({
      name: articleName,
    })
    res.status(200).json(updatedArticleInfo)
  })
})

app.post(`${articleNameEndPoint}/add-comment`, async (req, res) => {
  const articleName = req.params.name
  const { username, text } = req.body

  WithDB(async (db) => {
    const articleCollection = db.collection('articles')
    const articleInfo = await articleCollection.findOne({ name: articleName })

    await articleCollection.updateOne(
      { name: articleName },
      {
        $set: {
          comments: articleInfo.comments.concat({
            username,
            text,
          }),
        },
      }
    )

    const updatedArticleInfo = await articleCollection.findOne({
      name: articleName,
    })

    return res.status(200).send(updatedArticleInfo)
  })
})

const listenPort = 3001
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname + '/build/index.html'))
})
app.listen(listenPort, () => console.log('listen on port ', listenPort))
