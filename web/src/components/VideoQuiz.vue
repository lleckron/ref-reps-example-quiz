<template>
    <div class="video-container">
        <video id="quiz-video" src="../assets/P15_Shooting_Foul_2.mp4"></video>
        <div class="controls" id="controls">
            <div v-show="isDraggingSeeker" class="video-time-clock">
                <p>{{videoSeekerTime}}</p>
            </div>
            <div class="play-button-div">
                <button class="play-pause-button" id="play-pause-button" @click="togglePlayVideo()" draggable="false">
                    <img v-show="videoStatus === 'Pause'" src="../assets/play.png">
                    <img v-show="videoStatus === 'Play'" src="../assets/pause.png">
                </button>
            </div>
            <div class="video-time" id="video-time" draggable="false">
                <span id="video-current-time">00:00</span>
                <span> / </span> 
                <span id="video-duration">00:00</span>
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
            videoSeekerTime: '00:00',
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

	}
}
</script>

<style>

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
    cursor: pointer;
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
    cursor: pointer;
}

</style>