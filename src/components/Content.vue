<template>
    <h1>todolist</h1>
    <div class="main">
        <el-input placeholder="请输入待办事项" v-model="inputContent" clearable @keyup.enter="onAdd"></el-input>
        <div class="list">
            <div class="inner" v-show="showTodos.length > 0">
                <div class="item" v-for="todo in showTodos" :key="todo.id">
                    <el-checkbox :checked="todo.status==1" v-model="todo.status" true-label="1" false-label="0">
                        <span :class="todo.status==1?'done':''">{{todo.content}}</span>
                    </el-checkbox>
                    <div class="menu">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini" class="clear" v-if="todo.status==0" @click="onEdit(todo.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" class="clear" @click="onDel(todo.id)"></el-button>
                    </div>
                </div>
            </div>
            <div class="empty" v-show="showTodos.length == 0">暂无更多</div>
        </div>
        <div class="tool">
             <el-radio-group v-model="menuTypeIdx">
                <el-radio-button label="0">待办{{unfinish || ''}}</el-radio-button>
                <el-radio-button label="1">已办{{finished || ''}}</el-radio-button>
                <el-radio-button label="2">全部{{(unfinish + finished) || ''}}</el-radio-button>
            </el-radio-group>
            <el-button type="danger" @click="onClear">清理已办</el-button>
        </div>
    </div>
    <el-dialog
        title="编辑"
        v-model="dialogVisible"
        width="30%">
        <el-input type="textarea"  autosize placeholder="请输入内容" v-model="editContent"> </el-input>
        <template #footer>
            <span class="dialog-footer">
            <el-button @click="dialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="onEnter">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'
export default {
    data () {
      return {
        inputContent: '',
        menuTypeIdx: 0,
        dialogVisible: false,
        editId: null,
        editContent: '',
        unfinish: 0,
        finished: 0,
        todos: [],
        showTodos: []
      };
    },
    watch:{
        'todos':{
            handler(newTodos) {
                let unfinishTodos = newTodos.filter((todo)=>todo.status != 1);
                let finishedTodos = newTodos.filter((todo)=>todo.status != 0);
                this.unfinish = unfinishTodos.length;
                this.finished = finishedTodos.length;
                if(this.menuTypeIdx == 0) { // 待办
                    this.showTodos = unfinishTodos;
                } else if (this.menuTypeIdx == 1) { // 已办
                    this.showTodos = finishedTodos;
                } else { // 全部
                    this.showTodos = newTodos;
                }
                localStorage.setItem('todos', JSON.stringify(newTodos));
            },
            deep: true
        },
        'menuTypeIdx': {
            handler(newVal) {
                if(newVal == 0) { // 待办
                    this.showTodos = this.todos.filter((todo)=>todo.status != 1);
                } else if (newVal == 1) { // 已办
                    this.showTodos = this.todos.filter((todo)=>todo.status != 0);
                } else { // 全部
                    this.showTodos = this.todos;
                }
            }
        }
    },
    created() {
        this.initData();
    },
    methods: {
        initData(){
            let hisTodos = localStorage.getItem('todos');
            if(hisTodos) {
                hisTodos = JSON.parse(hisTodos);
                let unfinishTodos = hisTodos.filter((todo)=>todo.status != 1);
                let finishedTodos = hisTodos.filter((todo)=>todo.status != 0);
                this.unfinish = unfinishTodos.length;
                this.finished = finishedTodos.length;
                if(this.menuTypeIdx == 0) { // 待办
                    this.showTodos = unfinishTodos;
                } else if (this.menuTypeIdx == 1) { // 已办
                    this.showTodos = finishedTodos;
                } else { // 全部
                    this.showTodos = hisTodos;
                }
            }
        },
        onAdd() {
            let newContent = this.inputContent.replace(/^\s*|\s*$/g,'');
            if(newContent) {
                this.todos.push({
                    'id': this.createID(),
                    'status': 0,
                    'content': newContent,
                    'timestamp': new Date().getTime()
                });
                this.inputContent = '';
            }
            
        },
        onEdit(id) {
            this.editId = id;
            this.editContent = this.todos[this.findIdx(id)].content;
            this.dialogVisible = true;
        },
        onDel(id) {
            this.todos.splice(this.findIdx(id), 1);
        },
        onEnter() {
            let newContent = this.editContent.replace(/^\s*|\s*$/g,'');
            if(newContent) {
                this.todos[this.findIdx(this.editId)].content = newContent;
                this.dialogVisible = false;
                this.editId = null;
                this.editContent = '';
            } else {
                ElMessage.error('内容不能为空');
            }
        },
        onClear() {
            let newTodos = this.todos.filter((todo)=>todo.status != 1);
            this.todos = newTodos;
        },
        createID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },
        findIdx(id) {
            return this.todos.findIndex(todo => todo.id === id);
        }
    }
}
</script>

<style lang="scss" scoped>
    h1 {
        font-size: 72px;
        color: #ffffff;
        text-align: center;
    }
    .main {
        width: 50%;
        background-color: #ffffff;
        margin: auto;
        padding: 24px;

        .list {
            min-height: 200px;
            margin-top: 10px;
            margin-bottom: 10px;

            .item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 30px;

                .clear {
                    display: none;
                }
                
                &:hover{
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

            .empty {
                text-align: center;
                color: #999;
                font-size: 13px;
                line-height: 100px;
            }
        }

        .tool {
            display: flex;
            justify-content: space-between;
        }
    }
</style>