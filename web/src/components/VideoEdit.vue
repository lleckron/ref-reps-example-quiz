<template>
    <div class="edit-video-container">
        <video id="edit-video" src="../assets/P15_Shooting_Foul_2.mp4"></video>
        <div class="edit-controls" id="edit-controls">
            <div class="edit-play-button-div">
                <button class="edit-play-pause-button" id="edit-play-pause-button" @click="togglePlayVideo()" draggable="false">
                    <img v-show="videoStatus === 'Pause'" src="../assets/play.png">
                    <img v-show="videoStatus === 'Play'" src="../assets/pause.png">
                </button>
            </div>
            <div class="edit-video-time" id="edit-video-time" draggable="false">
                <span id="edit-video-current-time">00:00</span>
                <span> / </span> 
                <span id="edit-video-duration">{{videoDuration}}</span>
            </div>
            <div class="edit-progress-div" id="edit-progress-div">
                <div class="edit-progress-bar" id="edit-progress-bar"></div>
                <div class="edit-draggable-seeker" id="edit-draggable-seeker"></div>
            </div>
            <div class="edit-add-timestamp-div" draggable="false">
                <button id="edit-add-timestamp-button" @click="newTimestampButtonClick()">
                    Timestamp
                    <TransitionGroup name="toggle-tooltip">
                        <div v-show="timestampMaxExceeded" :key="timestampMaxExceeded" class="show-exceeded-max-timestamps">
                            <div class="exceeded-max-timestamps">
                                <p>You have reached the maximum amount of timestamps.</p>
                            </div>
                            <div class="exceeded-max-timestamps-tail"></div>
                        </div>
                    </TransitionGroup>
                </button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
	name: 'VideoEdit',
	components: {
		
	},
	data() {
		return {
            videoStatus: 'Pause',
            videoProgressPercent: 0,
            isDraggingSeeker: false,
            videoSeekerTime: '00:00',
            videoDuration: '00:00',
            maxTimestamps: 7,
            timestampMaxExceeded: false
		}
	},
	methods: {
		togglePlayVideo() {
            const video = document.getElementById('edit-video')
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
            const video = document.getElementById('edit-video')
            if(video) {
                const duration = video.duration
                this.videoDuration = this.formatVideoTime(duration)
            }
        },
        setupVideoTimeListeners() {
            const video = document.getElementById('edit-video')
            video.addEventListener('timeupdate', () => {
                const videoCurrentTime = document.getElementById('edit-video-current-time')
                videoCurrentTime.innerHTML = this.formatVideoTime(video.currentTime);
                if (video.duration == video.currentTime) {
                    video.pause()
                    this.videoStatus = 'Pause'
                }
            })
        },
        setupProgressBarListeners() {
            const video = document.getElementById('edit-video')
            video.addEventListener('timeupdate', function() {
                let videoPosition = video.currentTime / video.duration
                let barWidth = videoPosition * 100
                const progressBar = document.getElementById('edit-progress-bar')
                const seeker = document.getElementById('edit-draggable-seeker')
                progressBar.style.width =  barWidth + '%'
                seeker.style.left = barWidth + '%'
            })
        },
        setupResetVideoListeners() {
            const videoTimer = document.getElementById('edit-video-time')
            videoTimer.addEventListener('mousedown', (event) => {
                event.preventDefault()
                this.resetVideo()
            })
        },
        setupSeekerEventListeners() {
            const seeker = document.getElementById('edit-draggable-seeker')
            if(seeker) {
                this.seekerMouseDownListener()
                this.seekerMouseUpListener()
                this.setupProgressDivClickListener()
            }
        },
        setupProgressDivClickListener() {
            const seeker = document.getElementById('edit-draggable-seeker')
            const progressDiv = document.getElementById('edit-progress-div')
            const progressDivRect = progressDiv.getBoundingClientRect()
            const progressDivWidth = progressDivRect.width
            progressDiv.addEventListener('click', (event) => {
                event.preventDefault()
                const progressBar = document.getElementById('edit-progress-bar')
                let newX = event.layerX
                this.videoProgressPercent = newX / progressDivWidth
                seeker.style.left = (this.videoProgressPercent * 100) + '%'
                progressBar.style.width = (this.videoProgressPercent * 100) + '%'

                const video = document.getElementById('edit-video')
                video.currentTime = this.videoProgressPercent * video.duration
            })
        },
        seekerMouseDownListener() {
            const seeker = document.getElementById('edit-draggable-seeker')
            const progressDiv = document.getElementById('edit-progress-div')
            const progressDivRect = progressDiv.getBoundingClientRect()
            const progressDivWidth = progressDivRect.width
            seeker.addEventListener('mousedown', () => {
                this.isDraggingSeeker = true
                progressDiv.addEventListener('mousemove', (event) => {
                    event.preventDefault()
                    if(event.target.id == 'edit-progress-div' || event.target.id == 'edit-progress-bar') {
                        const progressBar = document.getElementById('edit-progress-bar')
                        let newX = event.layerX
                        this.videoProgressPercent = newX / progressDivWidth
                        seeker.style.left = (this.videoProgressPercent * 100) + '%'
                        progressBar.style.width = (this.videoProgressPercent * 100) + '%'
                        
                        const video = document.getElementById('edit-video')
                        let seekerProgress =  this.videoProgressPercent * video.duration
                        this.videoSeekerTime = this.formatTimeForVideo(seekerProgress)
                    }
                })
            })
        },
        seekerMouseUpListener() {
            const seeker = document.getElementById('edit-draggable-seeker')
            const video = document.getElementById('edit-video')
            seeker.addEventListener('mouseup', (event) => {
                event.preventDefault()
                if(event.target.id === 'edit-draggable-seeker') {
                    this.isDraggingSeeker = false
                    video.currentTime = this.videoProgressPercent * video.duration
                    this.replaceVideoControlElements()
                    this.setupSeekerEventListeners() 
                }  
            })

            const videoTimer = document.getElementById('edit-video-time')
            videoTimer.addEventListener('mouseup', (event) => {
                event.preventDefault()
                this.resetVideo()
            })

            const controls = document.getElementById('edit-controls')
            controls.addEventListener('mouseup', (event) => {
                event.preventDefault()
                if(this.isDraggingSeeker === true) {
                    this.isDraggingSeeker = false
                    if(event.layerX <= 145) {
                        video.currentTime = 0
                    } else if(event.layerX >= 836) {
                        video.currentTime = video.duration
                    } else {
                        const progressBar = document.getElementById('edit-progress-bar')
                        const progressDiv = document.getElementById('edit-progress-div')
                        const progressDivRect = progressDiv.getBoundingClientRect()
                        const progressDivWidth = progressDivRect.width
                        let newX = event.layerX - 145
                        this.videoProgressPercent = newX / progressDivWidth
                        seeker.style.left = (this.videoProgressPercent * 100) + '%'
                        progressBar.style.width = (this.videoProgressPercent * 100) + '%'
                        video.currentTime = this.videoProgressPercent * video.duration
                    }
                    this.replaceVideoControlElements()
                    this.setupSeekerEventListeners() 
                }
            })

        },
        replaceVideoControlElements() {
            const seeker = document.getElementById('edit-draggable-seeker')
            const progressDiv = document.getElementById('edit-progress-div')
            const progressBar = document.getElementById('edit-progress-bar')
            const newSeeker = seeker.cloneNode(false)
            const newProgressDiv = progressDiv.cloneNode(false)
            newProgressDiv.appendChild(progressBar)
            newProgressDiv.appendChild(newSeeker)
            progressDiv.replaceWith(newProgressDiv)
        },
        resetVideo() {
            const video = document.getElementById('edit-video')
            const seeker = document.getElementById('edit-draggable-seeker')
            const progressBar = document.getElementById('edit-progress-bar')
            const videoCurrentTime = document.getElementById('edit-video-current-time')
            video.currentTime = 0
            seeker.style.left = 0 + '%'
            progressBar.style.width = 0 + '%'
            videoCurrentTime.innerHTML = '00:00'
        },

	},
    mounted() {
        this.setupVideoTimeListeners()
        this.setupProgressBarListeners()
        this.setupSeekerEventListeners()
        this.setupProgressDivClickListener()
        this.resetVideo()
        setTimeout(() => {
            this.setVideoDuration()
        },100)
    }
}
</script>

