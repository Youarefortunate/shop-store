<template>
  <div>
    <el-button plain @click="handleSelectGoods">选择商品</el-button>
    <el-table
      v-show="selectedItems.length"
      row-key="goods_id"
      class="table-goodsList"
      style="width: 500px"
      empty-text="数据都跑空啦~"
      :data="selectedItems"
      :header-cell-style="getRowClass"
    >
      <el-table-column label="序号" type="index" width="55" />
      <el-table-column
        v-for="(item, index) in columns"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
      >
        <!-- 商品信息 -->
        <template slot-scope="scope">
          <span v-if="item.text == 'item'">
            <GoodsItem
              :data="{
                image: scope.row.goods_image,
                imageAlt: '商品图片',
                title: scope.row.goods_name,
                subtitle: `￥${ scope.row.goods_price_min }`
              }"
              :subTitleColor="true"
            />
          </span>
          <!-- 操作项 -->
          <span v-if="item.text == 'action'">
            <el-link type="primary" :underline="false" @click="handleDeleteItem(scope.$index, scope.row)">删除</el-link>
          </span>
          <!-- 显示其他项 -->
          <span>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <GoodsModal
      ref="GoodsModal"
      :multiple="multiple"
      :maxNum="maxNum"
      :defaultList="selectedItems"
      @handleSubmit="handleSelectGoodsSubmit"
    />
  </div>
</template>

<script>
import cloneDeep from "lodash.clonedeep";
import { GoodsModal } from "@/components/Modal";
import GoodsItem from "@/components/GoodsItem";

const columns = [
  {
    label: "商品ID",
    prop: "goods_id",
    width: '130'
  },
  {
    label: "商品信息",
    text: "item",
    width: '200'
  },
  {
    label: "库存总量",
    prop: "stock_total",
    width: '130'
  },
  {
    label: "操作",
    text: "action",
  },
];
export default {
  components: { GoodsItem, GoodsModal },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    // 多选模式, 如果false为单选
    multiple: { type: Boolean, default: true },
    // 最大选择的数量限制, multiple模式下有效
    maxNum: { type: Number, default: 100 },
    // 默认选中的商品
    defaultList: { type: Array, default: () => [] },
  },
  data() {
    return {
      columns,
      // 已选择的商品列表
      selectedItems: [],
      // 已选择的商品ID集
      selectedGoodsIds: [],
    };
  },
  watch: {
    // 设置默认数据
    defaultList: {
      immediate: true,
      handler(val) {
        const { selectedItems } = this
        if(val.length && !selectedItems.length) {
          this.onUpdate(cloneDeep(val))
        }
      }
    }
  },
  methods: {
    // 更新数据
    onUpdate(selectedItems) {
      // 为多选, 或者没有选择商品
      if(this.multiple || !selectedItems.length) {
        // 多选模式
        this.selectedItems = selectedItems
        this.selectedGoodsIds = selectedItems.map(item => item.goods_id)
      } else {
        // 单选,最后一个商品
        const single = selectedItems[selectedItems.length - 1]
        this.selectedItems = [single]
        this.selectedGoodsIds = [single.goods_id]
      }
      this.onChange()
    },
    // 打开商品选择器
    handleSelectGoods() {
      this.$refs.GoodsModal.handle()
    },
    // 删除选中的商品
    handleDeleteItem(index, item) {
      const { selectedItems } = this
      selectedItems.splice(index, 1)
      this.onUpdate(selectedItems)
    },
    // 商品库modal确认回调
    handleSelectGoodsSubmit(result) {
      const { selectedItems } = result
      this.onUpdate(cloneDeep(selectedItems))
    },
    // 触发change事件
    onChange() {
      const { multiple, selectedGoodsIds } = this
      const sGoodsIds = multiple ? selectedGoodsIds : (selectedGoodsIds.length ? selectedGoodsIds[0] : undefined)
      return this.$emit('change', sGoodsIds)
    },
    // 表头样式
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return "background: rgb(246,246,246); fontWeight: 500; color: black";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.table-goodsList {
  margin-top: 10px;
  min-width: 620px;
}
</style>