<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        :model="form"
        class="client-register"
        style="padding: 30px 0 20px 100px"
        ref="ClientRegister"
        label-width="150px"
      >
        <el-form-item required size="small" label="默认登录/注册方式: ">
          <el-radio-group v-model="form.registerMethod">
            <el-radio :label="10">手机 + 短信验证码</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">
              发送短信服务需要先配置
              <router-link
                target="_blank"
                :to="{ path: '/setting/sms' }"
                style="color: dodgerblue"
                >短信通知设置</router-link
              >
            </p>
            <p class="extra">
              使用手机号作为主账户可以实现多种客户端的账户统一，例如H5和微信小程序
            </p>
          </div>
        </el-form-item>

        <el-divider content-position="left">微信小程序授权登录</el-divider>
        <el-form-item required size="small" label="一键授权登录/注册: ">
          <el-radio-group v-model="form.isOauthMpweixin">
            <el-radio :label="1">
              <span>开启</span>
              <el-tag type="success" size="small" class="ml-5">推荐</el-tag>
            </el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">
              开启后在微信小程序端一键获取用户授权并登录和注册
            </p>
          </div>
        </el-form-item>

        <el-form-item
          v-if="form.isOauthMpweixin == 1"
          required
          size="small"
          label="注册是绑定手机号: "
        >
          <el-radio-group v-model="form.isForceBindMpweixin">
            <el-radio :label="1">
              <span>强制绑定</span>
              <el-tag type="success" size="small" class="ml-5">推荐</el-tag>
            </el-radio>
            <el-radio :label="0">不绑定</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">
              开启后在微信小程序端一键授权注册时强制绑定手机号，仅首次注册时弹出
            </p>
            <p v-if="form.isForceBindMpweixin == 0" class="extra c-red">
              如果不强制绑定手机号，会造成多端情况下同一个用户注册多个账户，强烈推荐绑定手机号
            </p>
          </div>
        </el-form-item>

        <el-form-item
          v-if="form.isOauthMpweixin == 1 && form.isForceBindMpweixin == 0"
          required
          size="small"
          label="手动绑定手机号: "
        >
          <el-radio-group v-model="form.isManualBind">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="0">不显示</el-radio>
          </el-radio-group>
          <div class="form-item-help">
            <p class="extra">用户在个人中心页可以手动操作绑定手机号</p>
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
import * as Api from "@/api/setting/store";
import SettingSmsSceneEnum from "@/common/enum/setting/sms/Scene";

export default {
  data() {
    return {
      // 表单数据
      form: {
        // 默认登录/注册方式
        registerMethod: 10,
        // 一键授权登录/注册
        isOauthMpweixin: 1,
        // 注册是绑定手机号
        isForceBindMpweixin: 1,
        // 手动绑定手机号
        isManualBind: 1,
        //
      },
      // 正在加载
      loading: false,
      // 枚举值
      SettingSmsSceneEnum,
      // 当前设置项的key
      key: "register",
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
      this.record = result.data.values;
      // 设置默认值
      this.setFieldsValue();
      this.loading = false;
    },
    // 设置默认值
    setFieldsValue() {
      !isEmpty(this.form) &&
        this.$nextTick(() => {
          const newData = pick(this.record, [
            "registerMethod",
            "isManualBind",
            "isOauthMpweixin",
            "isForceBindMpweixin",
          ]);
          this.form = newData;
        });
    },
    // 提交表单
    async handleSubmit() {
      this.loading = true;
      const { data } = await Api.update(this.key, { form: this.form });
      this.$notify({
        type: data.status == 200 ? "success" : "error",
        title: "注册设置",
        message: data.message,
        duration: 1500,
      });
      this.loading = false;
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