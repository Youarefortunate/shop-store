<template>
  <div>
    <el-card v-loading="loading">
      <div class="card-title">{{ $route.meta.title }}</div>
      <!-- 表单部分 -->
      <el-form :model="form" ref="form" label-width="120px">
        <el-tabs v-model="tabKey" @tab-click="handleTabs">
          <el-tab-pane label="基本信息" name="0"></el-tab-pane>
          <el-tab-pane label="规格/库存" name="1"></el-tab-pane>
          <el-tab-pane label="商品详情" name="2"></el-tab-pane>
          <el-tab-pane label="更多设置" name="3"></el-tab-pane>
        </el-tabs>
        <div class="tabs-content">
          <!-- 基本信息 -->
          <div class="tab-pane" v-show="tabKey == '0'">
            <el-form-item
              label="商品名称: "
              prop="goods_name"
              size="small"
              :rules="[
                { required: true, message: '请输入商品名称', trigger: 'blur' },
                { min: 2, message: '请最少输入2个字符', trigger: 'blur' },
              ]"
            >
              <el-input
                v-model="form.goods_name"
                style="width: 420px"
                placeholder="请输入商品名称"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="商品分类: "
              prop="categorys"
              size="small"
              :rules="[
                {
                  required: true,
                  message: '请至少选择一个商品分类',
                  trigger: 'blur',
                },
              ]"
            >
              <tree-select
                style="width: 420px"
                v-model="form.categorys"
                :selectValue="form.categorys"
                :treeData="formData.categoryList"
              />
              <div class="form-item-help">
                <router-link :to="{ path: '/goods/category/index' }"
                  >去新增</router-link
                >
                <a href="javascript:;" @click="onReloadCategoryList">刷新</a>
              </div>
            </el-form-item>

            <el-form-item label="商品图片: " prop="imagesIds" size="small">
              <SelectImage
                multiple
                :defaultList="defaultList"
                :maxNum="10"
                v-model="form.imagesIds"
              />
              <div class="form-item-help">
                <div class="extra">
                  建议尺寸: 750*750像素, 最多上传十张, 支持一次多选,
                  第一张作为商品首图
                </div>
              </div>
            </el-form-item>

            <el-form-item label="商品编码: " size="small">
              <el-input
                v-model="form.goods_no"
                style="width: 420px"
                placeholder="请输入商品编码"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="运费模板: "
              prop="delivery_id"
              size="small"
              :rules="[
                {
                  required: true,
                  message: '请选择运费模板',
                  trigger: 'change',
                },
              ]"
            >
              <el-select
                v-model="form.delivery_id"
                style="width: 420px"
                placeholder="请选择商品分类"
                clearable
              >
                <el-option
                  v-for="(item, index) in formData.deliveryList"
                  :key="index"
                  :label="item.name"
                  :value="item.delivery_id"
                ></el-option>
              </el-select>
              <div class="form-item-help">
                <router-link :to="{ path: '/setting/delivery/template/create' }"
                  >新增模板</router-link
                >
                <a href="javascript:;" @click="onReloadCategoryList">刷新</a>
              </div>
            </el-form-item>

            <el-form-item label="商品状态: " prop="status" size="small">
              <el-radio-group v-model="form.status">
                <el-radio :label="10">上架</el-radio>
                <el-radio :label="20">下架</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="排序: " prop="sort" size="small">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="1"
              ></el-input-number>
              <div class="form-item-help">
                <div class="extra">数字越小越靠前</div>
              </div>
            </el-form-item>
          </div>

          <!-- 规格/库存 -->
          <div class="tab-pane" v-show="tabKey == '1'">
            <el-form-item
              label="规格类型: "
              @change="onForceUpdate()"
              prop="spec_type"
              size="small"
              required
            >
              <el-radio-group v-model="form.spec_type">
                <el-radio :label="10">单规格</el-radio>
                <el-radio :label="20">多规格</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 多规格表单内容 -->
            <div v-show="form.spec_type == 20">
              <MultiSpec ref="MultiSpec" />
            </div>
            <!-- 单规格的表单内容 -->
            <div v-show="form.spec_type == 10">
              <el-form-item
                v-for="(item, index) in specTypeContent"
                :key="index"
                :label="`${item.label}: `"
                :prop="item.prop"
                size="small"
              >
                <el-input-number
                  :min="item.min"
                  :precision="item.precision"
                  v-model="form[item.model]"
                  controls-position="right"
                />
                <span style="margin-left: 15px">{{ item.text }}</span>
                <div class="form-item-help">
                  <div class="extra">{{ item.extra }}</div>
                </div>
              </el-form-item>
            </div>
            <!-- 单规格和多规格共同存在的部分,库存计算方式 -->
            <el-form-item
              label="库存计算方式: "
              prop="deduct_stock_type"
              size="small"
              required
            >
              <el-radio-group v-model="form.deduct_stock_type">
                <el-radio :label="10">下单减库存</el-radio>
                <el-radio :label="20">存款减库存</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <!-- 商品详情 -->
          <div class="tab-pane" v-show="tabKey == '2'">
            <el-form-item
              label="商品详情: "
              size="small"
              prop="content"
              :rules="[
                {
                  required: true,
                  message: '商品详情不能为空',
                  trigger: 'blur',
                },
              ]"
            >
              <Ueditor v-model="form.content" />
            </el-form-item>
          </div>

          <!-- 更多设置 -->
          <div class="tab-pane" v-show="tabKey == '3'">
            <el-form-item label="主图视频: ">
              <SelectVideo :multiple="false" v-model="form.video_id" />
              <div class="form-item-help">
                <div class="extra">建议视频宽高比19:9，建议时长8-45秒</div>
              </div>
            </el-form-item>

            <el-form-item label="视频封面: ">
              <SelectImage :multiple="false" v-model="form.video_cover_id" />
              <div class="form-item-help">
                <div class="extra">建议尺寸：750像素*750像素</div>
              </div>
            </el-form-item>

            <el-form-item label="商品卖点: " size="small">
              <el-input
                v-model="form.selling_point"
                style="width: 420px"
                placeholder="请输入商品卖点"
              />
              <div class="form-item-help">
                <div class="extra">
                  一句话简述，例如：此款商品美观大方 性价比较高 不容错过
                </div>
              </div>
            </el-form-item>

            <el-form-item label="服务与承诺: " size="small">
              <el-select
                multiple
                clearable
                v-if="formData.serviceList"
                v-model="form.serviceIds"
                style="width: 420px"
                placeholder="请选择服务与承诺"
              >
                <el-option
                  v-for="(item, index) in formData.serviceList"
                  :key="index"
                  :label="item.name"
                  :value="item.service_id"
                ></el-option>
              </el-select>
              <div class="form-item-help">
                <router-link
                  target="_blank"
                  :to="{ path: '/goods/service/index' }"
                  >去新增</router-link
                >
                <a href="javascript:;" @click="onReloadServiceList">刷新</a>
              </div>
            </el-form-item>

            <el-form-item label="初始销量: " size="small">
              <el-input-number
                v-model="form.sales_initial"
                controls-position="right"
                :min="0"
              />
              <div class="form-item-help">
                <div class="extra">用户端展示的销量 = 初始销量 + 实际销量</div>
              </div>
            </el-form-item>

            <el-divider content-position="left">积分设置</el-divider>
            <el-form-item
              label="积分赠送: "
              size="small"
              prop="is_points_gift"
              :rules="[
                { required: true, message: '请选择积分赠送', trigger: 'blur' },
              ]"
            >
              <el-radio-group v-model="form.is_points_gift">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
              <div class="form-item-help">
                <div class="extra">开启后用户购买此商品将获得积分</div>
              </div>
            </el-form-item>

            <el-form-item
              label="积分抵扣: "
              size="small"
              prop="is_points_discount"
              :rules="[
                { required: true, message: '请选择积分抵扣', trigger: 'blur' },
              ]"
            >
              <el-radio-group v-model="form.is_points_discount">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
              <div class="form-item-help">
                <div class="extra">
                  开启后用户购买此商品可以使用积分进行抵扣
                </div>
              </div>
            </el-form-item>

            <el-divider content-position="left">会员折扣设置</el-divider>
            <el-form-item
              label="会员折扣: "
              size="small"
              prop="is_enable_grade"
              :rules="[
                { required: true, message: '请选择会员折扣', trigger: 'blur' },
              ]"
            >
              <el-radio-group
                v-model="form.is_enable_grade"
                @change="onForceUpdate(true)"
              >
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
              <div class="form-item-help">
                <div class="extra">
                  开启后会员折扣，会员购买此商品可以享受会员等级折扣价
                </div>
              </div>
            </el-form-item>

            <el-form-item
              v-if="form.is_enable_grade"
              label="会员折扣设置: "
              size="small"
              prop="is_alone_grade"
              :rules="[
                {
                  required: true,
                  message: '请选择会员折扣设置',
                  trigger: 'blur',
                },
              ]"
            >
              <el-radio-group
                v-model="form.is_alone_grade"
                @change="onForceUpdate(true)"
              >
                <el-radio :label="0">默认等级折扣</el-radio>
                <el-radio :label="1">单独设置折扣</el-radio>
              </el-radio-group>
              <!-- 会员等级列表 -->
              <div v-if="form.is_alone_grade" style="margin-top: 18px">
                <el-form-item
                  v-for="item in formData.userGradeList"
                  :key="item.grade_id"
                  size="small"
                  :rules="[
                    {
                      required: true,
                      message: '折扣率不能为空',
                      trigger: 'blur',
                    },
                  ]"
                >
                  <span style="color: rgba(0, 0, 0, 0.45)"
                    >({{ item.name }})：</span
                  >
                  <el-input-number
                    v-model="form.alone_grade_equity[item.grade_id]"
                    controls-position="right"
                    :min="0"
                    :max="9.9"
                    :precision="1"
                    style="width: 100px"
                  />
                  <span style="margin-left: 10px; color: rgba(0, 0, 0, 0.45)"
                    >(折)</span
                  >
                </el-form-item>
              </div>
              <div class="form-item-help">
                <div class="extra">
                  开启后会员折扣，会员购买此商品可以享受会员等级折扣价
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
        <div class="tab-pane btn-submit">
          <el-form-item size="small" label-width="120px">
            <el-button
              type="primary"
              @click="handleSubmit"
              v-loading="isBtnLoading"
              >提 交</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import * as GoodsApi from "@/api/goods";
