import mongoose from "mongoose";
import {ExampleQuizDb} from "../db/ExampleQuizDb";
import {ExampleQuizDto} from "../model/ExampleQuizDto";
import ExampleQuizSchema from "../mongo/schemas/ExampleQuizSchema"

 class ExampleQuiz implements ExampleQuizDb {
         
    async createActivity(exampleQuiz:ExampleQuizDto) {
        const data = new ExampleQuizSchema({
            timestamp:exampleQuiz.timestamp,
            questionText: exampleQuiz.questionText,
            answers: exampleQuiz.answers
        })
        const dataToSave = await data.save()
        return dataToSave

    }
    async getAll(){
        const data =await ExampleQuizSchema.find()

        return data;

    }
    async update(id:string, activity: ExampleQuizDto){
        const query = {_id: new mongoose.Types.ObjectId(id)}
        const data = await  ExampleQuizSchema.findOneAndUpdate(query,{$set:activity},{new:true})
        return data
    }
    async findByIdAndDelete(id:string){
        const data =  await ExampleQuizSchema.findByIdAndDelete(id); 
        return data;
    }

}
export default ExampleQuiz