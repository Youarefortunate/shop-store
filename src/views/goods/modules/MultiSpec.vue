<template>
	<div>
		<el-form-item label="商品规格: " size="mini">
			<div v-if="true" class="form-item-help" style="line-height: 36px">
				<small style="color: rgba(0, 0, 0, 0.45); margin: 5px 0">最多添加3个商品规格组, 生成的SKU数量不能超过50个</small>
			</div>
			<!-- 规格组 -->
			<div class="spec-group" v-for="(item, index) in multiSpecData.specList" :key="index">
				<div class="spec-group-item">
					<el-input 
						class="group-item-input"
						v-model="item.spec_name" 
						:readonly="isSpecLocked"
						placeholder="请输入规格名称"
						@change="onChangeSpecGroupIpt">
					</el-input>
					<a
						class="group-item-delete"
						v-if="!isSpecLocked"
						href="javascript:;"
						@click="handleDeleteSpecGroup(index)"
					>删除规格组</a>
				</div>
				<div class="spec-value">
					<div class="spec-value-item" v-for="(itm, idx) in item.valueList" :key="idx">
						<el-input 
							class="value-item-input"
							v-model="itm.spec_value" 
							:readonly="isSpecLocked"
							placeholder="请输入规格值"
							@change="onChangeSpecValueIpt"/>
						<i 
							v-if="!isSpecLocked"
							class="el-icon-error"
							@click="handleDeleteSpecValue(index, idx)"></i>
					</div>
					<!-- 新增规格值 -->
					<div v-if="!isSpecLocked" class="spec-value-add">
						<a href="javascript:;" @click="handleAddSpecValue(index)">新增规格值</a>
					</div>
				</div>
			</div>
			<!-- 添加规格按钮, 添加的规格组不得超过三个 -->
			<el-button 
				plain
				v-if="!isSpecLocked && multiSpecData.specList.length < 3"
				icon="el-icon-plus" @click="handleAddSpecGroup" size="small">添加规格组</el-button>
		</el-form-item>
		<!-- SKU列表,仅当存在多个规格组时显示 -->
		<el-form-item label="SKU列表: " v-show="multiSpecData.skuList.length" size="small"> 
			<div v-if="multiSpecData.skuList.length > 1" class="sku-batch">
				<span class="title">批量设置: </span>
				<el-input-number
					v-for="(item, index) in elInputNumber"
					:key="index"
					:min="item.min"
					:precision="item.precision"
					:placeholder="item.placeholder"
					controls-position="right"
					v-model="multiSpecData.skuBatchForm[item.model]"/>
				<el-input v-model="multiSpecData.skuBatchForm.goods_sku_no" placeholder="sku编码"></el-input>
				<el-button size="small" @click="handleSkuBatch">立即设置</el-button>
			</div>
			<!-- sku列表table -->
			<el-table 
				:data="multiSpecData.skuList"
				class="sku-list"
				style="width: 100%"
				:header-cell-style="getRowClass">
				<el-table-column 
					v-for="(item, index) in multiSpecData.skuColumns"
					:label="item.label" :prop="item.prop" :key="index">
					<template slot-scope="scope">
						<!-- 预览图 -->
						<span v-if="item.text == 'image'">
							<select-image
								:width="50"
								v-model="scope.row.image_id"
								:defaultList="(scope.row.image_id > 0 && scope.row.image) ? [scope.row.image] : []"/>
						</span>
						<!-- 商品价格 -->
						<span v-if="item.text == 'goods_price'">
							<el-input-number v-model="scope.row.goods_price" :min="item.min" :precision="item.precision" controls-position="right" size="mini" style="width: 90px"/>
						</span>
						<!-- 划线价格 -->
						<span v-if="item.text == 'line_price'">
							<el-input-number v-model="scope.row.line_price" :min="item.min" :precision="item.precision" controls-position="right" size="mini" style="width: 90px"/>
						</span>
						<!-- 库存数量 -->
						<span v-if="item.text == 'stock_num'">
							<el-input-number v-model="scope.row.stock_num" :min="item.min" :precision="item.precision" controls-position="right" size="mini" style="width: 90px"/>
						</span>
						<!-- 商品重量 -->
						<span v-if="item.text == 'goods_weight'">
							<el-input-number v-model="scope.row.goods_weight" :min="item.min" :precision="item.precision" controls-position="right" size="mini" style="width: 90px"/>
						</span>
						<!-- sku编码 -->
						<span v-if="item.text == 'goods_sku_no'">
							<el-input v-model="scope.row.goods_sku_no" size="mini" style="width: 100px"></el-input>
						</span>
					</template>
				</el-table-column>
			</el-table>
		</el-form-item>
	</div>
</template>

