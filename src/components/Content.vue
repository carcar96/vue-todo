<template>
  <div class="todo-title">
    <h1>todolist</h1>
  </div>
  <div class="todo-layout">
    <el-container>
      <el-header>
        <el-input
          placeholder="请输入待办事项"
          v-model="inputContent"
          clearable
          @keyup.enter="onAdd"
        ></el-input>
      </el-header>
      <el-main>
        <div class="list" v-show="showTodos.length > 0">
          <Todo
            v-for="todo in showTodos"
            :key="todo.id"
            :itodo="todo"
            @update="updateTodo"
            @edit="onEdit"
            @del="onDel"
          />
        </div>
        <div class="empty" v-show="showTodos.length == 0">
          <div v-if="todos.length > 0">
            <span v-if="menuType == 0">目前没有待办事项哟~</span>
            <span v-if="menuType == 1">快去处理待办事项吧~</span>
          </div>
          <div v-else>
            <span>去添加一些待办事项吧~</span>
          </div>
        </div>
      </el-main>
      <el-footer>
        <Tool
          :mtype="menuType"
          :unfinish="unfinish"
          :finished="finished"
          @tab="changeMenuType"
          @clear="onClear"
        />
      </el-footer>
    </el-container>
    <el-dialog title="编辑" v-model="dialogVisible" width="320px">
      <el-input
        type="textarea"
        autosize
        placeholder="请输入内容"
        v-model="editContent"
      >
      </el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="onEnter"
            v-preventReClick
            :disabled="isDisabled"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Todo from "./Todo.vue";
import Tool from "./Tool.vue";
import { ElMessage } from "element-plus";
export default {
  components: {
    Todo,
    Tool,
  },
  data() {
    return {
      inputContent: "",
      menuType: 0,
      dialogVisible: false,
      editId: null,
      editContent: "",
      unfinish: 0,
      finished: 0,
      todos: [],
      showTodos: [],
      isDisabled: false,
    };
  },
  watch: {
    todos: {
      handler(newTodos) {
        let unfinishTodos = newTodos.filter((todo) => todo.status != 1);
        let finishedTodos = newTodos.filter((todo) => todo.status != 0);
        this.unfinish = unfinishTodos.length;
        this.finished = finishedTodos.length;
        if (this.menuType == 0) {
          // 待办
          this.showTodos = unfinishTodos;
        } else if (this.menuType == 1) {
          // 已办
          this.showTodos = finishedTodos;
        } else {
          // 全部
          this.showTodos = newTodos;
        }
        localStorage.setItem("todos", JSON.stringify(newTodos));
      },
      deep: true,
    },
    menuType: {
      handler(newVal) {
        if (newVal == 0) {
          // 待办
          this.showTodos = this.todos.filter((todo) => todo.status != 1);
        } else if (newVal == 1) {
          // 已办
          this.showTodos = this.todos.filter((todo) => todo.status != 0);
        } else {
          // 全部
          this.showTodos = this.todos;
        }
      },
    },
  },
  created() {
    this.initData();
  },
  // directives: {
  //   preventReClick: {
  //     mounted: function (el, binding) {
  //       el.addEventListener("click", () => {
  //         if (!el.disabled) {
  //           el.disabled = true;
  //           setTimeout(() => {
  //             el.disabled = false;
  //           }, binding.value || 3000);
  //         }
  //       });
  //     },
  //   },
  // },
  methods: {
    initData() {
      let hisTodos = localStorage.getItem("todos");
      console.log(hisTodos);
      if (hisTodos) {
        this.todos = JSON.parse(hisTodos);
      }
    },
    onAdd() {
      let newContent = this.inputContent.replace(/^\s*|\s*$/g, "");
      if (newContent) {
        this.todos.push({
          id: this.createID(),
          status: 0,
          content: newContent,
          timestamp: new Date().getTime(),
        });
        this.inputContent = "";
      }
    },
    onEdit(id) {
      this.editId = id;
      this.editContent = this.todos[this.findIdx(id)].content;
      this.dialogVisible = true;
      this.isDisabled = false;
    },
    onDel(id) {
      this.todos.splice(this.findIdx(id), 1);
    },
    onEnter() {
      if (!this.isDisabled) {
        this.isDisabled = true;
        let newContent = this.editContent.replace(/^\s*|\s*$/g, "");
        if (newContent) {
          this.updateTodo({ id: this.editId, content: newContent });
          this.dialogVisible = false;
          this.editId = null;
          this.editContent = "";
        } else {
          ElMessage.error("内容不能为空");
        }
      }
    },
    updateTodo(data) {
      data.timestamp = new Date().getTime();
      Object.assign(this.todos[this.findIdx(data.id)], data);
    },
    onClear() {
      let newTodos = this.todos.filter((todo) => todo.status != 1);
      this.todos = newTodos;
    },
    createID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    findIdx(id) {
      return this.todos.findIndex((todo) => todo.id === id);
    },
    changeMenuType(val) {
      this.menuType = val;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.todo-title {
  font-size: 36px;
  color: #000;
  font-family: fantasy;
  text-align: center;
  opacity: 0.7;
}
.todo-layout {
  min-width: 320px;
  max-width: 50%;
  background: #fff;
  margin: auto;
  padding: 36px 16px;
  box-shadow: 0 0 3px #ccc;
  box-sizing: border-box;

  .list {
    min-height: 100px;
  }

  .empty {
    text-align: center;
    color: #999;
    font-size: 13px;
    line-height: 100px;
  }
}

.el-header,
.el-footer {
  height: 40px !important;
}

@media screen and (max-width: 414px) {
  .todo-layout {
    padding: 24px 0;
  }
}
</style>
