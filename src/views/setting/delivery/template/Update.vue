<template>
  <div>
    <el-card>
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form
        v-loading="loading"
        :model="form"
        ref="TemplateUpdate"
        label-width="160px"
        style="padding: 30px 0 20px 100px"
      >
        <el-form-item
          label="模板名称: "
          prop="name"
          size="small"
          :rules="[
            { required: true, message: '请输入模板名称', trigger: 'blur' },
            { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="form.name"
            style="width: 420px"
            placeholder="请输入模板名称"
          />
        </el-form-item>

        <el-form-item
          label="优惠券类型: "
          size="small"
          required
        >
          <el-radio-group v-model="form.method" @change="onChangeMethod">
            <el-radio :label="10">按件数</el-radio>
            <el-radio :label="20">按重量</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="配送地区及运费: " size="small" required>
          <!-- 列表内容 -->
          <el-table
            v-show="ruleList.length"
            v-loading="loading"
            style="width: 800px; margin-bottom: 10px;"
            empty-text="数据都跑空啦~"
            :data="ruleList"
            :header-cell-style="getRowClass"
          >
            <el-table-column
              v-for="(item, index) in columns"
              :key="index"
              class="table-rules"
              :label="item.label"
              :prop="item.prop"
              :width="item.width"
            >
              <template slot-scope="scope">
                <!-- 可配送区域 -->
                <span v-if="item.text == 'region_text'">
                  <div class="content">
                    <span
                      v-for="(province, pidx) in scope.row.region_text"
                      :key="pidx"
                    >
                      <span>{{ province.name }}</span>
                      <template v-if="province.citys.length">
                        <span>(</span>
                        <span
                          class="city-name"
                          v-for="(city, cidx) in province.citys"
                          :key="cidx"
                          >{{ city.name
                          }}{{
                            province.citys.length > cidx + 1 ? "、" : ""
                          }}</span
                        >
                        <span>)</span>
                      </template>
                      <span>{{ " " }}</span>
                    </span>
                  </div>
                  <div class="operation">
                    <a
                      href="javascript:void(0);"
                      class="edit"
                      style="color:dodgerblue; font-size: 13px; float: right; margin-left: 6px"
                      @click="handleEdit(scope.$index, scope.row)"
                      >编辑</a
                    >
                    <a
                      href="javascript:void(0);"
                      class="delete"
                      style="color:dodgerblue; font-size: 13px; float: right; margin-left: 6px"
                      @click="handleDelete(scope.$index)"
                      >删除</a
                    >
                  </div>
                </span>
                <!-- 首件 (个) -->
                <span v-if="item.text == 'first'">
                  <el-input-number
                    v-model="scope.row.first"
                    :min="method == 10 ? 1 : 0.01"
                    :precision="method == 10 ? 0 : 2"
                    controls-position="right"
                  />
                </span>
                <!-- 首运费 -->
                <span v-if="item.text == 'first_fee'">
                  <el-input-number
                    v-model="scope.row.first_fee"
                    :min="0"
                    :precision="method == 10 ? 0 : 2"
                    controls-position="right"
                  />
                </span>
                <!-- 续件 -->
                <span v-if="item.text == 'additional'">
                  <el-input-number
                    v-model="scope.row.additional"
                    :min="0"
                    :precision="method == 10 ? 0 : 2"
                    controls-position="right"
                  />
                </span>
                <!-- 续费 -->
                <span v-if="item.text == 'additional_fee'">
                  <el-input-number
                    v-model="scope.row.additional_fee"
                    :min="0"
                    :precision="2"
                    controls-position="right"
                  />
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            plain
            icon="el-icon-location-information"
            @click="handleAdd"
            >点击添加配送区域</el-button
          >
        </el-form-item>

        <el-form-item
          label="排序: "
          prop="sort"
          size="small"
          :rules="[
            {
              required: true,
              message: '请输入排序值',
              trigger: 'blur',
            },
          ]"
        >
          <el-input-number
            :min="0"
            v-model="form.sort"
            controls-position="right"
          />
          <div class="form-item-help">
            <p class="extra">数字越小越靠前</p>
          </div>
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
import pick from 'lodash.pick'
import { AreasModal } from "@/components/Modal";
import * as Api from "@/api/setting/delivery";
import Region from "@/common/model/Region";

const defaultItem = {
  key: 0,
  first: 1,
  first_fee: 0,
  additional: 0,
  additional_fee: 0,
  region: [],
  region_text: [],
};

// table字段
const columns = [
  {
    label: "可配送区域",
    text: "region_text",
    width: '250'
  },
  {
    label: "首件 (个)",
    text: "first",
    width: '120'
  },
  {
    label: "运费(元)",
    text: "first_fee",
    width: '120'
  },
  {
    label: "续件 (个)",
    text: "additional",
    width: '120'
  },
  {
    label: "续费(元)",
    text: "additional_fee",
  },
];

