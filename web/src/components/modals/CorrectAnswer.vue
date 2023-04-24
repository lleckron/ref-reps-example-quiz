<template>
    <div class="correct-answer">
        <div class="feedback-container">
            <h2 class="feedback">Nice Job!</h2>
            <button class="return" @click="close()">Back to Quiz</button>
        </div>
    </div>
</template>

<script>
import confetti from 'canvas-confetti'

export default ({
    name: 'CorrectAnswer',
    methods: {
        close() {
            this.$emit('close', 'Correct') 
        }
    },
    mounted() {
        confetti({
            ticks: 60
        })
    }
})
</script>

<style scoped>
.correct-answer {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
}

.feedback-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 200px;
    width: 250px;
    background: #0e333c;
    border-radius: 12px;
    box-shadow: 0 0 6px #c9c9c9;
}

.feedback {
    color: #ffffff;
    font-size: 35px;
}

.return {
    border: none;
    height: 50px;
    width: 120px;
    border-radius: 6px;
    background: #e9e9e9;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}

.return:hover {
    background: #c9c9c9;
    box-shadow: 0 0 12px #000000;
}

@media only screen and (max-height: 599px) {
    .correct-answer {
        height: 150%;
    }
    .feedback-container {
        margin-top: 75px;
    }
}

@media only screen and (min-height: 600px) and (max-height: 800px) {
    .correct-answer {
        height: 120%;
    }
    .feedback-container {
        margin-top: 75px;
    }
}
</style>