<script>
	import MultiSpecModel from '@/common/model/goods/MultiSpec'
	import { SelectImage } from '@/components'

	export default {
		components: { SelectImage },
		props: {
			// 默认的规格列表
			defaultSpecList: { type: Array, default: () => [] },
			// 默认的SKU列表
			defaultSkuList: { type: Array, default: () => [] },
			// 商品规格是否锁定(锁定状态下不允许编辑规格)
			isSpecLocked: { type: Boolean, default: false }
		},
		data() {
			const elInputNumber = [
				{
					min: 0.01,
					precision: 2,
					placeholder: '商品价格',
					mode: 'goods_price'
				},
				{
					min: 0,
					precision: 2,
					placeholder: '划线价格',
					mode: 'line_price'
				},
				{
					min: 0,
					precision: 0,
					placeholder: '库存数量',
					mode: 'stock_num'
				},
				{
					min: 0,
					precision: 2,
					placeholder: '商品重量',
					mode: 'goods_weight'
				},
			]
			return {
				// 商品多规格模型
				MultiSpecModel: new MultiSpecModel(),
				// MultiSpecModel: Object,
				multiSpecData: {
					// 规格列表
					specList: [],
					// SKU列表
					skuList: []
				},
				elInputNumber,
			}
		},
		watch: {
			defaultSpecList(val) {
				if(val.length && this.MultiSpecModel.isEmpty()) {
					this.getData()
				}
			}
		},
		// 初始化数据
		created () {
			// 获取规格及SKU信息
			this.getData()
		},
		methods: {
			// 获取规格及SKU信息(展示)
			getData() {
				const { defaultSpecList, defaultSkuList } = this;
				this.multiSpecData = this.MultiSpecModel.getData(defaultSpecList, defaultSkuList)
			},
			// 获取规格及SKU(表单提交)
			getFormSpecData() {
				return this.MultiSpecModel.getFormSpecData()
			},
			// 添加规格组(不得超过三个)
			handleAddSpecGroup() {
				if(this.checkSkuMaxNum()) {
					this.MultiSpecModel.handleAddSpecGroup()
				}
			},
			// 删除规格组
			handleDeleteSpecGroup(groupIndex) {
				const that = this
				this.$confirm('你确认要删除该规格组删除后不可恢复, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.MultiSpecModel.handleDeleteSpecGroup(groupIndex)
				}).catch(() => {})
			},
			// 新增规格值
			handleAddSpecValue(groupIndex) {
				if(this.checkSkuMaxNum()) {
					this.MultiSpecModel.handleAddSpecValue(groupIndex)
				}
			},
			// 删除规格值,输入规格值输入框右上角删除该输入框图标点击事件
			handleDeleteSpecValue(groupIndex, valueIndex) {
				const that = this
				this.$confirm('你确认要删除该规格值嘛, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					that.MultiSpecModel.handleDeleteSpecValue(groupIndex, valueIndex)
				}).catch(() => {})
			},
			// 规格名称输入框按下回车或者失去焦点事件
			onChangeSpecGroupIpt() {
				// 更新skuList
				this.MultiSpecModel.onUpdate(true)
			},
			// 规格值输入框按下回车或者失去焦点事件
			onChangeSpecValueIpt() {
				// 更新skuList
				this.MultiSpecModel.onUpdate(true)
			},
			// 验证最大sku数量
			checkSkuMaxNum() {
				const skuList = this.multiSpecData.skuList
				if(skuList.length >= 50) {
					this.$notify.error({
						message: `生成的sku列表数量不能大于与50个,当前数量: ${skuList.length}个`,
						duration: 1500
					})
					return false
				}
				return true
			},
			// 批量设置sku事件,立即设置sku编码
			handleSkuBatch() {
				this.MultiSpecModel.handleSkuBatch()
			},
			// 验证多规格表单
			verifyForm() {
				if(!this.MultiSpecModel.verifyForm()) {
					this.$notify.error({ message: this.MultiSpecModel.getError() })
					return false
				}
				return true
			},
			// 表头样式
      getRowClass({ rowIndex }) {
          if (rowIndex == 0) {
              return "background: rgb(245,245,245); font-weight: 500; color: black";
          }
      }
		}
	}
</script>

<style lang="scss" scoped>
.spec-group {
	margin-bottom: 15px;
	.el-input {
		width: 180px;
		padding: 7px 12px;
	}
	.spec-group-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #f4f5f9;
		a {
			color: #1890ff;
			font-size: 12px;
			margin-right: 10px;
		}
	}
	.spec-value {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		background: #fbfbfb;
		padding: 8px 15px;
		.spec-value-item {
			position: relative;
			margin-right: 20px;

			&:hover {
				[class*=" el-icon-"], [class^=el-icon-] {
					display: block;
				}
			}
			[class*=" el-icon-"], [class^=el-icon-] {
				display: none;
				position: absolute;
				top: 0px;
				right: 3px;
				cursor: pointer;
				font-size: 18px;
				color: #7d7d7d;
			}
		}
		.spec-value-add {
			height: 28px;
			line-height: 28px;
			a {
				color: #1890ff;
				font-size: 12px;
			}
		}
	}
}
.sku-batch {
	display: flex;
	align-items: center;
	margin-bottom: 12px;
	.title {
		margin-right: 15px;
		font-size: 13px;
	}
	.el-input-number {
		margin-right: 15px;
		width: 120px;
	}
	.el-input {
		width: 140px;
	}
	.el-button {
		margin-left: 15px;
	}
}
// table
.sku-list::v-deep {
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 2px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}
	.avatar-uploader-icon {
		font-size: 15px;
		color: #8c939d;
		width: 50px;
		height: 50px;
		line-height: 50px;
		text-align: center;
	}
	.avatar {
		width: 50px;
		height: 50px;
		display: block;
	}
}
</style>