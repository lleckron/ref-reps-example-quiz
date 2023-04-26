<template>
	<NavbarHeader :mode="videoMode" @toggle="toggleVideoMode"/>
	<VideoQuiz v-if="contentReady === true && videoMode === 'Quiz'" :activities="activities" @togglemode="toggleVideoMode('Edit')"/>
	<VideoEdit v-else-if="contentReady === true && videoMode === 'Edit'" :existingActivities="activities" @save="updateQuizQuestions"/>
</template>

<script>
import NavbarHeader from '@/components/NavbarHeader.vue'
import VideoQuiz from '@/components/VideoQuiz.vue'
import VideoEdit from '@/components/VideoEdit.vue'
import { useExampleQuizStore } from '@/stores/ExampleQuizStores.js'

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
			contentReady: false
		}
	},
	methods: {
		async toggleVideoMode(mode) {
			if(this.videoMode === 'Quiz') {
				const video = document.getElementById('quiz-video')
				await video.pause()
			} else if(this.videoMode === 'Edit') {
				const video = document.getElementById('edit-video')
				await video.pause()
			}
			setTimeout(() => {
				this.videoMode = mode
			},10)
		},
		updateQuizQuestions() {
			this.getExampleQuizContent()
			this.toggleVideoMode('Quiz')
		},
		async getExampleQuizContent() {
			const store = useExampleQuizStore()
			await store.fetchExampleQuizzes()
			this.activities = store.exampleQuizList
			this.orderActivitiesByTimestamp()
			this.contentReady = true
		},
		orderActivitiesByTimestamp() {
            this.activities.sort((a,b) => a.timestamp - b.timestamp)
        },
	},
	async created() {
		await this.getExampleQuizContent()
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