export default {
  components: {
    AreasModal,
  },
  data() {
    return {
      // 表单数据
      form: {
        name: "",
        method: 10,
        sort: 100,
      },
      // 加载
      loading: false,
      // table内容
      ruleList: [],
      // 表头
      columns,
      // 计费方式
      method: 10,
      // 城市总数
      citysCount: null,
      // 运费模板ID
      deliveryId: null,
      // 当前记录
      record: {}
    };
  },
  created () {
    // 记录商品ID
    this.deliveryId = this.$route.query.deliveryId
    // 获取当前记录
    this.getDetail()
    // 城市总数
    Region.getCitysCount().then(count => {
      this.citysCount = count
    })
  },
  watch: {
    method (newVal) {
      this.updateMethod()
    }
  },
  methods: {
    // 获取当前记录
    async getDetail() {
      const { deliveryId, form } = this
      this.loading = true
      const { data: result } = await Api.detail({ deliveryId })
      const record = result.data.detail
      // 设置表单默认值
      const newData = pick(record, ['name', 'method', 'sort'])
      this.form = newData
      // 记录默认值
      this.ruleList = record.rule.map((item, index) => { return { ...item, key: index } })
      this.method = record.method
      this.record = record
      this.loading = false
    },
    // 更改计费方式
    onChangeMethod(value) {
      this.method = value;
    },
    // 更新计费方式
    updateMethod () {
      const text = {
        10: { first: '首件 (个)', additional: '续件 (个)' },
        20: { first: '首重 (Kg)', additional: '续重 (Kg)' }
      }
      this.columns[1].label = text[this.method].first
      this.columns[3].label = text[this.method].additional
    },
    // 新增记录(点击添加配送区域)
    handleAdd() {
      const index = this.ruleList.length;
      const newItem = { ...defaultItem, key: index };
      // 排除的城市id集(已存在的城市id集)
      const excludedCityIds = this.getExcludedCityIds();
      if (excludedCityIds.length === this.citysCount) {
        this.$message.error("已选择了所有的区域", 800);
        return false;
      }
      // 显示地区宣州区对话框
      this.handleAreasModal("add", index, newItem, excludedCityIds);
    },
    // 显示选择地区对话框
    handleAreasModal(scene, index, item, excludedCityIds) {
      this.$refs.AreasModal.handle(
        { scene, index, item },
        item.region,
        excludedCityIds
      );
    },
    // 编辑记录
    handleEdit(index, item) {
      // 排除的城市id集(已存在的城市id)
      const excludedCityIds = this.getExcludedCityIds();
      // 显示选择地区对话框
      this.handleAreasModal("edit", index, item, excludedCityIds);
    },
    // 排除的城市id集(已存在的城市id集)
    getExcludedCityIds() {
      const excludedCityIds = [];
      this.ruleList.forEach((item) => {
        item.region.forEach((cityId) => {
          excludedCityIds.push(cityId);
        });
      });
      return excludedCityIds;
    },
    // 选择地区后的回调
    handleAreaSubmit(result) {
      const {
        custom: { scene, item },
      } = result;
      item.region = result.selectedCityIds;
      item.region_text = result.selectedText;
      if (scene === "add") {
        this.ruleList.push(item);
      }
    },
    // 删除记录
    handleDelete(index) {
      this.$confirm("你确定要删除该记录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.ruleList.splice(index, 1)
        })
        .catch(() => {});
    },
    // 提交表单
    handleSubmit() {
      const { ruleList } = this;
      this.$refs.TemplateUpdate.validate(async (valid) => {
        if(valid) {
          if(ruleList.length === 0) {
            this.$message.error({
              message: '你还没有添加配送地区及运费',
              duration: 800
            })
            return false
          }
          // 提交到哦后端api
          this.form.rules = ruleList
          this.onFormSubmit(this.form)
        }
      })
    },
    onFormSubmit(values) {
      this.loading = true
      Api.edit({ deliveryId: this.deliveryId, form: values })
        .then(result => {
          const { data } = result
          // 显示错误信息
          this.$notify({
            type: data.status == 200 ? 'success' : 'error',
            title: '新增运费模板',
            message: data.message,
            duration: 1500
          })
          this.loading = false
          // 跳转到列表页
          setTimeout(() => {
            this.$router.push('./index')
          }, 1500)
        })
    },
    // 表头样式
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background: rgb(250,250,250); font-weight: 500; color: black;";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.table-rules {
  .operation {
    text-align: right;
    a {
      color:dodgerblue;
      font-size: 14px;
      margin-left: 6px;
    }
  }
  .content {
    color: #505050;
    white-space: normal;
    .city-name {
      font-size: 12.5px;
      color: #7b7b7b;
    }
  }
}
</style>
