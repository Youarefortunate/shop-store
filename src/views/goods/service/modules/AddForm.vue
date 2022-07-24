<template>
    <div id="add-form-service">
        <el-dialog 
            width="40%"
            title="新增服务"
            custom-class="dialog"
            :visible.sync="visible"
            :before-close="handleClose">
            <el-form 
                ref="form"
                :model="formData"
                :rules="rules"
                v-loading="loading"
                label-position="right"
                class="form"
                label-width="100px">
                <el-form-item label="服务名称: " prop="name" size="small" required :label-width="formLabelWidth">
                    <el-input v-model="formData.name" placeholder="请输入服务与承诺名称"></el-input>
                </el-form-item>

                <el-form-item label="概述: " prop="summary" size="small" :label-width="formLabelWidth">
                    <el-input
                        type="textarea"
                        v-model="formData.summary" 
                        placeholder="请输入概述(300个字符以内)"
                        :autosize="{ minRows: 4 }"></el-input>
                </el-form-item>

                <el-form-item label="是否默认: " prop="is_default" size="small" required :label-width="formLabelWidth">
                    <el-radio-group v-model="formData.is_default">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    <div class="form-item-help">
                        <div class="extra">新增商品是是否默认勾选</div>
                    </div>
                </el-form-item>

                <el-form-item label="状态: " prop="status" size="small" required :label-width="formLabelWidth">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="1">显示</el-radio>
                        <el-radio :label="0">隐藏</el-radio>
                    </el-radio-group>
                    <div class="form-item-help">
                        <div class="extra">用户端是否展示</div>
                    </div>
                </el-form-item>

                <el-form-item label="排序: " prop="sort" size="small" :label-width="formLabelWidth">
                    <el-input-number v-model="formData.sort" controls-position="right" :min="0"></el-input-number>
                    <div class="form-item-help">
                        <div class="extra">数字越小越靠前</div>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelSubmit">取 消</el-button>
                <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import * as Api from '@/api/goods/service'

    export default {
        name: 'AddForm',
        data() {
            return {
                // table数据
                formData: {
                    // 服务名称
                    name: '',
                    // 概述
                    summary: '',
                    // 是否默认
                    is_default: 1,
                    // 用户端是否展示
                    status: 1,
                    // 排序
                    sort: 100
                },
                // 校验规则
                rules: {
                    name: [
                        { required: true, message: '请输入服务名称', trigger: 'blur' },
                        { min: 2, message: '请至少输入2个字符', trigger: 'blur' }
                    ],
                    sort: [{ required: true, message: '请输入至少1个数字', trigger: 'change' }]
                },
                loading: false,
                visible: false,
                formLabelWidth: '100px'
            }
        },
        methods: {
            add() {
                // 显示窗口
                this.visible = true
            },
            // 提交表单
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        const { data } = await Api.add({ form: this.formData })
                        this.visible = false;
                        this.$notify({
                            type: data.status == 200 ? 'success' : 'error',
                            title: '新增服务操作',
                            message: data.message,
                            showClose: true
                        })
                        this.$emit('handleSubmit')
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            // 重置表单校验
            resetForm() {
                this.$refs.form.resetFields();
            },
            // 取消提交表单并重置表单
            cancelSubmit() {
                this.visible = false;
                this.resetForm()
            },
            // 关闭dialog时重置表单项
            handleClose(done) {
                this.resetForm('form');
                done();
            },
        }
    }
</script>

<style lang="scss">
#add-form-service {
    // 标题
    .dialog .el-dialog__header {
        border-bottom: 1px solid #eee;
        .el-dialog__title {
            margin: 0;
            color: rgba(0, 0, 0, .85);
            font-weight: 500;
            font-size: 14.5px;
            line-height:22px;
            word-wrap: break-word;
        }
    }
    // 表单
    .form {
        padding: 10px 60px;
        .el-form-item__label {
            font-weight: 500;
        }
    }
    .dialog-footer {
        border-top: 1px solid #eee;
        .el-button {
            height: 35px;
            line-height: 1px;
            border-radius: 1px;
            margin-top: 10px;
        }
    }
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
            color: rgba(0, 0, 0, .45);
            font-size: 12.5px;
        }
    }
}
</style>