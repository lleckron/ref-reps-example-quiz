<template>
    <div class="drag-container" id="drag-container">
        <div class="question">
            <h2>{{activity.questionText}}</h2>
        </div>
        <div class="drop-area" id="drop-area">
            <div v-for="(answer,index) in activity.answers" :key="answer" class="drop-div" :id="'drop-div-' + (index + 1)" :style="{left: answer[2] + 'px', top: answer[3] + 'px'}" ></div>
        </div>
        <div class="word-bank">
            <h2>Word Bank</h2>
            <div class="word-bank-container">
                <div v-for="answer in wordBankAnswers" :key="answer" class="word-bank-content" >
                    <p class="word-bank-option" :id="answer" draggable="true">{{answer}}</p>
                </div>
            </div>
            <div class="reset-button-div">
                <button type="button" class="reset-word-bank" @click="resetWordBank()">Reset</button>
            </div>
            <div class="submit-button-div">
                <button type="button" class="submit" id="submit-button" @click="checkAnswers()" disabled>Submit</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DragAndDropPopUp',
    data() {
        return {
            originalWordBank: [],
            wordBankAnswers: [],
            totalAnswers: Number,
            targetID: HTMLElement,
            answerIndex: 1,
            returnAnswer: String
        }
    },
    props:{
        activity: Object
    },
    methods: {
        close() {
            this.$emit('close', this.returnAnswer);
        },
        wordBankSetup(answer) {
            let wordBank = document.getElementById(answer)
            if (wordBank) {
                wordBank.addEventListener('dragstart', (event) => {
                event.currentTarget.classList.add('dragging')
                event.dataTransfer.setData('application/x-moz-node', event.target.id)
                event.dataTransfer.setData('text', event.target.id)
                })
                wordBank.addEventListener('dragend', (event) =>
                    event.target.classList.remove('dragging')
                )
            }
        },
        dropAreaSetup(index) {
            let id = 'drop-div-' + index
            let dropLocation = document.getElementById(id)
            if (dropLocation) {
                dropLocation.addEventListener('dragover', (event) => {
                    event.preventDefault()
                    event.dataTransfer.setData('text', event.target.id)
                })
                dropLocation.addEventListener('drop', (event) => {
                    event.preventDefault()
                    const target = event.target
                    this.targetID = target.id
                    const data = event.dataTransfer.getData('text')
                    const source = document.getElementById(data)
                    const index = this.wordBankAnswers.indexOf(data)
                    if(index !== -1) {
                        this.wordBankDropEvent(source)
                    } else {
                        this.dropDivSwapEvent(source)
                    }
                    this.checkDropDivs()
                })
            }
        },
        wordBankDropEvent(source) {
            const dropTarget = document.getElementById(this.targetID)
            const newElement = document.createElement('p')
            const index = this.answerIndex
            if (newElement) {
                newElement.id = 'drag-answer-' + index
                newElement.draggable = true
                newElement.classList.add('drop-div-text')
                newElement.innerHTML = source.innerHTML
                newElement.style.margin = 5 + 'px ' + 0 + ' ' + 0 + ' ' + 0
                newElement.style.width = 100 + '%'
                newElement.style.textAlign = 'center'

                newElement.addEventListener('mouseenter', (event) => {
                    event.target.style.cursor = 'move'
                })
                newElement.addEventListener('mouseleave', (event) => {
                    event.target.style.cursor = 'cursor'
                })
                newElement.addEventListener('dragstart', (event) => {
                    event.dataTransfer.setData('application/x-moz-node', event.target.id)
                    event.dataTransfer.setData('text', event.target.id)
                })
                if (dropTarget) {
                    dropTarget.appendChild(newElement)
                }
                this.removeAnswerFromWordBank(source.innerHTML)
                this.answerIndex +=1
            }
        },
        dropDivSwapEvent(source) {
            const sourceParent = source.parentNode
            const target = document.getElementById(this.targetID)
            const targetParent = target.parentNode
            if(targetParent.id === 'drop-area') {
                sourceParent.replaceChildren()
                target.appendChild(source)
            } else if(target.hasChildNodes() && targetParent !== sourceParent) {
                targetParent.replaceChildren()
                sourceParent.replaceChildren()
                targetParent.appendChild(source)
                sourceParent.appendChild(target)
            } else {
                return
            }
        },
        removeAnswerFromWordBank(answer) {
            const index = this.wordBankAnswers.indexOf(answer)
            this.wordBankAnswers.splice(index,1)
        },
        resetWordBank() {
            this.wordBankAnswers = []
            for(const answer of this.originalWordBank) {
                this.wordBankAnswers.push(answer)
            }
            for(let i = 1; i <= this.totalAnswers; i++) {
                let id = 'drop-div-' + i
                let element = document.getElementById(id)
                element.replaceChildren()
                element.cloneNode(false)
            }
            setTimeout(() => {
                for(let i = 1; i <= this.totalAnswers; i++) {
                    this.wordBankSetup(this.originalWordBank[i-1])
                }
            }, 10)
            this.toggleButton(true)
            this.answerIndex = 1
        },
        toggleButton(toggle) {
            const submitButton = document.getElementById('submit-button')
            submitButton.disabled = toggle
        },
        checkDropDivs() {
            for(let i = 1; i <= this.totalAnswers; i++) {
                let id = 'drop-div-' + i
                let element = document.getElementById(id)
                if(element.hasChildNodes() !== true) {
                    this.toggleButton(true)
                    return false
                }
            }
            this.toggleButton(false)
            return true
        },
        checkAnswers() {
            let allAnswersCorrect = true
            for(let i = 0; i < this.totalAnswers; i++) {
                let correctAnswer = this.activity.answers[i][0]
                let id = 'drop-div-' + (i + 1)
                let answerElement = document.getElementById(id)
                let answer = answerElement.firstChild.innerHTML
                if(answer !== correctAnswer) {
                    allAnswersCorrect = false
                }
            }
            if(allAnswersCorrect) {
                this.returnAnswer = ('Correct')
            } else {
                this.returnAnswer = ('Incorrect')
            }
            this.close()
        }
    },
    mounted() {
        for(const answer of this.activity.answers) {
            
            this.wordBankAnswers.push(answer[0])
            this.originalWordBank.push(answer[0])
        }
        this.totalAnswers = this.activity.answers.length

        setTimeout(() => {
            for(let i = 1; i <= this.totalAnswers; i++) {
                this.wordBankSetup(this.originalWordBank[i-1])
                this.dropAreaSetup(i)
            }
        }, 10)
    }
}
</script>

