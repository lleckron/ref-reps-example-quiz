<template>
    <div class="video-container">
        <video id="quiz-video" src="../assets/P15_Shooting_Foul_2.mp4" @loadedmetadata="setVideoDuration()"></video>
        <div v-if="dragAndDropReady" class="show-drag-and-drop">
            <DragAndDropQuizQuestion :activity="activities[questionCounter]" @close="hideDragAndDrop"/>
        </div>
        <div class="controls" id="controls">

            <div class="play-button-div">
                <button class="play-pause-button" id="play-pause-button" @click="togglePlayVideo()" draggable="false">
                    <img v-show="videoStatus === 'Pause'" src="../assets/play.png" draggable="false">
                    <img v-show="videoStatus === 'Play'" src="../assets/pause.png" draggable="false">
                </button>
            </div>

            <div class="video-time" id="video-time" draggable="false" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
                <TransitionGroup name="toggle-tooltip">
                    <div v-show="showTooltip === true && dragAndDropReady === false" :key="showTooltip" class="show-tooltip" id="show-tooltip">
                        <div class="tooltip">
                            <p>Click the time to reset the quiz.</p>
                        </div>
                        <div class="tail" :key="showTooltip"></div>
                    </div>
                </TransitionGroup>
                <span id="video-current-time">00:00</span>
                <span> / </span> 
                <span id="video-duration">{{videoDuration}}</span>
            </div>

            <div class="progress-div" id="progress-div">
                <div class="progress-bar" id="progress-bar"></div>
                <div class="draggable-seeker" id="draggable-seeker"></div>
            </div>

        </div>
        <CorrectAnswer v-if="showCorrectFeedback === true" @close="toggleFeedback" />
        <IncorrectAnswer v-if="showIncorrectFeedback === true" @close="toggleFeedback" />
    </div>
</template>

<script>
import DragAndDropQuizQuestion from './DragAndDropQuizQuestion.vue'
import CorrectAnswer from './modals/CorrectAnswer.vue'
import IncorrectAnswer from './modals/IncorrectAnswer.vue'

export default {
	name: 'VideoQuiz',
	components: {
        DragAndDropQuizQuestion,
        CorrectAnswer,
        IncorrectAnswer
	},
	data() {
		return {
            videoStatus: 'Pause',
            videoProgressPercent: 0,
            isDraggingSeeker: false,
            videoDuration: '00:00',
            showTooltip: false,
            dragAndDropReady: false,
            questionCounter: 0,
            timestamps: [],
            results: [],
            showCorrectFeedback: false,
            showIncorrectFeedback: false
		}
	},
    props: {
        activities: {}
    },
	methods: {
		async togglePlayVideo() {
            const video = document.getElementById('quiz-video')
            if (video.paused) {
                await video.play()
                this.videoStatus = 'Play'
            } else {
                await video.pause()
                this.videoStatus = 'Pause'
            }
        },
        formatVideoTime(seconds) {
            let minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            if (minutes < 10) {
              minutes = "0" + minutes
            }
            if (seconds < 10) {
              seconds = "0" + seconds
            }
            return minutes + ":" + seconds;
        },
        setVideoDuration() {
            const video = document.getElementById('quiz-video')
            if(video) {
                const duration = video.duration
                this.videoDuration = this.formatVideoTime(duration)
            }
        },
        setupVideoTimeListeners() {
            const video = document.getElementById('quiz-video')
            video.addEventListener('timeupdate', async () => {
                const videoCurrentTime = document.getElementById("video-current-time")
                videoCurrentTime.innerHTML = this.formatVideoTime(video.currentTime)

                if (video.duration == video.currentTime) {
                    await video.pause()
                    this.videoStatus = 'Pause'
                }
            })
        },
        setupProgressBarListeners() {
            const video = document.getElementById('quiz-video')
            video.addEventListener('timeupdate', function() {
                let videoPosition = video.currentTime / video.duration
                let barWidth = videoPosition * 100
                const progressBar = document.getElementById('progress-bar')
                const seeker = document.getElementById('draggable-seeker')
                progressBar.style.width =  barWidth + '%'
                seeker.style.left = barWidth + '%'
            })
        },
        setupResetVideoListeners() {
            const videoTimer = document.getElementById('video-time')

            videoTimer.addEventListener('mousedown', (event) => {
                event.preventDefault()
                this.resetVideo()
            })
        },
        setupQuestionTimestampListeners() {
            const video = document.getElementById('quiz-video')
            video.addEventListener('timeupdate', async () => {
                if(video.currentTime >= this.timestamps[this.questionCounter]) {
                    await video.pause()
                    this.videoStatus = 'Pause'
                    this.dragAndDropReady = true

                    const playButton = document.getElementById('play-pause-button')
                    playButton.disabled = true
                    playButton.classList.add('disabled-play-button')
                }
            })
        },
        setupTimestampsArray() {
            for(const activity of this.activities) {
                this.timestamps.push(activity.timestamp)
            }
        },
        resetVideo() {
            if(this.dragAndDropReady === false) {
                const video = document.getElementById('quiz-video')
                const seeker = document.getElementById('draggable-seeker')
                const progressBar = document.getElementById('progress-bar')
                const videoCurrentTime = document.getElementById('video-current-time')
                video.currentTime = 0
                seeker.style.left = 0 + '%'
                progressBar.style.width = 0 + '%'
                videoCurrentTime.innerHTML = '00:00'
                this.questionCounter = 0
                this.results = []
                this.dragAndDropReady = false
            }
        },
        async hideDragAndDrop(questionResult) {
            this.dragAndDropReady = false
            this.results.push(questionResult)
            if(questionResult === 'Correct') {
                this.showCorrectFeedback = true
            } else {
                this.showIncorrectFeedback = true
            }
            this.setupResetVideoListeners()
            this.questionCounter++

            const playButton = document.getElementById('play-pause-button')
            playButton.disabled = false
            playButton.classList.remove('disabled-play-button')
        },
        async toggleFeedback(type) {
            console.log(type)
            if(type === 'Correct') {
                this.showCorrectFeedback = false
            } else {
                this.showIncorrectFeedback = false
            }
            await this.togglePlayVideo()
        }

	},
    mounted() {
        setTimeout(() => {
            this.setupVideoTimeListeners()
            this.setupProgressBarListeners()
            this.setupResetVideoListeners()
            this.resetVideo()
            this.setupTimestampsArray()
            this.setupQuestionTimestampListeners()
        }, 40)
        
        const video = document.getElementById('quiz-video')
        video.currentTime = 0
    }
}
</script>

