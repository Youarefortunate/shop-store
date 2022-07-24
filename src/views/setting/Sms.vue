<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        class="setting-sms"
        :model="form"
        ref="SettingSms"
        label-width="150px"
        style="padding: 30px 0 20px 100px"
      >
        <el-form-item required size="small" label="短信平台: ">
          <el-radio-group v-model="form.default" @change="onChangeEngine">
            <el-radio
              v-for="(engine, index) in record.engine"
              :key="index"
              :label="index"
              >{{ engine.name }}</el-radio
            >
          </el-radio-group>
          <div v-if="form.default" class="form-item-help">
            <p class="extra">
              <span>短信平台管理地址</span>
              <a
                :href="record.engine[form.default].website"
                target="_blank"
                style="color: dodgerblue"
              >
                {{ record.engine[form.default].website }}</a
              >
            </p>
          </div>
        </el-form-item>

        <!-- 阿里云配置 -->
        <div v-if="form.default == 'aliyun'">
          <el-form-item label="AccessKeyId: " size="small" required>
            <el-input
              v-model="form.engine.aliyun.AccessKeyId"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="AccessKeySecret: " size="small" required>
            <el-input
              v-model="form.engine.aliyun.AccessKeySecret"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="短信签名 Sign: " size="small" required>
            <el-input v-model="form.engine.aliyun.sign" style="width: 420px" />
          </el-form-item>
        </div>

        <!-- 腾讯云配置 -->
        <div v-if="form.default == 'qcloud'">
          <el-form-item label="SdkAppID: " size="small" required>
            <el-input
              v-model="form.engine.qcloud.SdkAppID"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="AccessKeyId: " size="small" required>
            <el-input
              v-model="form.engine.qcloud.AccessKeyId"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="AccessKeySecret: " size="small" required>
            <el-input
              v-model="form.engine.qcloud.AccessKeySecret"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="短信签名 Sign: " size="small" required>
            <el-input v-model="form.engine.qcloud.sign" style="width: 420px" />
          </el-form-item>
        </div>

        <!-- 七牛云配置 -->
        <div v-if="form.default == 'qiniu'">
          <el-form-item label="AccessKey: " size="small" required>
            <el-input
              v-model="form.engine.qiniu.AccessKey"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="SecretKey: " size="small" required>
            <el-input
              v-model="form.engine.qiniu.SecretKey"
              style="width: 420px"
            />
          </el-form-item>
        </div>

        <!-- 短信场景配置 -->
        <div v-for="(item, index) in record['scene']" :key="index">
          <el-divider content-position="left">{{ item.name }}</el-divider>
          <el-form-item label="是否开启: " size="small" required>
            <el-radio-group v-model="form.scene[index].isEnable">
              <el-radio :label="true">开启</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="模板内容: " size="small" required>
            <span style="color: rgba(0, 0, 0, 0.45);">{{ record.scene[index].contentPractical }}</span>
          </el-form-item>

          <el-form-item label="模板ID/Code: " size="small" required>
            <el-input
              v-model="form.scene[index].templateCode"
              style="width: 420px"
            />
            <div class="form-item-help">
              <p class="extra">例如：SMS_139800030</p>
            </div>
          </el-form-item>

          <el-form-item
            v-if="record.scene[index].acceptPhone !== undefined"
            label="接收手机号: "
            size="small"
            required
          >
            <el-input
              v-model="form.scene[index].acceptPhone"
              style="width: 420px"
            />
            <div class="form-item-help">
              <p class="extra">
                注：如需写多个手机号，请使用英文逗号
                <el-tag type="info" size="small" style="margin: 0 5px">,</el-tag>隔开
              </p>
            </div>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { pick, omit } from "lodash";
import { isEmpty } from "@/utils/util";
import * as Api from "@/api/setting/store";
import SettingSmsSceneEnum from "@/common/enum/setting/sms/Scene";

export default {
  data() {
    return {
      // 表单数据
      form: {
        // 默认的短信平台
        default: "",
        engine: {
          // 阿里云
          aliyun: {
            AccessKeyId: "",
            AccessKeySecret: "",
            sign: "",
          },
          // 腾讯云配置
          qcloud: {
            SdkAppID: "",
            AccessKeyId: "",
            AccessKeySecret: "",
            sign: "",
          },
          // 七云牛配置
          qiniu: {
            AccessKey: "",
            SecretKey: "",
          },
        },
      },
      // 加载
      loading: false,
      SettingSmsSceneEnum,
      // 当前设置项的key
      key: "sms",
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
    // 切换短信平台事件
    onChangeEngine(value) {
      const that = this;
      const engine = value;
      for (const index in that.record.scene) {
        const item = that.record.scene[index];
        item.contentPractical = that.onVsprintf(
          item.content,
          item.variables[engine]
        );
      }
    },
    // 解析短信内容变量，生成完整的模板内容
    onVsprintf(str, variables) {
      const reg = new RegExp("%s");
      for (var i = 0; i < variables.length; i++) {
        str = str.replace(reg, variables[i]);
      }
      return str;
    },
    // 设置默认值
    setFieldsValue() {
      const that = this;
      const { record, $nextTick } = this;
      !isEmpty(this.form) &&
        $nextTick(() => {
          const scene = {};
          for (const index in record.scene) {
            console.log(index);
            const item = record.scene[index];
            const contentPractical = that.onVsprintf(
              item.content,
              item.variables[record.default]
            );
            that.$set(item, "contentPractical", contentPractical);
            scene[index] = pick(item, [
              "isEnable",
              "templateCode",
              "acceptPhone",
            ]);
          }
          const engine = {};
          for (const index in record.engine) {
            engine[index] = omit(record.engine[index], ["name", "website"]);
          }
          this.form.default = record.default;
          this.form.engine = engine;
          this.form.scene = scene;
        });
    },
    // 提交表单
    handleSubmit() {
      this.$refs.SettingSms.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await Api.update(this.key, { form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "短信通知",
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
</style>