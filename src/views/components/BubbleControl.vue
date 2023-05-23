<template>
  <div class="bubble-control-container">
      <form @submit.prevent="handleSubmit">
        <h1>controls</h1>
        <label for="width">Width:</label>
        <input @input="$emit('widthChange', localBubbleWidth)" id="width" type="number" name="width" v-model="localBubbleWidth">
        <label for="height">Height:</label>
        <input @input="$emit('heightChange', localBubbleHeight)" type="number" name="height" v-model="localBubbleHeight">
      </form>
  </div>
</template>

<script>

export default {
    setup(props) {
        return {
            localBubbleWidth: props.bubbleWidth,
            localBubbleHeight: props.bubbleHeight
        }
    },
    methods: {
        handleSubmit(event) {
            event.preventDefault();
            console.log('submitted!!');
        }
    },
    props: ['bubbleWidth', 'bubbleHeight']
}
</script>

<style>
    .bubble-control-container {
        color: black;
    }

</style>