<style scoped>

.edit-video-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 50px;
}

#edit-video {
    width: 1000px;
    height: 625px;
}

.edit-controls {
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

.edit-video-time {
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

.edit-video-time span {
    display: flex;
    align-items: center;
    color: white;
    font-size: 13px;
    text-align: center;
}

.edit-play-button-div {
    width: 40px;
    height: 40px;
    margin: 9px 5px 0 10px;
}

.edit-play-pause-button {
    width: 30px;
    height: 30px;
    background: #52746d;
    border: none;
    border-radius: 50%;
    cursor: pointer;
}

.edit-play-pause-button img {
    width: 25px;
    margin-top: 4px;
    margin-left: -3px;
}

.edit-play-pause-button:hover {
    background: #415551;
}

.edit-progress-div {
    position: relative;
    margin: 15px 10px 0 5px;
    width: 690px;
    height: 20px;
    background: black;
    border-radius: 6px;
    cursor: pointer;
}

.edit-progress-bar {
    width: 10px;
    height: 20px;
    background: #FFA500;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
}

.edit-draggable-seeker {
    display: flex;
    position: relative;
    width: 10px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #636363;
    border-radius: 6px;
    left: 0%;
    margin: -30px 0 0 0;
    cursor: pointer;
}

.edit-add-timestamp-div {
    width: 117px;
}

#edit-add-timestamp-button {
    float: right;
    text-align: center;
    border: none;
    font-size: 20px;
    text-shadow: 1px 1px #0e333c;
    color: white;
    background: #4AAE9B;
    width: 117px;
    height: 30px;
    border-radius: 10px;
    margin: 9px -15px 9px 0;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

#edit-add-timestamp-button:hover {
    background: #349b88;
}

</style>