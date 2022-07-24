<template>
  <div id="add-form-role">
    <el-dialog
      width="40%"
      title="新增管理员"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        label-position="left"
      >
        <el-form-item
          label="角色名称:"
          prop="role_name"
          :label-width="formLabelWidth"
          size="medium"
        >
          <el-input v-model="formData.role_name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="上级角色:"
          :label-width="formLabelWidth"
          size="medium"
        >
          <el-select
            clearable
            v-model="formData.parent_id"
            placeholder="请选择上级角色"
            style="width: 100%"
          >
            <el-option
              v-for="item in roleListTreeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 树形菜单权限列表 -->
        <el-form-item
          label="菜单权限:"
          :label-width="formLabelWidth"
          size="medium"
        >
          <!-- 
              show-checkbox: 可选择
              check-strictly: 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
              @check: 复选框被选中事件
            -->
          <el-tree
            ref="MenuTree"
            show-checkbox
            node-key="key"
            :default-checked-keys="checkedKeys.checked"
            :props="defaultProps"
            :data="menuListTreeData"
            :auto-expand-parent="false"
            @check="onCheckedMenu"
            @check-change="checkChange"
          >
          </el-tree>
          <div class="form-item-help">
            <p class="extra">设置该角色有权操作的功能</p>
          </div>
        </el-form-item>

        <el-form-item label="排序:" :label-width="formLabelWidth" size="medium">
          <el-input-number
            size="small"
            v-model="formData.sort"
            controls-position="right"
            :min="1"
          ></el-input-number>
          <div class="form-item-help">
            <p class="extra">数字越小越靠前</p>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSubmit">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/store/role";
import _ from "lodash";

