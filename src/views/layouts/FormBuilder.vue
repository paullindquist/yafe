<template>
  <div class="h-screen p-5 flex justify-center dark:text-white text-gray-700">
    <div id="the-page" ref="thePage">
      <mc-q-4 :dimensions="template.bubbleDimensions"/>
    </div>
    <div id="controls">
      <div class="card w-full p-5 rounded-md bg-white dark:bg-gray-800">
        <h2 class="dark:text-gray-200">Card Default</h2>
        <div class="wrapper-button w-full box-border mt-4">
          <div
            class="card p-6 max-w-sm bg-white rounded-lg border border-gray-200 border dark:border-gray-700-md dark:bg-gray-800 dark:border-gray-700"
          >
            <button @click="doTheThing()"
              type="button"
              class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Purple to Pink
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue';
import axios from 'axios';
import McQ4 from '../components/McQ4.vue';
import BubbleControl from '../components/BubbleControl.vue';

const css = `
<style>
  #the-page {
    background-color: #fff;
    width: 8.5in;
    height: 11in;
  }
  .draggable {
    text-align: center;
    line-height: 50px;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    border: solid 1px #222222;
    color: #222222;
  }
  </style>`;
const template = {
  "pageDimensions": [300, 400],
  "bubbleDimensions": [55, 55],
  "preProcessors": [
    {
      "name": "CropPage",
      "options": {
        "morphKernel": [10, 10]
      }
    }
  ],
  "fieldBlocks": {
    "MCQ_Block_1": {
      "fieldType": "QTYPE_MCQ5",
      "origin": [65, 60],
      "fieldLabels": ["q1..5"],
      "labelsGap": 52,
      "bubblesGap": 41
    }
  }
}


export default {
  setup() {
    const thePage = ref(null)
    return {
      thePage, 
      pageHeight: template.pageDimensions[0] + 'px',
      pageWidth: template.pageDimensions[1] + 'px',
      template
    }
  },
  mounted() {
    const dndService = this.DragAndDropService; 
    dndService.registerDropTarget(this.thePage)
  },
  methods: {
    doTheThing() {
      const payload = `<html><head>${css}</head><body>${this.thePage.outerHTML}</body></html>`;
      console.log(payload);

      axios.post('http://localhost:8888/api/images', {
        html: payload, 
        title: 'The page'
      }).then(res => {
        var image = new Image();
        image.src = 'data:image/png;base64,' + res.data.base;
        this.thePage.innerHTML = "";
        this.thePage.append(image);
      })
    }
  },
  components: {
    McQ4,
    BubbleControl
  }
}
</script>

<style scoped>
  #the-page {
    width: v-bind(pageWidth);
    height: v-bind(pageHeight); 
    position: relative;
    background-color: #fff;
  }
</style>