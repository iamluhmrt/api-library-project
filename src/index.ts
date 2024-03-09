// Habilita as variáveis de ambiente
import dotenv from 'dotenv'
dotenv.config()

// import libraries
import express from 'express'
import db from 'mongoose'
import { BookModel } from './models/bookModel.ts'

// config express router
const port = process.env.PORT || 3033
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// routes
app.get('/', (req, res) => {
    res.send('Hello')
})

// fetch books
app.get('/books', async (req, res) => {
    try {
        const books = await BookModel.find({})
        const response = books.map(
            ({ name, quantity_page, quantity_reading_days, _id }) => {
                return {
                    id: _id,
                    name,
                    pages: quantity_page,
                    readingDays: quantity_reading_days,
                }
            }
        )
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// fetch books from id
app.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params
        const book = await BookModel.findById(id)
        const response = {
            id: book._id,
            name: book.name,
            pages: book.quantity_page,
            readingDays: book.quantity_reading_days,
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// create a book
app.post('/book', async (req, res) => {
    try {
        // Mapper de Entrada para Model
        const reqBook = {
            name: req.body.name,
            quantity_page: req.body.pages,
            quantity_reading_days: req.body.readingDays,
        }
        const book = await BookModel.create(reqBook)
        // Mapper Model para Resposta
        const response = {
            id: book._id,
            name: book.name.trimStart().trimEnd(),
            pages: book.quantity_page,
            readingDays: book.quantity_reading_days,
        }
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

// update a book
app.put('/books/:id', async (req, res) => {
    try {
        const { id } = req.params
        const book = await BookModel.findByIdAndUpdate(id, req.body)
        if (!book) {
            return res
                .status(404)
                .json({ message: `Cannot find any book with ID ${id}` })
        }
        // Mapper de Entrada para Model
        const reqBook = {
            name: req.body.name,
            quantity_page: req.body.pages,
            quantity_reading_days: req.body.readingDays,
        }
        const updateBook = await BookModel.findById(reqBook)
        res.status(200).json(updateBook)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// delete a book
app.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params
        const book = await BookModel.findByIdAndDelete(id)
        if (!book) {
            return res
                .status(404)
                .json({ message: `Cannot find any book with ID` })
        }
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// connection with mongodb and start server
db.connect(process.env.DB_CONNECTION_STRING)
    .then(() => {
        console.log('connected to MongoDB')
        app.listen(port, () => {
            console.log(`Node API is running on port ${port}!`)
        })
    })
    .catch((error) => {
        console.log('error')
    })
