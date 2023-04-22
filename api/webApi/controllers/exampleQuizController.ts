import { ExampleQuizDb } from "../../data/db/ExampleQuizDb";
import ExampleQuiz from "../../data/mongo/ExampleQuiz";

class ExampleQuizController {
    private exampleQuizDb: ExampleQuizDb = new ExampleQuiz();

    constructor(exampleQuizDb: ExampleQuizDb){
       this.exampleQuizDb = exampleQuizDb
    }
    

example_quiz_create_activity = async(req, res)=> {
    try {
        res.header('Access-Control-Allow-Origin', '*')
        const dataToSave = await this.exampleQuizDb.createActivity(req.body)
        res.status(200).json(dataToSave)
    }
    catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

example_quiz_get_all = async (req, res)=> {
    try {
        res.header('Access-Control-Allow-Origin', '*')
        const data = await this.exampleQuizDb.getAll();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

example_quiz_update =async (req, res)=> {
    res.header('Access-Control-Allow-Origin', '*')
    const id = req?.params?.id;
    try {

        const result = await this.exampleQuizDb.update(id,req.body)

        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

example_quiz_delete_activity = async (req, res)=> {
    res.header('Access-Control-Allow-Origin', '*')
    try {
        const id = req.params.id;
        const result = await this.exampleQuizDb.findByIdAndDelete(id)
        res.send(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

}
export default ExampleQuizController;
