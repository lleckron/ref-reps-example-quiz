<template>
    <div class="edit-video-container">
        <video id="edit-video" src="../assets/P15_Shooting_Foul_2.mp4" @loadedmetadata="setVideoDuration()"></video>
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
                </button>
            </div>

        </div>

        <div class="timestamps-div">
            <ul v-if="timestamps.length >= 1" class="timestamp-ul">
                <li v-for="(timestamp,index) in formattedTimestamps" :key="timestamp">
                    <button id="delete-timestamp-button" @click="deleteTimestamp(index)">X</button>
                    <p class="formatted-timestamp">{{timestamp}}</p>
                    <button class="activity-button" id="activity-button" @click="toggleDragAndDropModal(index)" >
                        <img src="../assets/activity.png">
                    </button>
                </li>
            </ul>

            <button id="save-timestamps-button" @click="updateTimestampList()">Save</button>
        </div>
        <DragAndDrop v-if="modalVisible === true && imageReady === true" :activity="activities[currentActivityIndex]" :image="dragAndDropImage" @close="toggleDragAndDropModal" @save="dragAndDropSave"/>
    </div>
</template>

<script>
import DragAndDrop from './modals/DragAndDrop.vue'
import ActivityDto from '../models/ActivityDto'

export default {
	name: 'VideoEdit',
	components: {
        DragAndDrop
	},
	data() {
		return {
            videoStatus: 'Pause',
            videoProgressPercent: 0,
            isDraggingSeeker: false,
            videoSeekerTime: '00:00',
            videoDuration: '00:00',
            maxTimestamps: 7,
            timestampMaxExceeded: false,
            timestamps: [],
            formattedTimestamps: [],
            activities: [],
            newTimestamp: Number,
            modalVisible: false,
            currentActivityTimestamp: Number,
            currentActivityIndex: Number,
            dragAndDropImage: HTMLCanvasElement,
            imageReady: false
		}
	},
    props: {
        existingActivities: {}
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
        setupExistingActivities() {
            this.activities = this.existingActivities
            for(const activity of this.activities) {
                let timestamp = activity.timestamp
                this.timestamps.push(timestamp)
                this.formattedTimestamps.push(this.formatVideoTime(timestamp))
            }
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
                        this.videoSeekerTime = this.formatVideoTime(seekerProgress)
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
        newTimestampButtonClick() {
            if(this.timestamps.length >= this.maxTimestamps) {
                return
            } else {
                const video = document.getElementById('edit-video')
                this.newTimestamp = video.currentTime
                this.createNewTimestamp()
                this.toggleSaveButton()
            }
        },
        createNewTimestamp() {
            if(this.timestamps.length > 0) {
                let count = 0
                for(const timestamp of this.timestamps) {
                    if(timestamp > this.newTimestamp) {
                        this.timestamps.splice(count, 0, this.newTimestamp)
                        this.formattedTimestamps.splice(count, 0, this.formatVideoTime(this.newTimestamp))
                        this.activities.splice(count, 0, '')
                        break
                    } else if(count == this.timestamps.length-1) {
                        this.timestamps.splice(count+1, 0, this.newTimestamp)
                        this.formattedTimestamps.splice(count+1, 0, this.formatVideoTime(this.newTimestamp))
                        this.activities.splice(count+1, 0, '')
                        break
                    }else {
                        count++
                    }
                }
            } else {
                this.timestamps.splice(0, 0, this.newTimestamp)
                this.formattedTimestamps.splice(0, 0, this.formatVideoTime(this.newTimestamp))
                this.activities.splice(0, 0, '')
            }
            this.toggleSaveButton()
        },
        toggleSaveButton() {
            let count = 0
            for(const activity of this.activities) {
                if(activity === '') {
                    count++
                }
            }
            if(count > 0) {
                document.getElementById('save-timestamps-button').disabled = true
            } else {
                document.getElementById('save-timestamps-button').disabled = false
            }
        },
        deleteTimestamp(deletedTimestampIndex) {
            this.timestamps.splice(deletedTimestampIndex,1)
            this.formattedTimestamps.splice(deletedTimestampIndex,1)
            this.activities.splice(deletedTimestampIndex, 1)
            this.toggleSaveButton()
        },
        moveVideoToTimestampFrame() {
            const video = document.getElementById('edit-video')
            video.currentTime = this.currentActivityTimestamp

            let videoPosition = video.currentTime / video.duration
            let barWidth = videoPosition * 100
            const progressBar = document.getElementById('edit-progress-bar')
            const seeker = document.getElementById('edit-draggable-seeker')
            progressBar.style.width =  barWidth + '%'
            seeker.style.left = barWidth + '%'
        },
        toggleDragAndDropModal(index) {
            this.modalVisible = !this.modalVisible
            
            if(this.modalVisible) {
                this.currentActivityTimestamp = this.timestamps[index]
                this.currentActivityIndex = index
                const video = document.getElementById('edit-video')
                video.pause()
                this.moveVideoToTimestampFrame()
                setTimeout(() => {
                    this.dragAndDropSetup()
                }, 50)
            } else {
                this.imageReady = false
            }
        },
        dragAndDropSetup() {
            const video = document.getElementById('edit-video')
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            const context = canvas.getContext('2d')
            context.drawImage(video, 0, 0, canvas.width, canvas.height)
            this.dragAndDropImage = canvas
            this.imageReady = true
        },
        dragAndDropSave(modalData) {
            this.toggleDragAndDropModal()
            let answers = []
            for(const answer of modalData[1]) {
                answers.push(answer)
            }
            if(this.activities[this.currentActivityIndex].timestamp) {
                this.activities[this.currentActivityIndex].questionText = modalData[0]
                this.activities[this.currentActivityIndex].answers = modalData[1]
            } else {
                this.activities[this.currentActivityIndex] = new ActivityDto(this.currentActivityTimestamp, modalData[0], modalData[1])
            }
            this.toggleSaveButton()
        },
        updateTimestampList() {
            this.$emit('save',this.activities) 
        }
	},
    created() {
        this.setupExistingActivities()
    },
    mounted() {
        setTimeout(() => {
            this.setupVideoTimeListeners()
            this.setupProgressBarListeners()
            this.setupSeekerEventListeners()
            this.setupProgressDivClickListener()
            this.resetVideo()
        }, 10)

        const video = document.getElementById('edit-video')
		video.currentTime = 0
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
}

.edit-controls {
    display: flex;
    position: absolute;
    flex-wrap: wrap;
    margin-top: 613px;
    margin-right: 285px;
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
    cursor: pointer;
}

#edit-add-timestamp-button:hover {
    background: #349b88;
    box-shadow: 0 2px 2px #000000;
}

.timestamps-div {
    position: relative;
    height: 615px;
    min-width: 270px;
    max-width: 270px;
    background: #0e333c;
    margin-left: 15px;
    margin-top: 48px;
    border-radius: 13px;
}

#save-timestamps-button {
    position: absolute;
    left: 0;
    bottom: 0;
    margin: 20px 10px;
    text-align: center;
    font-size: 35px;
    border: none;
    color: white;
    text-shadow: 1px 1px 1px black;
    background: #4AAE9B;
    width: 130px;
    height: 60px;
    border-radius: 15px;
    cursor: pointer;
}