<style scoped>

.question {
    position: absolute;
    text-align: center;
    min-width: 1000px;
    max-width: 1000px;
    min-height: 50px;
    max-height: 50px;
    background: #928787;
    margin: -60px 0 0 75px;
    border-radius: 6px;
}

.question h2 {
    color: #ffffff;
    text-shadow: 1px 1px 3px #000000;
    margin-top: 4px;
    font-size: 30px;
}

.drag-container {
    display: flex;
    flex-direction: row;
    min-height: 100%;
    min-width: 100%;
}

.drag-container:first-child {
    margin-right: 10px;
}

.drop-area {
    position: absolute;
    min-width: 1000px;
    max-width: 1000px;
    min-height: 565px;
    max-height: 550px;
    margin-left: 74px;
    margin-top: -10px;
}

.word-bank-container {
    min-width: 178px;
    max-width: 178px;
    min-height: 450px;
    max-height: 450px;
    overflow-y: auto;
}

.word-bank {
    position: absolute;
    right: -110px;
    min-width: 178px;
    max-width: 178px;
    min-height: 614px;
    max-height: 614px;
    background: #0e333c;
    border-radius: 10px;
    margin-top: -8px;
}

.word-bank h2 {
    display: flex;
    color: #ffffff;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    margin: 10px 6px 5px 6px;
    border-bottom: 1px solid #ffffff;
}

.word-bank-content {
    max-width: 130px;
    min-width: 130px;
    max-height: 80px;
    min-height: 40px;
    margin: 20px auto;
    background: #ffffff;
    border-radius: 10px;
    color: #0e333c;
    font-size: 20px;
    font-weight: bold;
}

.word-bank-content:hover {
    cursor: move;
}

.word-bank-option {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 40px;
    max-height: 80px;
    text-align: center;
}

.drop-div {
    position: absolute;
    display: flex;
    justify-content: center;
    min-height: 30px;
    max-height: 60px;
    min-width: 120px;
    max-width: 120px;
    background: #ffffff;
    border: 1px solid #0e333c;
    border-radius: 10px;
    font-size: 20px;
    color: #000000;
}

.drop-div-text {
    width: 100%;
    height: 100%;
}

.drop-div-text:hover {
    cursor: move;
}

.dragging {
    opacity: 50%;
}

.reset-button-div {
    margin: 10px auto;
    min-width: 130px;
    max-width: 130px;
}

.reset-word-bank {
    width: 130px;
    height: 35px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    background: #d8d8d8;
    cursor: pointer;
}

.reset-word-bank:hover {
    box-shadow: 1px 1px 1px #d1d1d1;
}

.submit-button-div {
    margin: 10px auto;
    min-width: 130px;
    max-width: 130px;
}

.submit {
    width: 130px;
    height: 35px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    background: #27e265;
    cursor: pointer;
}

.submit:hover {
    box-shadow: 1px 1px 1px #1ebe54;
}
</style>