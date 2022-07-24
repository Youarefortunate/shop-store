<template>
  <div>
    <el-dialog 
      title="选择链接"
      width="45%"
      v-loading="loading"
      :visible.sync="visible" 
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :append-to-body="appendToBody"
    >
      <div class="links-body">
        <el-collapse v-model="keys">
          <el-collapse-item v-for="group in linkList"  :name="group.key" :title="group.title" :key="group.key">
            <div class="link-list">
              <div 
                v-for="(item, index) in group.data"
                :key="index"
                class="link-item"
                :class="{ active: activeKey == item.id }"
                @click="handleClickItem(item)"
              >
                <span class="link-title">{{ item.title }}</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>

        <el-drawer
          direction="rtl"
          append-to-body
          :title="drawer.title"
          :visible.sync="drawer.visible"
          :before-close="onCloseDrawer"
          @open="showDrawerForm"
        >
          <el-form v-if="drawer.visible" ref="DrawerForm" :model="form" style="padding: 30px 50px" label-width="100px">
            <el-form-item 
              v-for="(item, index) in curItem.form"
              size="small"
              label-width="100px"
              prop="values"
              :key="index"
              :label="`${ item.lable }: `" 
              :rules="[{ type: 'array', required: item.required, message: `${ item.lable }必须填写` }]"
            >
              <el-input v-model="form.values[index]" :placeholder="item.value" style="width: 200px"/>
              <div class="form-item-help">
                <p class="extra" v-html="item.tips"></p>
              </div>
            </el-form-item>
          </el-form>
        </el-drawer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { linkList } from '@/common/model/Links'
import { buildUrL } from '@/utils/util'

export default {
  props: {
    // 是否为内置遮罩层
    appendToBody: { type: Boolean, default: false },
  },
  data() {
    return {
      // 表单数据
      form: {
        // 动态绑定input
        values: []
      },
      // 所有链接数据
      linkList,
      // 当前选中的键值
      activeKey: '',
      // 当前选中的链接
      curItem: null,
      // 抽屉组件属性
      drawer: {
        visible: false,
        title: ''
      },
      // dialog是否可见
      visible: false,
      // 页面加载
      loading: false,
      // 表单组件实例
      drawerForm: null
    }
  },
  computed: {
    // 折叠面板绑定的keys
    keys: {
      get() {
        const { linkList } = this
        return linkList.map(item => item.key)
      },
      set(newVal) {
        
      }
      
    }
  },
  methods: {
    // 显示对话框
    handle(record = null) {
      this.visible = true
      if(record != null) {
        this.handleClickItem(record)
      }
    },
    // 选中事件(参数item就是选中的块对应的项)
    handleClickItem(item) {
      // 取消选中值
      if(this.activeKey === item.id) {
        this.activeKey = ''
        this.curItem = null
        return
      }
      // 记录选中
      this.activeKey = item.id
      this.curItem = _.cloneDeep(item)
      // 显示表单
      this.onShowForm()
    },
    // 显示表单
    onShowForm() {
      const { curItem } = this
      if(curItem.form && curItem.form.length) {
        // 显示抽屉
        this.onShowDrawer()
      }
    },
    // 显示抽屉
    onShowDrawer() {
      const { drawer, curItem } = this
      drawer.visible = true
      drawer.title = curItem.title
    },
    // 关闭抽屉
    onCloseDrawer() {
      this.activeKey = ''
      // this.curItem = null
      // 关闭抽屉的时候要将表单重置,并且关闭dialog时也要重置表单
      this.drawerForm && this.drawerForm.resetFields()
      this.drawer.visible = false
    },
    // Drawer 的内容是懒渲染的，即在第一次被打开之前，传入的默认 slot 不会被渲染到 DOM 上。
    // 因此，如果需要执行 DOM 操作，或通过 ref 获取相应组件，请在 open 事件回调中进行
    // 一点击打开drawer时触发此事件
    showDrawerForm() {
      //防抖
      setTimeout(() => {
        this.drawerForm = this.$refs.DrawerForm
      }, 0);
    },
    // 确认
    handleSubmit() {
      // 如果this.drawerForm不是null,证明存在抽屉
      if(this.drawerForm != null) {
        this.drawerForm.validate(valid => {
          if(valid) {
            // 创建返回结果
            const result = this.curItem ? this.buildResult(this.curItem, this.form) : null
            // 通知父组件提交完成
            this.$emit('handleSubmit', result)
            // 关闭对话框
            this.handleCancel()
          }
        })
        return
      }
      // 创建返回结果
      const result = this.curItem ? this.buildResult(this.curItem, this.form) : null
      // 通知父组件提交完成
      this.$emit('handleSubmit', result)
      // 关闭对话框
      this.handleCancel()
    },
    buildResult(link, formData) {
      for(const index in link.form) {
        const item = link.form[index]
        if(!item) {
          continue
        }
        // 记录输入的数据
        if(!formData.values[index]) {
          formData.values[index] = ''
        }
        // 将value赋值到key指向的params对象元素
        item.value = formData.values[index]
        _.set(link.param, item.key, item.value)
      }
      // 将link对象拼接为url
      if(link.type === 'PAGE') {
        // buildUrL()方法就是将path和query参数拼接成get类型的url,并且返回
        link.param.url = buildUrL(link.param.path, link.param.query)
      }
      // 克隆一个新的对象返回
      return _.cloneDeep(link)
    },
    // 隐藏dialog
    handleCancel() {
      this.visible = false
      this.curItem = null
      this.onCloseDrawer()
    },
  }
};
</script>

<style lang="scss" scoped>
.links-body {
  position: relative;
  min-height: 360px;
  overflow: hidden;
  padding: 30px 60px;
}

.link-list {
  .link-item {
    float: left;
    padding: 5px 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 20px;
    margin-bottom: 15px;
    font-size: 12.5px;
    cursor: pointer;
    &:hover {
      border: 1px solid rgb(6, 165, 245);
      color: rgb(6, 165, 245);
    }
    &.active {
      background: rgb(6, 165, 245);
      border-color: rgb(6, 165, 245);
      color: #fff;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>