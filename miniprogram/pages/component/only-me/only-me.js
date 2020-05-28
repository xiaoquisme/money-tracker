// pages/component/only-me/only-me.js
Component({
  options: {
    addGlobalClass: true
  },

  properties: {},

  data: {
    onlyMe: false,
  },

  methods: {
    onOnlyMeChange: function(e) {
      this.triggerEvent('onOnlyMeChange',
          { data: { onlyMe: e.detail.value} });
      this.setData({
        onlyMe: e.detail.value,
      });
    }
  }
});
