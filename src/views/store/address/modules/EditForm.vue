<template>
  <div id="edit-form-store">
    <el-dialog title="新增地址" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
        <el-form-item
          label="地址类型: "
          prop="type"
          size="medium"
          :label-width="formLabelWidth"
        >
          <el-radio-group v-model="formData.type">
            <el-radio :label="10">发货地址</el-radio>
            <el-radio :label="20">退货地址</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="联系人姓名: "
          prop="name"
          :label-width="formLabelWidth"
          size="small"
        >
          <el-input v-model="formData.name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="联系人电话: "
          prop="phone"
          :label-width="formLabelWidth"
          size="small"
        >
          <el-input v-model="formData.phone" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="选择地区: "
          prop="cascader"
          :label-width="formLabelWidth"
          size="small"
        >
          <select-region
            placeholder="请选择省市区"
            v-model="formData.cascader"
            @change="cascaderChange"
          />
          <!-- <el-cascader  
                        clearable
                        placeholder="请选择省市区"
                        v-model="formData.cascader" 
                        :options="options" 
                        @change="handleChange"></el-cascader> -->
        </el-form-item>

        <el-form-item
          label="详细地址: "
          prop="detail"
          :label-width="formLabelWidth"
          size="small"
        >
          <el-input v-model="formData.detail" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="排序:"
          prop="sort"
          :label-width="formLabelWidth"
          size="small"
        >
          <el-input-number
            size="small"
            v-model="formData.sort"
            controls-position="right"
            :min="0"
            :max="1000"
          ></el-input-number>
          <div class="form-item-help">
            <p class="extra">数字越小越靠前</p>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as Api from "@/api/store/address";
import pick from "lodash.pick";
import { SelectRegion } from "@/components";

export default {
  components: { SelectRegion },
  data() {
    return {
      formData: {
        type: 10,
        name: "",
        phone: "",
        cascader: [],
        detail: "",
        sort: 100,
      },
      rules: {
        type: [
          { required: true, message: "请选择地址类型", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
        cascader: [
          { required: true, message: "请选择省市区", trigger: "change" },
        ],
        detail: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入排序值", trigger: "blur" }],
      },
      dialogFormVisible: false,
      formLabelWidth: "120px",
      record: {},
    };
  },
  methods: {
    edit(record) {
      this.record = record;
      this.dialogFormVisible = true;
      // 设置默认值
      this.setFieldsValue();
    },
    // 设置默认值
    setFieldsValue() {
      const { record } = this;
      record.cascader = [record.province_id, record.city_id, record.region_id];
      // 在下一次的DOM渲染完成之后回调此函数
      this.$nextTick(() => {
        // 对一个对象中的某些属性进行抽离出来到一个新的对象中
        const newRecord = pick(record, [
          "type",
          "name",
          "phone",
          "cascader",
          "detail",
          "sort",
        ]);
        this.formData = newRecord;
      });
    },
    // 选择级联选择器中的值
    cascaderChange(value) {
      this.formData.cascader = value;
    },
    // 提交表单
    async handleSubmit() {
      this.dialogFormVisible = false;
      const { data } = await Api.edit({
        addressId: this.record.address_id,
        form: this.formData,
      });
      if (data.status == 200) {
        this.$emit("handleSubmit");
        this.$notify.success({
          title: "编辑地址操作",
          message: data.message,
        });
      }
    },
    // 重置表单校验
    // resetForm(formName) {
    //     this.$refs[formName].resetFields();
    // },
  },
};
</script>

<style lang="scss">
#edit-form-store {
  .el-dialog__body {
    padding: 50px;
    .el-form-item__content {
      margin-bottom: 10px;
    }
  }
  .el-dialog__header {
    padding: 16px 24px;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 2px 2px 0 0;
    .el-dialog__title {
      margin: 0;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      font-size: 15px;
      line-height: 22px;
      word-wrap: break-word;
    }
  }
  .el-form-item__content {
    .el-cascader--small {
      width: 100%;
    }
  }
  .el-dialog__body {
    .el-form-item__label {
      font-size: 13px;
    }
  }
  label {
    font-weight: 100;
  }
  .el-button {
    padding: 10px 20px;
    border-radius: 2px;
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