<template>
    <div class="spinner-loading"></div>
</template>

<script>
export default {
    name: 'spinner-loading',
}
</script>

<style lang="scss" scoped>
.spinner-loading {
	border: 4px solid #0BE68E21;
	border-top: 4px #0be58e solid;
	border-top: 4px var(--highlight) solid;
	border-radius: 50%;
	-webkit-animation: spCircRot .6s infinite linear;
	animation: spCircRot .6s infinite linear;
    height: 50px;
    width: 50px;
}
@-webkit-keyframes spCircRot {
	from { -webkit-transform: rotate(0deg); }
	to { -webkit-transform: rotate(359deg); }
}
@keyframes spCircRot {
	from { transform: rotate(0deg); }
	to { transform: rotate(359deg); }
}

</style>