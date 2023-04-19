<template>
	<NavbarHeader />
</template>

<script>
import NavbarHeader from './components/NavbarHeader.vue'

export default {
	name: 'App',
	components: {
		NavbarHeader
	},
	data() {
		return {
			
		}
	},
	methods: {
		
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