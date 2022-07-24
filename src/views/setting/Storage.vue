<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        class="setting-storage"
        :model="form"
        ref="SettingStorage"
        label-width="160px"
        style="padding: 30px 0 20px 100px"
      >
        <el-form-item required size="small" label="默认上传方式: ">
          <el-radio-group v-model="form.default">
            <el-radio
              v-for="(item, index) in StorageEnum.data"
              :key="index"
              :label="item.value"
              >{{ item.name }}
              {{
                item.value == StorageEnum.LOCAL.value ? "(不推荐)" : ""
              }}</el-radio
            >
          </el-radio-group>
        </el-form-item>

        <!-- 七牛云配置 -->
        <div v-if="form.default == StorageEnum.QINIU.value">
          <el-form-item label="存储空间名称 Bucket: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.QINIU.value].bucket"
              style="width: 420px"
            />
          </el-form-item>

          <el-form-item label="ACCESS_KEY AK: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.QINIU.value].access_key"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="SECRET_KEY SK: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.QINIU.value].secret_key"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="空间域名 Domain: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.QINIU.value].domain"
              style="width: 420px"
            />
          </el-form-item>
        </div>

        <!-- 阿里云配置 -->
        <div v-if="form.default == StorageEnum.ALIYUN.value">
          <el-form-item label="存储空间名称 Bucket: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.ALIYUN.value].bucket"
              style="width: 420px"
            />
          </el-form-item>

          <el-form-item label="AccessKeyId: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.ALIYUN.value].access_key_id"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="AccessKeySecret: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.ALIYUN.value].access_key_secret"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="空间域名 Domain: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.ALIYUN.value].domain"
              style="width: 420px"
            />
          </el-form-item>
        </div>

        <!-- 腾讯云配置 -->
        <div v-if="form.default == StorageEnum.QCLOUD.value">
          <el-form-item label="存储空间名称 Bucket: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.QCLOUD.value].bucket"
              style="width: 420px"
            />
          </el-form-item>

          <el-form-item label="所属地域 Region: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.QCLOUD.value].region"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="SecretId: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.QCLOUD.value].secret_id"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="SecretKey: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.QCLOUD.value].secret_key"
              style="width: 420px"
            />
          </el-form-item>
          <el-form-item label="空间域名 Domain: " size="small">
            <el-input
              v-model="form.engine[StorageEnum.QCLOUD.value].domain"
              style="width: 420px"
            />
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
import pick from "lodash.pick";
import * as Api from "@/api/setting/store";
import StorageEnum from "@/common/enum/file/Storage";
import { isEmpty } from "@/utils/util";

export default {
  data() {
    return {
      // 表单数据
      form: {
        // 默认上传方式
        default: 'local',
        // 配置
        engine: {
          // 七云牛配置
          [StorageEnum.QINIU.value]: {
            bucket: '',
            access_key: '',
            secret_key: '',
            domain: ''
          },
          // 阿里云配置
          [StorageEnum.ALIYUN.value]: {
            bucket: '',
            access_key_id: '',
            access_key_secret: '',
            domain: ''
          },
          // 腾讯云配置
          [StorageEnum.QCLOUD.value]: {
            bucket: '',
            region: '',
            secret_id: '',
            secret_key: '',
            domain: ''
          },
        }
      },
      // 加载
      loading: false,
      // 当前设置项的key
      key: "storage",
      // 当前记录详情
      record: {},
      // 枚举类
      StorageEnum,
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
      const { record, $nextTick } = this;
      !isEmpty(this.form) &&
        $nextTick(() => {
          const newData = pick(record, ["default", "engine"]);
          this.form = newData;
        });
    },
    // 提交表单
    handleSubmit() {
      this.$refs.SettingStorage.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await Api.update(this.key, { form: this.form });
          this.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "上传设置",
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