import express from'express';
import ExampleQuizController from '../controllers/exampleQuizController'
import ExampleQuiz from '../../data/mongo/ExampleQuiz'

const router = express.Router()

const exampleQuizController = new ExampleQuizController(new ExampleQuiz())

//Post Method
router.post('/examplequiz/post', exampleQuizController.example_quiz_create_activity)

//Get all Method
router.get('/examplequiz/getAll', exampleQuizController.example_quiz_get_all)

//Update by ID Method
router.put('/examplequiz/update/:id', exampleQuizController.example_quiz_update)

router.delete('/examplequiz/delete/:id', exampleQuizController.example_quiz_delete_activity)
module.exports = router;