export default {
  props: {
    roleList: {
      type: Array,
      default: () => [],
      required: true,
    },
    // 菜单列表
    menuList: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    // 自定义校验选择角色是否少于一个
    const validateSelect = (rule, value, callback) => {
      if (this.formData.roles.length === 0) {
        callback(new Error("请至少选择一个角色"));
      } else callback();
    };
    return {
      formData: {
        role_name: "", // 管理员姓名
        sort: 100, // 默认排序100
        parent_id: null, // 选择的角色数组,存放角色id
      },
      defaultProps: {
        label: "label",
        children: "children",
      },
      dialogFormVisible: false, // 对话框是否可见
      formLabelWidth: "100px", // 对话框宽度
      roleListTreeData: [], // 角色列表 树状结构
      // 菜单列表 树状结构
      menuListTreeData: [],
      // 当前选中的keys
      checkedKeys: {
        checked: [],
        halfChecked: [],
      },
      // 表单效验规则
      rules: {
        role_name: [
          { required: true, message: "请输入管理员姓名", trigger: "blur" },
          { min: 2, max: 8, message: "请至少输入两个字符", trigger: "blur" },
        ],
        roles: [
          { required: true, trigger: "change", validator: validateSelect },
        ],
      },
      // 当前记录
      record: {}
    };
  },
  methods: {
    edit(record) {
      this.dialogFormVisible = true;
      // 当前角色记录
      this.record = record
      // 获取角色列表
      this.getRoleList();
      // 获取API权限列表
      this.getMenuList();
      // 默认选中的API权限
      this.setMenuChecked()
      // 设置默认值
      this.setFieldsValue()
    },
    /**
     * 设置默认值
     */
    setFieldsValue () {
      this.$nextTick(() => {
        const newData = _.pick(this.record, ['role_name', 'parent_id', 'sort'])
        this.formData = newData
      })
    },
    /**
     * 设置默认选中的菜单
     */
    setMenuChecked () {
      // 菜单列表所有子集
      const { menuListTreeData, record } = this
      const allMenuKeys = this.getAllMenuKeys(menuListTreeData)
      // 默认选中的菜单
      this.checkedKeys.checked = _.intersection(record.menuIds, allMenuKeys)
    },
    /**
     * 获取菜单列表
     */
    getMenuList() {
      const { menuList } = this;
      this.menuListTreeData = this.formatTreeDataForMenuList(menuList);
    },
    checkChange(selectNode, checked, childrenChecked) {
      // console.log(selectNode);
      // console.log(checked);
      // 寻找当前选择的节点
      const { menuListTreeData } = this;
      // findNode()当选择了节点,则返回选中节点的那个对象,没有就返回false
      const nodeData = this.findNode(selectNode.key, menuListTreeData);
      
      // 选择节点时联动所有子节点
      // this.onCheckChilds(checked, nodeData);
      // 选择节点时联动所有父节点
      // this.onCheckParents(checked, nodeData);
    },
    // 当复选框被点击的时候触发,共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、
    // 树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
    onCheckedMenu(selectItemNode, b) {
      // 寻找当前选择的节点
      // const { menuListTreeData } = this
      // // findNode()当选择了节点,则返回选中节点的那个对象,没有就返回false
      // const nodeData = this.findNode(selectItemNode.key, menuListTreeData)
      // // 选择节点时联动所有子节点
      // this.onCheckChilds(selectItemNode ? true : false, nodeData)
      // // 选择节点时联动所有父节点
      // this.onCheckParents(selectItemNode ? true : false, nodeData)
    },
    // 格式化菜单列表
    formatTreeDataForMenuList(list) {
      const data = [];
      list.forEach((item) => {
        const newItem = {
          key: item.menu_id,
          label: item.name,
          parentKey: item.parent_id,
        };
        if (item.children && item.children.length) {
          newItem["children"] = this.formatTreeDataForMenuList(
            item["children"]
          );
        }
        data.push(newItem);
      });
      return data;
    },
    // 寻找指定的的节点
    findNode(key, list) {
      for (let index = 0; index < list.length; index++) {
        // 权限列表中数组的每一项  list[index]
        const item = list[index];
        if (item.key === key) {
          return item;
        }
        // 选中的是子菜单,递归
        else if (item.children) {
          const result = this.findNode(key, item.children);
          if (result) {
            return result;
          }
        }
      }
      return false;
    },

    // 选择节点时联动所有父节点
    onCheckParents(checked, node) {
      // 查找所有父节点(方法)
      const { menuListTreeData } = this;
      const findParentKeys = (parentKey) => {
        let keys = [];
        const parent = this.findNode(parentKey, menuListTreeData);
        if (!parent) {
          return keys;
        }
        keys.push(parent.key);
        if (parent.children) {
          const arr = findParentKeys(parent.parentKey);
          arr.length && (keys = keys.concat(arr));
        }
        return keys;
      };
      // 查找所有父节点
      const parentKeys = findParentKeys(node.parentKey);
      // 设置为选中
      if (checked && parentKeys.length) {
        this.checkedKeys.checked = _.union(
          this.checkedKeys.checked,
          parentKeys
        );
      }
    },

    // 选择节点时联动所有子节点
    onCheckChilds(checked, node) {
      // 获取当前节点的所有子级ID
      const childKeys = node.children ? this.getAllMenuKeys(node.children) : [];
      if (childKeys.length) {
        // _.union()返回一个新的联合数组,例如: _.union([2], [1, 2]); ==> [2, 1]
        // _.difference()返回一个过滤值后的新数组
        this.checkedKeys.checked = checked
          ? _.union(this.checkedKeys.checked, childKeys)
          : _.difference(this.checkedKeys.checked, childKeys);
      }
    },

    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const values = { ...this.formData, menus: this.getCheckedKeys() };
          const { data } = await Api.edit({ roleId: this.record['role_id'], form: values });
          this.cancelSubmit();
          this.$emit("handleSubmit");
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "编辑角色",
            message: data.message,
            showClose: true,
            duration: 1500,
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消提交表单并重置表单
    cancelSubmit() {
      this.dialogFormVisible = false;
      this.resetForm("form");
      // this.$refs.MenuTree.
      this.checkedKeys.checked = [];
    },
    // 重置表单校验
    resetForm(formName) {
      this.formData.parent_id = null;
      this.$refs[formName].resetFields();
    },
    // 获取角色列表
    getRoleList() {
      const { roleList } = this;
      const selectList = this.formatTreeForRoleList(roleList);
      // 顶级角色, unshift()方法向一个数组的最前面插入一个或者多个元素,会改变原数组
      selectList.unshift({
        label: "顶级角色",
        key: 0,
        value: 0,
      });
      this.roleListTreeData = selectList;
    },
    // 格式化角色列表
    formatTreeForRoleList(list = []) {
      const data = [];
      list.forEach((item) => {
        const newItem = {
          key: item.role_id,
          label: item.role_name,
          value: item.role_id,
        };
        // 递归整理子集
        if (item.children && item.children.length) {
          newItem["children"] = this.formatTreeForRoleList(item["children"]);
        }
        data.push(newItem);
      });
      return data;
    },
    // 获取菜单列表中所有子级的id
    getAllMenuKeys(list) {
      let keysArr = [];
      list.forEach((item) => {
        keysArr.push(item.key);
        if (item.children && item.children.length) {
          const childrenArr = this.getAllMenuKeys(item.children);
          childrenArr.length && (keysArr = keysArr.concat(childrenArr));
        }
      });
      return keysArr;
    },

    // 获取所有选中的节点菜单
    getCheckedKeys() {
      const {
        $refs: { MenuTree },
      } = this;
      return [...MenuTree.getCheckedKeys(), ...MenuTree.getHalfCheckedKeys()];
    },
    // 关闭dialog时重置表单项
    handleClose(done) {
      this.resetForm("form");
      done();
    },
  },
};
</script>

<style lang="scss">
#add-form-role {
  .el-dialog {
    .el-dialog__title {
      font-size: 16px;
    }
    .el-dialog__body {
      padding: 30px 100px;
    }
    .el-button {
      padding: 10px 20px;
      border-radius: 2px;
    }
  }
  label {
    font-weight: 1;
  }
  .form-item-help {
    P {
      margin: 0 0 4px 0;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12.5px;
    }
  }
}
</style>