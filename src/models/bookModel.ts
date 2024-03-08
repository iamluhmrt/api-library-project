import { Schema, model } from 'mongoose'
interface IBook {
    name: string
    quantity_page: number
    quantity_reading_days: number
    // created_at: string
    // updated_at: string
}
const bookSchema = new Schema<IBook>(
    {
        name: {
            type: String,
            required: [true, 'Enter the name of the book'],
        },
        quantity_page: {
            type: Number,
            required: [true, 'Enter the number of pages in the book'],
            default: 0,
        },
        quantity_reading_days: {
            type: Number,
            required: [true, 'How many days of reading'],
            default: 0,
        },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
)
export const BookModel = model<IBook>('Book', bookSchema)
