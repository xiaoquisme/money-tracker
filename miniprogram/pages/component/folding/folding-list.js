Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    functions: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    kindToggle: function (e) {
      const id = e.currentTarget.id, list = this.data.functions;
      for (let i = 0, len = list.length; i < len; ++i) {
        if (list[i].id == id) {
          list[i].open = !list[i].open;
        } else {
          list[i].open = false;
        }
      }
      this.setData({
        functions: list,
      });
    },
  }
});
