<template>
  <div>
    <el-cascader  
        clearable
        placeholder="请选择省市区"
        v-model="sValue"
        :options="options" 
        @change="onChange"></el-cascader>
  </div>
</template>

<script>
  import RegionModel from '@/common/model/Region'

  export default {
    name: 'SelectRegion',
    model: {
      prop: 'value', // 父组件中的使用v-model绑定的 formData.cascader
      event: 'change'
    },
    props: {
      value: { 
        type: Array,
        default: () => []
      },
      placeholder: {
        type: String,
        default: '请选择省区'
      }
    },
    data() {
      return {
        // 选中项,值为options中的value
        sValue: [],
        // 级联选择器数据
        options: []
      }
    },
    watch: {
      value(newVal) {
        // 当选择级联选择器中的值时触发watch
        this.sValue = newVal;
      }
    },
    created() {
      // 获取地区数据
      RegionModel.getTreeData().then(regions => {
        this.options = this.getOptions(regions)
      })
    },
    methods: {
      // 触发change事件,选择地区
      onChange(value) {
        this.$emit('change', value)
      },
      // 格式化级联选择器数据
      getOptions(regions) {
        const { getOptions, getChildren } = this;
        const options = []
        for(const index in regions) {
          // 将返回的地区整个大对象中的每一个区域对象都递归遍历出来
          const item = regions[index]
          const children = getChildren(item)
          // 整合成我们展示需要的变量名
          const optionItem = {
            value: item.id,
            label: item.name
          }
          if(children !== false) {
            optionItem.children = getOptions(children)
          }
          options.push(optionItem)
        }
        return options
      },
      // 获取子集地区
      getChildren(item) {
        if(item.city) {
          return item.city
        }
        if(item.region) {
          return item.region
        }
        return false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>