<style scoped>

.video-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 75px;
}

#quiz-video {
    width: 1000px;
    height: 625px;
}

.controls {
    display: flex;
    position: absolute;
    flex-wrap: wrap;
    margin-top: 613px;
    background: #0e333c;
    width: 1000px;
    height: 50px;
    border-bottom-right-radius: 13px;
    border-bottom-left-radius: 13px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.video-time {
    display: flex;
    flex-direction: row;
    width: 75px;
    margin-right: 10px;
    justify-content: space-between;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    cursor: pointer;
}

.video-time span {
    display: flex;
    align-items: center;
    color: white;
    font-size: 13px;
    text-align: center;
}

.play-button-div {
    width: 40px;
    height: 40px;
    margin: 9px 5px 0 10px;
}

.play-pause-button {
    width: 30px;
    height: 30px;
    background: #52746d;
    border: none;
    border-radius: 50%;
    cursor: pointer;
}

.play-pause-button img {
    width: 25px;
    margin-left: -3px;
    margin-top: 4px;
}

.play-pause-button:hover {
    background: #415551;
}

.disabled-play-button {
    background: #415551;
    cursor: not-allowed;
}

.progress-div {
    position: relative;
    margin: 15px 10px 0 5px;
    width: 690px;
    height: 20px;
    background: black;
    border-radius: 6px;
}

.progress-bar {
    width: 10px;
    height: 20px;
    background: #FFA500;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
}

.draggable-seeker {
    display: flex;
    position: relative;
    width: 10px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #636363;
    border-radius: 6px;
    left: 0%;
    margin: -30px 0 0 0;
}

.show-tooltip {
    position: absolute;
    min-width: 100px;
    max-width: 100px;
    min-height: 80px;
    max-height: 80px;
    background: #5a5a5a;
    color: #ffffff;
    margin-top: -70px;
    margin-left: -11px;
    border-radius: 6px;
    opacity: .85;
}

.tooltip {
    width: 100%;
    font-size: 15px;
    text-align: center;
    text-shadow: 1px 0 black;
}

.tail {
    position: absolute;
    bottom: -20px;
    left: 40px;
    width: 0;
    height: 0;
    border-color:#5a5a5a transparent transparent transparent;
    border-width: 10px;
    border-style: solid;
}

.show-drag-and-drop {
    position: absolute;
    margin: 0;
    padding: 0;
    min-width: 1150px;
    max-width: 1150px;
    min-height: 550px;
    max-height: 550px;
}

.toggle-tooltip-leave-from,
.toggle-tooltip-enter-to  {
    opacity: .85;
}

.toggle-tooltip-leave-to,
.toggle-tooltip-enter-from {
    opacity: 0;
}

.toggle-tooltip-leave-active {
  transition: all .1s ease-in-out;
}

.toggle-tooltip-enter-active {
  transition: all .25s ease-in-out;
}

</style>