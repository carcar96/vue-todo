<template>
  <div class="item">
    <el-checkbox
      v-model="todo.checked"
      true-label="1"
      false-label="0"
      @change="checkboxChange()"
    >
      <span :class="todo.status == 1 ? 'done' : ''">{{ todo.content }}</span>
    </el-checkbox>
    <div class="menu">
      <el-button
        type="primary"
        icon="el-icon-edit"
        circle
        size="mini"
        class="clear"
        v-if="todo.status == 0"
        @click="editTodo()"
      ></el-button>
      <el-button
        type="danger"
        icon="el-icon-delete"
        circle
        size="mini"
        class="clear"
        @click="delTodo()"
      ></el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["itodo"],
  computed: {
    todo: function () {
      let ntodo = this.itodo;
      ntodo.checked = ntodo.status == 1 ? true : false;
      return ntodo;
    },
  },
  methods: {
    checkboxChange() {
      this.$emit("update", {
        id: this.todo.id,
        status: this.todo.status == 0 ? 1 : 0,
      });
    },
    editTodo() {
      this.$emit("edit", this.todo.id);
    },
    delTodo() {
      this.$emit("del", this.todo.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;

  .clear {
    display: none;
  }

  &:hover {
    .clear {
      display: block;
    }
  }

  .menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .done {
    text-decoration: line-through;
    color: #bbb;
  }
}
</style>