<template>
    <div id="user-list">
        <el-card shadow="always" class="card-container">
            <!-- 标题 -->
            <div class="card-title">{{ $route.meta.title }}</div>
            <!-- 新增和搜索框 -->
            <div class="table-operator">
                <el-row>
                    <el-col :span="6" style="color: #fff; font-size: 10px;">
                        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
                    </el-col>
                    <el-col :span="7" :offset="10">
                        <el-input
                            size="medium"
                            clearable
                            placeholder="请输入用户名/姓名"
                            suffix-icon="el-icon-search"
                            v-model="queryParam.search"
                            @change="onSearch">
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <!-- 管理员列表 -->
            <el-table
                v-loading="loading"
                :data="tableData"
                style="width: 100%"
                :header-cell-style="getRowClass">
                <!-- <el-table-column
                    v-for="(item, index) in columns"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width">
                    <template slot-scope="scope" v-if="item.validate">
                        <span style="margin-right: 10px;">{{ scope.row.user_name }}</span>
                        <el-tag v-if="scope.row.is_super" type="success" size="medium">超级管理员</el-tag>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-link type="primary" :underline="false" style="margin-right: 10px;">编辑</el-link>
                        <el-link v-if="!scope.row.is_super" type="primary" :underline="false">删除</el-link>
                    </template>
                </el-table-column> -->

                <el-table-column
                    prop="store_user_id"
                    label="管理员ID"
                    width="250">
                </el-table-column>

                <el-table-column
                    label="用户名"
                    width="300">
                    <template slot-scope="scope">
                        <span style="margin-right: 10px;">{{ scope.row.user_name }}</span>
                        <el-tag v-if="scope.row.is_super" type="success" size="medium">超级管理员</el-tag>
                    </template>
                </el-table-column>

                <el-table-column
                    prop="real_name"
                    label="姓名"
                    width="200">
                </el-table-column>

                <el-table-column
                    prop="sort"
                    label="排序"
                    width="150">
                </el-table-column>

                <el-table-column
                    prop="create_time"
                    label="添加时间"
                    width="350">
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-link @click="handleEdit(scope.row)" type="primary" :underline="false" style="margin-right: 10px;">编辑</el-link>
                        <el-link @click="handleDelete(scope.row)" v-show="!scope.row.is_super" type="primary" :underline="false">删除</el-link>
                    </template>
                </el-table-column>
            </el-table>
            <add-form ref="AddForm" :roleList="roleList" @handleSubmit="handleRefresh"/>
            <edit-form ref="EditForm" :roleList="roleList" @handleSubmit="handleRefresh"/>
        </el-card>
    </div>
</template>

<script>
    import * as UserApi from '@/api/store/user'
    import * as RoleApi from '@/api/store/role'

    import AddForm from './modules/AddForm'
    import EditForm from './modules/EditForm'

    // 表头
    const columns = [
        {
            prop: 'store_user_id',
            label: '管理员ID',
            width: '250',
            validate: false
        },
        {
            prop: 'user_name',
            label: '用户名',
            width: '300',
            validate: true
        },
        {
            prop: 'real_name',
            label: '姓名',
            width: '200',
            validate: false
        },
        {
            prop: 'sort',
            label: '排序',
            width: '150',
            validate: false
        },
        {
            prop: 'create_time',
            label: '添加时间',
            width: '350',
            validate: false
        },
        // {
        //     label: '操作',
        //     width: '250',
        //     scope: true
        // },
    ]
    export default {
        name: 'Index',
        components: {
            AddForm,
            EditForm
        },
        data() {
            return {
                tableData: [], // table数据
                columns, // table表头
                loading: false, // table加载显示加载遮罩层
                roleList: [], // 角色列表
                queryParam: {}, // 查询参数
                
            }
        },
        mounted() {
            this.loadData();
            this.getRoleList();
        },
        methods: {
            // 获取列表数据
            async loadData() {
                this.loading = true;
                const { data } = await UserApi.list({ page: 1, ...this.queryParam });
                data.status == 200 ? this.loading = false : ''
                console.log(data);
                this.tableData = data.data.list.data || [];
            },
            // 获取角色列表 
            async getRoleList() {
                this.loading = true;
                const { data } = await RoleApi.list();
                data.status == 200 ? this.loading = false : ''
                this.roleList = data.data.list || [];
            },
            // 新增管理员
            handleAdd() {
                this.$refs.AddForm.add();
            },
            // 编辑管理员
            handleEdit(row) {
                this.$refs.EditForm.edit(row);
            },  
            // 删除记录
            handleDelete(row) {
                const that = this;
                this.$confirm('你确定要删除该记录嘛, 删除后不可恢复?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    that.loading = true;
                    const { data } = await UserApi.deleted({ userId: row['store_user_id'] });
                    if(data.status == 200) {
                        that.loading = false;
                        that.loadData();
                        that.$notify.success({
                            title: '删除记录操作',
                            message: data.message
                        })
                    }
                }).catch(() => { });
            },
            // 刷新列表
            handleRefresh() {
                this.loadData();
            },
            // 用户按下回车搜索触发
            onSearch(value) {
                this.loadData();
            },
            // 表头样式
            getRowClass({ rowIndex }) {
                if (rowIndex == 0) {
                    return "background: rgb(246,246,246);";
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
#user-list {
    // margin: 30px;
}
.card-container {
    .card-title{
        font-size: 14.5px;
        margin-bottom: 20px;
        color: rgba(0, 0, 0, .75);
    }
}

.table-operator {
    margin-bottom: 18px;
    .el-button {
        width: 76px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 1px;
    }
}
</style>