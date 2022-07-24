<template>
  <div>
    <!-- 
      visible-change(事件): 下拉框出现/隐藏时触发
      clear(事件): 可清空的单选模式下用户点击清空按钮时触发
    -->
    <el-select
      ref="select"
      size="small" 
      clearable
      :multiple="isMultiple"
      v-model="selectValue"
      placeholder="请选择"
      style="width: 100%"
      @visible-change="visibleChange"
      @clear="clear"
    >
      <el-option
        ref="option"
        class="option"
        :value="optionData.group_id"
        :label="optionData.label"
      >
        <!-- 
          node-key(类型String): 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
          expand-on-click-node: 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点
        -->
        <el-tree
          ref="tree"
          class="tree"
          :default-expand-all="defaultExpandAll"
          highlight-current
          :data="treeData"
          :props="treeProps"
          :node-key="nodeKey"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        />
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    // v-model绑定, select下拉选项双向绑定的值
    selectValue: {
      type: [String, Number],
      // default: "" 
    },
    // select是否为多选
    isMultiple: {
      type: Boolean,
      default: false
    },
    // 树形的数据
    treeData: {
      type: Array,
      default: () => []
    },
    // 每个树节点用来作为唯一标识的属性
    nodeKey: {
      type: [String, Number],
      default: "key",
    },
    // 是否展开所有节点
    defaultExpandAll: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      optionData: {
        group_id: null,
        label: "",
      },
      // tree的props配置
      treeProps: {
        label: "label",
        children: "children",
      },
    };
  },
  watch: {
    selectValue: {
      handler(val) {
        if (!this.isEmpty(this.treeData)) {
          this.init(val);
        }
      },
      immediate: true,
    },
    treeData(val) {
      if (!this.isEmpty(val)) {
        this.init(this.selectValue);
      }
    },
  },
  methods: {
    // 是否为空
    isEmpty(val) {
      for (let key in val) {
        return false;
      }
      return true;
    },
    // tree节点点击,共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。
    handleNodeClick(data) {
      this.$emit("input", data[this.nodeKey]);
      this.$refs.select.visible = false;
    },
    init(val) {
      if (val || val == 0) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(val);
          let node = this.$refs.tree.getNode(val);
          this.optionData.group_id = val;
          this.optionData.label = node.data.label;
        });
      } else {
        val && this.$refs.tree.setCurrentKey(null);
      }
    },
    visibleChange(e) {
      if (e) {
        let selectDom = this.$refs.tree.$el.querySelector(".is-current");
        setTimeout(() => {
          this.$refs.select.scrollToOption({ $el: selectDom });
        }, 0);
      }
    },
    clear() {
      this.$emit("input", "");
    },
  },
};
</script>

<style lang="scss" scoped>
.option {
  height: auto;
  line-height: 1;
  padding: 0;
  background-color: #fff;
}

.tree {
  padding: 4px 20px;
  font-weight: 400;
}
</style>