import { SelectImage, Ueditor, TreeSelect, SelectVideo } from "@/components";
import GoodsModel from "@/common/model/goods/Index";
import MultiSpec from "./modules/MultiSpec";
import { isEmptyObject } from "@/utils/util";

const specTypeContent = [
  {
    label: "商品价格",
    prop: "goods_price",
    min: 0.01,
    precision: 2,
    model: "goods_price",
    text: "元",
    extra: "商品的实际购买金额, 最低0.01",
  },
  {
    label: "划线价",
    prop: "line_price",
    min: 0,
    precision: 2,
    model: "line_price",
    text: "元",
    extra: "划线价仅用于商品页展示",
  },
  {
    label: "当前库存量",
    prop: "stock_num",
    min: 0,
    precision: 0,
    model: "stock_num",
    text: "件",
    extra: "商品的实际库存数量, 为0时用户无法下单",
  },
  {
    label: "商品重量",
    prop: "goods_weight",
    min: 0,
    model: "goods_weight",
    text: "千克 (Kg)",
    extra: "商品的实际重量, 用于计算运费",
  },
];

export default {
  components: {
    MultiSpec,
    SelectImage,
    Ueditor,
    TreeSelect,
    SelectVideo,
  },
  data() {
    return {
      // 默认的标签索引
      tabKey: "0",
      form: {
        // 商品名称
        goods_name: "",
        // 商品分类
        categorys: null,
        // 商品图片
        imagesIds: "",
        // 商品编码
        goods_no: "",
        // 运费模板
        delivery_id: "",
        // 状态
        status: 10,
        // 排序
        sort: 100,
        // 规格
        spec_type: 10,
        // 商品价格
        goods_price: 1,
        // 划线价
        line_price: 0,
        // 当前库存数量
        stock_num: 100,
        // 商品重量
        goods_weight: 0,
        // 库存计算方式
        deduct_stock_type: 10,
        // 商品详情
        content: "",
        // 主图视频
        video_id: "",
        // 视频封面
        video_cover_id: "",
        // 商品卖点
        selling_point: "",
        // 服务与承诺
        serviceIds: "",
        // 初始销量
        sales_initial: 0,
        // 积分赠送
        is_points_gift: 1,
        // 积分抵扣
        is_points_discount: 1,
        // 会员折扣
        is_enable_grade: 1,
        // 会员折扣设置
        is_alone_grade: 0,
        // 会员等级列表
        // alone_grade_equity: {},
      },
      loading: false,
      isBtnLoading: false,
      // 单规格tab页数据
      specTypeContent,
      // 表单数据
      formData: GoodsModel.formData,
      // 商品ID
      goodsId: null,
      // 默认选中的商品图片
      defaultList: [],
    };
  },
  beforeDestroy() {
    // 销毁商品详情
    GoodsModel.formData.goods = {};
  },
  // 初始化数据
  created() {
    // 初始化数据
    this.initData();
  },
  methods: {
    // 初始化数据
    initData() {
      // 记录商品id
      this.goodsId = this.$route.query.goodsId;
      this.loading = true;
      // 获取form所需的数据
      GoodsModel.getFromData(this.goodsId).then(() => {
        this.loading = false;
        // 商品表单数据
        if (!isEmptyObject(this.form)) {
          this.form = GoodsModel.getFieldsValue();
          this.defaultList = GoodsModel.defaultList;
        }
        this.form.serviceIds = this.formData.defaultServiceIds;
        this.form.alone_grade_equity = this.formData.defaultUserGradeValue;
      });
    },
    // tabs点击事件
    handleTabs(value) {
      this.tabKey = value.name;
    },
    // 会员折扣按钮组点击事件
    onForceUpdate(bool = false) {
      this.$forceUpdate();
      bool &&
        setTimeout(() => {
          this.$forceUpdate();
        }, 10);
    },
    // 提交整个表单
    handleSubmit() {
      this.$refs.form.validate((valid, error) => {
        if (!valid) {
          // 定位到错误tab选项卡
          this.onTargetTabError(error);
          return false;
        }
        // 验证多规格
        if (this.form.spec_type === 20) {
          const MultiSpec = this.$refs.MultiSpec;
          if (!MultiSpec.verifyForm()) {
            this.tabKey = "1";
            return false;
          }
          // 记录多规格数据
          this.form.specData = MultiSpec.getFormSpecData();
        }
        const categoryIds = [this.form.categorys];
        // 整理商品分类id集
        this.form.categoryIds = categoryIds.map((item) => item);
        // delete非响应式.Vue.delete是响应式
        delete this.form.categorys;
        // 提交到后端api
        this.onFormSubmit(this.form);
        return true;
      });
    },
    // 提交到后端api
    async onFormSubmit(values) {
      this.loading = true;
      this.isBtnLoading = true;
      const { data } = await GoodsApi.edit({
        goodsId: this.goodsId,
        form: values,
      });
      this.$notify({
        type: data.status == 200 ? "success" : "error",
        title: "编辑商品",
        message: data.message,
        duration: 1500,
      });
      // 跳转到列表页
      data.status == 200 &&
        setTimeout(() => {
          this.$router.push("./index");
        }, 1500);
      this.loading = false;
      this.isBtnLoading = false;
    },
    // 定位到错误tab选项卡
    onTargetTabError(errors) {
      // 表单字段与tabKey关系
      // 只需要必填字段即可
      const tabFieldsMap = [
        ["goods_name", "categorys", "imagesIds", "delivery_id"],
        ["spec_type", "goods_price"],
        ["content"],
        ["alone_grade_equity", "first_money", "second_money", "third_money"],
      ];
      // shift()方法移除数组第一个元素,与其相反的是 pop()方法删除数组最后一个元素
      const filed = Object.keys(errors).shift();
      for (const key in tabFieldsMap) {
        if (tabFieldsMap[key].indexOf(filed) > -1) {
          this.tabKey = key;
          break;
        }
      }
    },
    // 刷新分类列表
    onReloadCategoryList() {
      this.loading = true;
      GoodsModel.getCategoryList().then(() => {
        this.loading = false;
      });
    },
    // 刷新配送模板列表
    onReloadDeliveryList() {
      this.loading = true;
      GoodsModel.getDeliveryList().then(() => {
        this.loading = false;
      });
    },
    // 刷新服务与承诺列表
    onReloadServiceList() {
      this.loading = true;
      GoodsModel.getServiceList().then(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  font-size: 14.5px;
  margin-bottom: 30px;
  color: rgba(0, 0, 0, 0.75);
}
.el-form::v-deep {
  .el-form-item__label {
    font-weight: 500;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 40px;
  }
}
// 基本信息
.tab-pane {
  padding: 20px 60px 0 60px;
  .form-item-help {
    font-size: 12px;
    line-height: 1.5;
    padding-top: 4px;
    min-height: 22px;
    a {
      color: #1890ff;
      text-decoration: none;
      background-color: transparent;
      outline: none;
      cursor: pointer;
      margin: 0 3px;
    }
    .extra {
      padding-top: 4px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12.5px;
    }
  }
}
.btn-submit {
  padding: 0 60px;
}
</style>