<template>
	<NavbarHeader :mode="videoMode" @toggle="toggleVideoMode"/>
	<VideoQuiz v-show="videoMode === 'Quiz'" />
	<VideoEdit v-show="videoMode === 'Edit'" />
</template>

<script>
import NavbarHeader from './components/NavbarHeader.vue'
import VideoQuiz from './components/VideoQuiz.vue'
import VideoEdit from './components/VideoEdit.vue'

export default {
	name: 'App',
	components: {
		NavbarHeader,
		VideoQuiz,
		VideoEdit
	},
	data() {
		return {
			videoMode: 'Quiz',
			activities: [],
		}
	},
	methods: {
		toggleVideoMode(mode) {
			if(mode === 'Quiz') {
				const video = document.getElementById('quiz-video')
				video.currentTime = 0
			} else if(mode === 'Edit') {
				const video = document.getElementById('edit-video')
				video.currentTime = 0
			}
			this.videoMode = mode
		}
	}
}
</script>

<style>

html {
	width: 100vw;
    height: 100vh;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin: 0;
	padding: 0;
}

body {
    margin: 0;
    padding: 0;
}

</style>