<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        class="full-free"
        :model="form"
        ref="FullFree"
        label-width="150px"
        style="padding: 30px 0 20px 70px;"
      >
        <el-form-item
          label="是否开启满额包邮: "
          prop="is_open"
          size="small"
          :rules="[
            {
              required: true,
              message: '请选择是否开启满额包邮',
              trigger: 'change',
            },
          ]"
        >
          <el-radio-group v-model="form.is_open">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="单笔订单满: "
          prop="money"
          size="small"
          :rules="[
            {
              required: true,
              message: '请输入包邮的订单额度',
              trigger: 'blur',
            },
          ]"
        >
          <el-input-number
            :min="0"
            :precision="2"
            v-model="form.money"
            style="width: 120px"
            controls-position="right"
          />
          <span class="ml-10">元包邮</span>
          <div class="form-item-help">
            <p class="extra">如设置0为全场包邮</p>
          </div>
        </el-form-item>

        <el-form-item label="不参与包邮的商品: " size="small">
          <SelectGoods
            :defaultList="excludedGoodsList"
            v-model="form.excludedGoodsIds"
          />
        </el-form-item>

        <el-form-item label="不参与包邮的地区: " size="small">
          <el-button plain @click="handleAreasModal">选择地区</el-button>
          <div class="content">
            <span
              v-for="(province, pidx) in excludedRegions.selectedText"
              :key="pidx"
            >
              <span>{{ province.name }}</span>
              <template v-if="province.citys.length">
                <span>[</span>
                <span
                  class="city-name"
                  v-for="(city, cidx) in province.citys"
                  :key="cidx"
                  >{{ city.name
                  }}{{ province.citys.length > cidx + 1 ? "、" : "" }}</span
                >
                <span>]</span>
              </template>
              <span class="mr-5"></span>
            </span>
          </div>
        </el-form-item>

        <el-form-item
          label="满额包邮说明: "
          prop="describe"
          size="small"
          :rules="[
            { required: true, message: '请输入满额包邮说明', trigger: 'blur' },
          ]"
        >
          <el-input
            type="textarea"
            style="width: 500px"
            v-model="form.describe"
            :autosize="{ minRows: 4 }"
            placeholder="请输入充值说明"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提 交</el-button>
        </el-form-item>
      </el-form>
      <AreasModal ref="AreasModal" @handleSubmit="handleAreaSubmit" />
    </el-card>
  </div>
</template>

<script>
import pick from "lodash.pick";
import * as Api from "@/api/setting/store";
import * as GoodsApi from "@/api/goods";
import SelectGoods from "@/components/SelectGoods";
import { AreasModal } from "@/components/Modal";

export default {
  components: { AreasModal, SelectGoods },
  data() {
    return {
      // 当前表单元素
      form: {},
      // 当前设置项的key
      key: "full_free",
      // 正在加载
      loading: false,
      // 当前记录详情
      record: {},
      // 不参与包邮的地区
      excludedRegions: {
        cityIds: [],
        selectedText: [],
      },
      // 不参与包邮的商品列表
      excludedGoodsList: [],
    };
  },
  // 初始化数据
  async created() {
    // 获取当前详情记录
    await this.getDetail();
    // 获取不参与包邮的商品列表
    await this.getExcludedGoodsList();
  },
  methods: {
    // 获取当前详情记录
    async getDetail() {
      this.loading = true;
      const { data: result } = await Api.detail(this.key);
      // 当前记录
      this.record = result.data.values;
      // 设置默认值
      this.setFieldsValue();
      this.loading = false;
    },
    // 获取不参与包邮的商品列表
    async getExcludedGoodsList() {
      const {
        record: { excludedGoodsIds },
      } = this;
      if (excludedGoodsIds.length > 0) {
        this.loading = true;
        const { data: result } = await GoodsApi.listByIds(excludedGoodsIds);
        this.excludedGoodsList = result.data.list;
        this.loading = false;
      }
    },
    // 设置默认值
    setFieldsValue() {
      const { record, $nextTick } = this;
      $nextTick(() => {
        this.excludedRegions = record.excludedRegions;
        const newData = pick(record, ["is_open", "money", "describe"]);
        this.form = newData;
      });
    },
    // 显示选择地区对话框
    handleAreasModal() {
      this.$refs.AreasModal.handle({}, this.excludedRegions.cityIds);
    },
    // 提交满额包邮表单
    handleSubmit() {
      const { excludedRegions } = this;
      this.$refs.FullFree.validate((valid) => {
        if (valid) {
          this.form.excludedRegions = excludedRegions;
          this.onFormSubmit(this.form);
        }
      });
    },
    // 选择地区后的回调
    handleAreaSubmit(result) {
      this.excludedRegions = {
        cityIds: result.selectedCityIds,
        selectedText: result.selectedText,
      };
    },
    // 提交到后端api
    async onFormSubmit(values) {
      this.loading = true;
      const { data } = await Api.update(this.key, { form: values });
      this.$notify({
        type: data.status == 200 ? "success" : "error",
        title: "满额包邮",
        message: data.message,
        duration: 1500,
      });
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>