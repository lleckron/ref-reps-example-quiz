import { defineStore } from 'pinia'
import axios from 'axios'

export const useExampleQuizStore = defineStore("ExampleQuiz", {
    state: () => ({
        exampleQuizList: [],
    }),
    getters: {
        getExampleQuizzes(state) {
            return state.exampleQuizList
        }
    },
    actions: {
        async fetchExampleQuizzes() {
            try {
                const data = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/examplequiz/getAll`)
                this.exampleQuizList = data.data
                return data.data
            } catch (error) {
                console.log(error);
            }
        },
        async postExampleQuiz(timestamp, questionText, answers) {
            try {
                const data = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/examplequiz/post`,
                    {
                        timestamp: timestamp,
                        questionText: questionText,
                        answers: answers
                    })
                return data.data
            } catch (error) {
                console.error(error)
            }
        },
        async updateExampleQuiz(id, timestamp, questionText, answers) {
            try {
                const data = await axios.put(`${process.env.VUE_APP_API_BASE_URL}/examplequiz/update/${id}`,
                    {
                        timestamp: timestamp,
                        questionText: questionText,
                        answers: answers
                    })
                return data.data
            } catch (error) {
                console.log(error)
            }
        },
        async deleteExampleQuiz(id) {
            try {
                const data = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/examplequiz/delete/${id}`)
                return data.data
            } catch (error) {
                console.log(error)
            }
        }
    }
})