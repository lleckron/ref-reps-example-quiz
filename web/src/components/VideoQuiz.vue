<template>
    <div class="video-container">
        <video id="quiz-video" src="../assets/P15_Shooting_Foul_2.mp4"></video>
        <div class="controls" id="controls">

            <div class="play-button-div">
                <button class="play-pause-button" id="play-pause-button" @click="togglePlayVideo()" draggable="false">
                    <img v-show="videoStatus === 'Pause'" src="../assets/play.png" draggable="false">
                    <img v-show="videoStatus === 'Play'" src="../assets/pause.png" draggable="false">
                </button>
            </div>

            <div class="video-time" id="video-time" draggable="false" @mouseover="showTooltip = true" @mouseleave="showTooltip = false">
                <TransitionGroup name="toggle-tooltip">
                    <div v-show="showTooltip === true" :key="showTooltip" class="show-tooltip">
                        <div class="tooltip">
                            <p>Click the time to reset the video.</p>
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
    </div>
</template>

<script>

export default {
	name: 'VideoQuiz',
	components: {
		
	},
	data() {
		return {
            videoStatus: 'Pause',
            videoProgressPercent: 0,
            isDraggingSeeker: false,
            videoDuration: '00:00',
            showTooltip: false,
		}
	},
	methods: {
		togglePlayVideo() {
            const video = document.getElementById('quiz-video')
            if (video.paused) {
                video.play()
                this.videoStatus = 'Play'
            } else {
                video.pause()
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
            video.addEventListener('timeupdate', () => {
                const videoCurrentTime = document.getElementById("video-current-time")
                videoCurrentTime.innerHTML = this.formatVideoTime(video.currentTime);
                if (video.duration == video.currentTime) {
                    video.pause()
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
        resetVideo() {
            const video = document.getElementById('quiz-video')
            const seeker = document.getElementById('draggable-seeker')
            const progressBar = document.getElementById('progress-bar')
            const videoCurrentTime = document.getElementById('video-current-time')
            video.currentTime = 0
            seeker.style.left = 0 + '%'
            progressBar.style.width = 0 + '%'
            videoCurrentTime.innerHTML = '00:00'
        },

	},
    mounted() {
        this.setupVideoTimeListeners()
        this.setupProgressBarListeners()
        this.setupResetVideoListeners()
        this.resetVideo()
        setTimeout(() => {
            this.setVideoDuration()
        },100)

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
    margin-top: 50px;
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
    background: #ffffff;
    margin-top: -70px;
    margin-left: -11px;
    border-radius: 6px;
    opacity: .9;
}

.tooltip {
    width: 100%;
    font-size: 15px;
    text-align: center;
}

.tail {
    position: absolute;
    bottom: -20px;
    left: 40px;
    width: 0;
    height: 0;
    border-color:#f9f9f9 transparent transparent transparent;
    border-width: 10px;
    border-style: solid;
}

.toggle-tooltip-leave-from,
.toggle-tooltip-enter-to  {
    opacity: .9;
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