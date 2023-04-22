import mongoose from 'mongoose';
import { ExampleQuizDto } from '../../model/ExampleQuizDto';

const exampleQuizSchema = new mongoose.Schema({
    timestamp: {
        required: true,
        type: Number
    },
    questionText: {
        required: true,
        type: String
    },
    answers: {
        required: true,
        type: Array
    },
})
interface IActivityModel extends ExampleQuizDto, mongoose.Document { }

export default  mongoose.model<IActivityModel>('ExampleQuiz', exampleQuizSchema)
