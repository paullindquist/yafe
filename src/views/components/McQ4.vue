<template>
    <div class="mcq4">
        <span @click="openControls()">A</span>
        <span>B</span>
        <span>C</span>
        <span>D</span>
        <bubble-control
         :bubbleHeight="bubbleHeight"
         :bubbleWidth="bubbleWidth"
         @width-change="handleWidthChange"
         @height-change="handleHeightChange"
        v-if="isControlOpen"/>
        {{ bubbleHeightPx }}
        {{ bubbleWidthPx }}
    </div>
</template>

<script>
import BubbleControl from './BubbleControl.vue'
import { ref } from 'vue';

export default {
    props: {
        dimensions: {
            type: Array
        }
    },
    methods: {
        openControls() {
            this.isControlOpen = !this.isControlOpen;
            console.log(this.isControlOpen)
        }, 
        handleHeightChange(evt) {
            this.bubbleHeight = evt;
            this.bubbleHeightPx = this.bubbleHeight + 'px';
            console.log('height', this.bubbleHeightPx);
        },
        handleWidthChange(evt) {
            this.bubbleWidth = evt;
            this.bubbleWidthPx = this.bubbleWidth + 'px';
            console.log('width', this.bubbleWidthPx);
        }
    }, 
    setup(props) {
        let isControlOpen = ref(false);
        let bubbleWidth = ref(props.dimensions[0]);
        let bubbleHeight = ref(props.dimensions[1]);
        let bubbleWidthPx = ref(props.dimensions[0] + 'px');
        let bubbleHeightPx = ref(props.dimensions[1] + 'px');
        return  {
            isControlOpen,
            bubbleWidth,
            bubbleHeight,
            bubbleWidthPx,
            bubbleHeightPx
        }
    },
    components: {
        BubbleControl
    },
}
</script>

<style scoped>
    div {
        display: flex; 
        flex-direction: column;
        align-items: center;
        color: #222222;
        text-align: center;
        width: 80px;
    }
    div span {
        text-align: center;
        display: flex;
        height: v-bind(bubbleHeightPx);
        width: v-bind(bubbleWidthPx);
        line-height: 1rem;
        border-radius: 50%;
        border: 1px dotted #333333;
        align-items: center;
        justify-content: center;
    }


</style>