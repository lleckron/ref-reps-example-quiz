<template>
	<NavbarHeader :mode="videoMode" @toggle="toggleVideoMode"/>
	<VideoQuiz v-if="videoMode === 'Quiz'" />
	<VideoEdit v-else-if="videoMode === 'Edit'" />
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