<template>
  <div class="tool">
    <el-radio-group :size="mSize" v-model="menuType" @change="changeTab">
      <el-radio-button label="0">待办{{ unfinish }}</el-radio-button>
      <el-radio-button label="1">已办{{ finished }}</el-radio-button>
      <el-radio-button label="2">全部{{ unfinish + finished }}</el-radio-button>
    </el-radio-group>
    <el-button
      type="danger"
      @click="clearTodo"
      icon="el-icon-delete"
      size="mini"
      >已办</el-button
    >
  </div>
</template>

<script>
export default {
  props: ["mtype", "unfinish", "finished"],
  data() {
    return {
      menuType: this.mtype,
    };
  },
  computed: {
    mSize() {
      return this.getSizeType();
    },
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        that.getSizeType();
      })();
    };
  },
  methods: {
    changeTab(val) {
      this.$emit("tab", val);
    },
    clearTodo() {
      this.$emit("clear");
    },
    getSizeType() {
      let mSize = "medium";
      let screenWidth = document.body.clientWidth;
      if (screenWidth <= 1024) {
        mSize = "small";
      }

      if (screenWidth <= 768) {
        mSize = "mini";
      }

      return mSize;
    },
  },
};
</script>

<style lang="scss" scoped>
.tool {
  display: flex;
  justify-content: space-between;
}
</style>