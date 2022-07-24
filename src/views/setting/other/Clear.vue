<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        :model="form"
        ref="Clear"
        label-width="160px"
        style="padding: 30px 0 20px 100px"
      >
        <el-form-item
          label="缓存项目: "
          prop="keys"
          size="small"
          :rules="[
            {
              required: true,
              message: '清理缓存项目至少选择一个',
              trigger: 'change',
            },
          ]"
        >
          <el-checkbox-group v-model="form.keys">
            <el-checkbox 
              v-for="(item, index) in items"
              :key="index"
              :label="item.key"
            >{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import * as Api from "@/api/setting/cache";
import StorageEnum from "@/common/enum/file/Storage";

export default {
  data() {
    return {
      // 表单数据
      form: {
        keys: []
      },
      // 加载
      loading: false,
      // 当前记录详情
      items: [],
      // 枚举类
      StorageEnum
    };
  },
  // 初始化数据
  created () {
    // 获取数据缓存项目
    this.getItems()
  },
  methods: {
    // 获取数据缓存项目
    async getItems() {
      this.lodaing = true
      const { data: result } = await Api.items()
      this.items = result.data.items
      // 设置默认值
      this.setFieldsValue()
      this.loading = false
    },
    // 设置默认值
    setFieldsValue() {
      const { items } = this
      this.$nextTick(() => {
        this.form.keys = items.map(item => item.key)
      })
    },
    // 提交表单
    handleSubmit() {
      this.$refs.Clear.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          const { data } = await Api.clear({ form: this.form });
          this.$message({
            type: data.status == 200 ? "success" : "error",
            message: data.message,
            duration: 1500,
          })
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>