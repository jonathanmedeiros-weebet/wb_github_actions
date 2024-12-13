import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      scrollPosition: { x: 0, y: 0 }
    };
  },
  beforeRouteLeave(to: any, from: any, next: Function) {
    this.scrollPosition = { x: window.scrollX, y: window.scrollY };
    next();
  },
  beforeRouteEnter(to: any, from: any, next: Function) {
    next((vm: Vue) => {
      setTimeout(() => window.scrollTo(vm.$data.scrollPosition.x, vm.$data.scrollPosition.y), 50);
    });
  }
});
