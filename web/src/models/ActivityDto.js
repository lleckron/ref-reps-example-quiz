export default class ActivityDto {
    timestamp = 0
    questionText = ""
    answers = []

    constructor(timestamp, questionText, answers) {
        this.timestamp = timestamp
        this.questionText = questionText
        this.answers = answers
    }
}