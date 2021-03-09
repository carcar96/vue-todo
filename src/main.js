import { createApp } from 'vue';
import App from './App.vue';
import {
    ElButton,
    ElInput,
    ElButtonGroup,
    ElContainer,
    ElHeader,
    ElMain,
    ElFooter,
    ElDialog,
    ElCheckbox,
    ElRadioGroup,
    ElRadioButton
} from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

const components = [
    ElButton,
    ElInput,
    ElButtonGroup,
    ElContainer,
    ElHeader,
    ElMain,
    ElFooter,
    ElDialog,
    ElCheckbox,
    ElRadioGroup,
    ElRadioButton
];

const app = createApp(App);

components.forEach(component => {
    app.component(component.name, component);
});

// 注册一个全局自定义指令 `v-preventReClick`
app.directive('preventReClick', {
    mounted: function (el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                setTimeout(() => {
                    el.disabled = false
                }, binding.value || 3000);
            }
        })
    }
});

app.mount('#app');
