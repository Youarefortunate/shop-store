<template>
  <div class="goods-info clearfix">
    <!-- 商品图片 -->
    <div class="in-left">
      <el-image 
        fit="scale-down"
        style="width: 60px; height: 60px"
        :src="dataObj.image" 
        :alt="dataObj.imageAlt" 
      />
    </div>
    <div class="in-right">
      <!-- 商品名称 -->
      <div
        class="title twoline-hide"
        style="font-size: 12.5px"
        :style="{ width: `${dataObj.titleWidth}px` }"
      >
        {{ dataObj.title }}
      </div>
      <!-- 副标题 -->
      <div
        v-if="isEmpty(dataObj.goodsProps)"
        class="subtitle"
        :class="{ 'c-p': subTitleColor }"
      >
        {{ dataObj.subtitle }}
      </div>
      <!-- 商品规格 -->
      <div v-else class="goods-props clearfix">
        <div
          class="goods-props-item"
          v-for="(props, idx) in dataObj.goodsProps"
          :key="idx"
        >
          <span>{{ props.value.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "@/utils/util";

// Table内容元素: 商品信息
export default {
  name: "GoodsItem",
  props: {
    // 商品信息
    data: { type: Object, default: () => {} },
    // 副标题颜色
    subTitleColor: { type: Boolean, default: false },
  },
  computed: {
    dataObj() {
      // Object.assign()将多个对象合并返回一个新的对象
      return Object.assign(
        {
          image: "",
          imageAlt: "",
          title: "",
          subtitle: "",
          goodsProps: [],
          titleWidth: 200,
        },
        this.$props.data
      );
    },
  },
  data() {
    return {
      isEmpty,
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
@size: 60px;
.goods-info {
  width: 270px;
  line-height: 1.3;
  white-space: normal;
  .in-left {
    float: left;
    margin-right: 8px;

    img {
      width: @size;
      height: @size;
    }
  }
  .in-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    float: left;
    // width: 200px;
    height: @size;
    .title {
      font-size: 14px;
      margin-bottom: 5px;
    }
    .subtitle {
      font-size: 12px;
      color: #7b7b7b;
    }
  }
  // 商品规格
  .goods-props {
    color: #8a8a8a;
    font-size: 12px;
    overflow: hidden;
    // 其中&代表的就是父级,也就是 .goods-props-item == &-item
    &-item {
      display: inline-block;
      margin-right: 4px;
    }
  }
}
</style>
