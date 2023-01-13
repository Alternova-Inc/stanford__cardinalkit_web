<template>
  <button class="social-btn" :class="className">
		<div class="social-icon-wrapper">
			<img class="social-icon" :src="icon" alt="social button" />
		</div>
		<p class="btn-text">
			<b>{{text}}</b>
		</p>
	</button>
</template>

<script>
export default {
props: {
	icon: String,
	text: String,
	className: String,
}
}
</script>

<style lang='scss' scoped>
button {
	width: 100%;
	border: none;
	font-family: inherit;
	color: inherit;
	padding: 0;
	position: relative;
	text-align: center;
	cursor: pointer;
	margin-top: 5px;
	min-height: 42px;
	background-color: #fff;
	border-radius: 2px;
	box-shadow: 0px 2px 4px 0px #2e2e2e40;
	transition: box-shadow .3s ease;

	.social-icon-wrapper {
		width: 40px;
		display: flex;
    justify-content: center;
    align-items: center;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;

		.social-icon {
			position: initial;
			margin: 0;
			width: 18px;
    	height: 18px;
			object-fit: contain;
		}
	}

	&:hover {
		box-shadow: 0 0 1px $dark-grey;
	}
	&:active {
		background: $button-active-google;
	}
}
</style>