#save-timestamps-button:hover {
    background: #349b88;
    box-shadow: 0 2px 2px #000000;
}

#save-timestamps-button:disabled {
    background: #52746d;
    color: #cfcccc
}

.timestamp-ul {
    margin-left: auto;
    padding: 0 0 0 7px;
}

.timestamp-ul li{
    display: flex;
    flex-direction: row;
    color: white;
    margin: 15px 10px 0 0;
    font-size: 35px;
}

.timestamp-ul img {
    max-height: 35px;
}

#delete-timestamp-button {
    margin: 0 6px 0 6px;
    text-align: center;
    border: none;
    color: white;
    font-weight: bold;
    font-size: 30px;
    text-shadow: 1px 1px 1px black;
    background: #B22222;
    width: 55px;
    height: 55px;
    border-radius: 15px;
    cursor: pointer;
}

#delete-timestamp-button:hover {
    background: #8B0000;
    box-shadow: 0 2px 2px #000000;
}

#activity-button {
    margin: 0 6px 0 6px;
    padding-top: 4px;
    text-align: center;
    border: none;
    color: white;
    font-weight: bold;
    font-size: 25px;
    text-shadow: 1px 1px 1px black;
    background: #4AAE9B;
    width: 55px;
    height: 55px;
    border-radius: 15px;
    cursor: pointer;
}

#activity-button:hover {
    background: #349b88;
    box-shadow: 0 2px 2px #000000;
}

.formatted-timestamp {
    margin: 0 12px 0 12px;
    padding-top: 6px;
}
</style>