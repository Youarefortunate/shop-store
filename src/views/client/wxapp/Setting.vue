<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        :model="form"
        class="client-wxapp"
        style="padding: 30px 0 20px 80px"
        ref="ClientWxapp"
        label-width="180px"
      >
        <el-form-item
          label="小程序 AppID: "
          prop="app_id"
          size="small"
          :rules="[
            { required: true, message: '请输入小程序AppID', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="form.app_id"
            style="width: 550px"
            placeholder="请输入小程序AppID"
          />
        </el-form-item>

        <el-form-item
          label="小程序 AppSecret: "
          prop="app_secret"
          size="small"
          :rules="[
            {
              required: true,
              message: '请输入小程序AppSecret',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            type="password"
            v-model="form.app_secret"
            style="width: 550px"
            placeholder="请输入小程序AppSecret"
          />
        </el-form-item>

        <el-divider content-position="left">微信小程序支付</el-divider>
        <el-form-item
          label="微信商户号 MCHID: "
          prop="mchid"
          size="small"
          :rules="[
            {
              required: true,
              message: '请输入微信商户号MCHID',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="form.mchid"
            style="width: 550px"
            placeholder="请输入微信商户号MCHID"
          />
        </el-form-item>

        <el-form-item
          label="小程序支付密钥 APIKEY: "
          prop="apikey"
          size="small"
          :rules="[
            { required: true, message: '请输入微信支付密钥', trigger: 'blur' },
          ]"
        >
          <el-input
            type="password"
            autocomplete="no"
            v-model="form.apikey"
            style="width: 550px"
            placeholder="请输入微信支付密钥"
          />
        </el-form-item>

        <el-form-item
          label="证书文件cert: "
          size="small"
        >
          <el-input
            type="textarea"
            style="width: 550px"
            v-model="form.cert_pem"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入证书文件cert"
          />
          <div class="form-item-help">
            <p class="extra">
              使用文本编辑器打开apiclient_cert.pem文件，将文件的全部内容复制进来
            </p>
          </div>
        </el-form-item>

        <el-form-item
          label="证书文件key: "
          size="small"
        >
          <el-input
            type="textarea"
            style="width: 550px"
            v-model="form.key_pem"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入证书文件key"
          />
          <div class="form-item-help">
            <p class="extra">
              使用文本编辑器打开apiclient_key.pem文件，将文件的全部内容复制进来
            </p>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import pick from "lodash.pick";
import { isEmpty } from "@/utils/util";
import * as Api from "@/api/client/wxapp/setting";

export default {
  data() {
    return {
      // 表单数据
      form: {},
      // 加载
      loading: false,
      // 当前设置项key
      key: "basic",
      // 当前记录详情
      record: {},
    };
  },
  // 初始化数据
  created() {
    // 获取当前详情记录
    this.getDetail();
  },
  methods: {
    // 获取当前详情记录
    async getDetail() {
      this.loading = true;
      const { data: result } = await Api.detail(this.key);
      this.record = result.data.detail;
      // 设置默认值
      this.setFieldsValue();
      this.loading = false;
    },
    // 设置默认值
    setFieldsValue() {
      !isEmpty(this.form) &&
        this.$nextTick(() => {
          const newData = pick(this.record, [
            "app_id",
            "app_secret",
            "mchid",
            "apikey",
            "cert_pem",
            "key_pem",
          ]);
          this.form = newData;
        });
    },
    // 提交表单
    handleSubmit() {
      this.$refs.ClientWxapp.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await Api.update(this.key, { form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "小程序设置",
            message: data.message,
            duration: 1500,
          });
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 40px;
}
</style>