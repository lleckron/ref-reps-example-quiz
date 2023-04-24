<template>
    <div class="incorrect-answer">
        <div class="feedback-container">
            <h2 class="feedback">Almost!</h2>
            <button class="return" @click="close()">Back to Quiz</button>
        </div>
    </div>
</template>

<script>

export default ({
    name: 'IncorrectAnswer',
    methods: {
        close() {
            this.$emit('close', 'Incorrect') 
        }
    },
})
</script>

<style scoped>
.incorrect-answer {
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
    box-shadow: 0 0 6px #e9e9e9;
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
</style>