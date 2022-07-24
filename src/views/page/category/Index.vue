<template>
  <div>
    <el-card>
      <div class="card-title">分类页模板</div>
      <div class="container" v-loading="loading">
        <el-row>
          <el-col :span="10">
            <!-- 图片模板预览 -->
            <div class="preview">
              <img
                v-if="formData.style"
                :src="`static/img/category/${formData.style}.png`"
              />
            </div>
          </el-col>
          <el-col :span="12">
            <!-- 表单内容 -->
            <div class="form-box">
              <el-form :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="分类页样式: " prop="style">
                  <el-radio-group v-model="formData.style">
                    <el-radio
                      v-for="(item, index) in PageCategoryStyleEnum.data"
                      :key="index"
                      :label="item.value"
                      >{{ item.name }}</el-radio
                    >
                  </el-radio-group>
                  <!-- 提示词 -->
                  <div class="form-item-help">
                    <p
                      class="extra"
                      v-if="
                        formData.style ==
                        PageCategoryStyleEnum.ONE_LEVEL_BIG.value
                      "
                    >
                      分类图片尺寸: 宽750像素 高度不限
                    </p>
                    <p
                      class="extra"
                      v-if="
                        formData.style ==
                        PageCategoryStyleEnum.ONE_LEVEL_SMALL.value
                      "
                    >
                      分类图片尺寸: 宽188像素 高度不限
                    </p>
                    <p
                      class="extra"
                      v-if="
                        formData.style == PageCategoryStyleEnum.TWO_LEVEL.value
                      "
                    >
                      分类图片尺寸: 宽150像素 高150像素
                    </p>
                    <p
                      class="extra"
                      v-if="
                        formData.style == PageCategoryStyleEnum.COMMODITY.value
                      "
                    >
                      分类图片尺寸: 宽150像素 高150像素
                    </p>
                  </div>
                </el-form-item>

                <el-form-item label="分享标题: " size="small">
                  <el-input
                    v-model="formData.shareTitle"
                    autocomplete="off"
                  ></el-input>
                  <div class="form-item-help">
                    <p class="extra">分类页面分享时的标题内容</p>
                  </div>
                </el-form-item>
                <!-- 是否显示购物车按钮 -->
                <el-form-item
                  v-show="
                    formData.style == PageCategoryStyleEnum.COMMODITY.value
                  "
                  label="购物车按钮: "
                  prop="showAddCart"
                >
                  <el-radio-group v-model="formData.showAddCart">
                    <el-radio :label="true">显示</el-radio>
                    <el-radio :label="false">隐藏</el-radio>
                  </el-radio-group>
                  <div class="form-item-help">
                    <p class="extra">是否显示加入购物车图标</p>
                  </div>
                </el-form-item>
                <!-- 是否显示按钮样式 -->
                <el-form-item
                  v-show="
                    formData.style == PageCategoryStyleEnum.COMMODITY.value
                  "
                  label="按钮样式: "
                  prop="cartStyle"
                >
                  <el-radio-group v-model="formData.cartStyle">
                    <el-radio
                      v-for="(item, index) in 3"
                      :label="index + 1"
                      :key="index"
                      >样式{{ index + 1 }}</el-radio
                    >
                  </el-radio-group>
                  <div class="form-item-help">
                    <p class="extra">加入购物车图标按钮的样式</p>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="handleSubmit"
                    >提交</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import pick from "lodash.pick";
import * as Api from "@/api/setting/store";
import { SettingEnum } from "@/common/enum/store";
import { PageCategoryStyleEnum } from "@/common/enum/store/page/category";

export default {
  data() {
    return {
      // 当前设置项的key
      key: SettingEnum.PAGE_CATEGORY_TEMPLATE.value,
      // 表单数据
      formData: {
        // 初始化值
        style: PageCategoryStyleEnum.ONE_LEVEL_SMALL.value,
        shareTitle: "",
        showAddCart: true,
        cartStyle: 1,
      },
      rules: {
        style: [
          { required: true, message: "请选择分类页样式", trigger: "change" },
        ],
        showAddCart: [
          {
            required: true,
            message: "请选择购物车按钮是否显示",
            trigger: "change",
          },
        ],
        cartStyle: [
          { required: true, message: "请选择按钮样式", trigger: "change" },
        ],
      },
      loading: false,
      SettingEnum,
      PageCategoryStyleEnum,
      // 当前记录详情
      record: {},
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    // 获取当前详情记录
    async getDetail() {
      this.loading = true;
      const { data } = await Api.detail(this.key);
      this.loading = false;
      this.record = data.data.values;
      // 设置默认值
      this.setFieldsValue();
    },
    // 设置默认值
    setFieldsValue() {
      const { record } = this;
      this.$nextTick(() => {
        // 将一个对象里面某一些属性进行整合到一个新的对象里面
        const newFormData = pick(record, [
          "style",
          "shareTitle",
          "showAddCart",
          "cartStyle",
        ]);
        this.formData = newFormData;
      });
    },
    // 表单提交
    async handleSubmit() {
      this.loading = true;
      const { data } = await Api.update(this.key, { form: this.formData });
      this.loading = false;
      this.$notify({
        type: data.status == 200 ? "success" : "error",
        title: "提交分类页模板",
        message: data.message,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  font-size: 14.5px;
  margin-bottom: 20px;
  color: rgba(0, 0, 0, 0.75);
}
.el-button {
  width: 76px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1px;
}
// 内容区
.container {
  max-width: 1000px;
  margin: 0 auto;

  .preview {
    width: 300px;
    img {
      display: block;
      width: 100%;
      box-shadow: 0 3px 10px #dcdcdc;
    }
  }
  .form-box {
    width: 650px;
    // less的深度选择器: /deep/深度修改组件库样式
    // /deep/.el-form-item .el-form-item__label  {
    //     font-weight: 500;
    // }
    // scss的深度选择器: ::v-deep深度修改组件库样式
    .el-form-item::v-deep .el-form-item__label {
      font-weight: 500;
    }
    .el-radio {
      color: #b8babe;
    }
    .form-item-help {
      P {
        margin: 0 0 4px 0;
        color: rgba(0, 0, 0, 0.45);
        font-size: 12.5px;
      }
    }
  }
}
</style>