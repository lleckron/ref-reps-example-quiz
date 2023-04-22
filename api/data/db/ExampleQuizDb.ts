import {ExampleQuizDto} from "../model/ExampleQuizDto";

export interface ExampleQuizDb {
    createActivity(activity:ExampleQuizDto) : Promise<ExampleQuizDto>;
    getAll():Promise<ExampleQuizDto[]>;
    update(id:string,activity: ExampleQuizDto) : Promise<ExampleQuizDto>;
    findByIdAndDelete(id:string):Promise<ExampleQuizDto>;
}