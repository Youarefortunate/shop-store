<template>
  <div id="file-modal">
    <el-dialog
      width="50%"
      custom-class="file-modal-dialog"
      :title="title"
      :visible.sync="visible"
      :append-to-body="appendToBody ? true : false"
      :close-on-click-modal="false"
    >
      <div class="library-box clearfix">
        <!-- 分组列表 -->
        <div class="file-group">
          <div class="group-tree">
            <el-tree
              v-if="groupListTreeSelect.length"
              :data="groupListTreeSelect"
              :props="defaultProps"
              @node-click="onSelectGroup"
            ></el-tree>
          </div>
          <a
            class="group-add"
            href="javascript:void(0);"
            @click="handleAddGroup"
            >新增分组</a
          >
        </div>

        <!-- 文件列表 -->
        <div class="file-list">
          <!-- 头部操作栏 -->
          <div class="top-operate clearfix">
            <!-- 搜索框 -->
            <div class="search-btn">
              <el-input
                class="fl-l"
                style="width: 200px"
                v-model="queryParam.fileName"
                placeholder="搜索文件名称"
                clearable
                size="small"
                suffix-icon="el-icon-search"
                @change="onSearch"
              />
            </div>
            <!-- 上传按钮 -->
            <div class="file-upload fl-r">
              <span class="upload-desc"
                >{{
                  fileType == FileTypeEnum.VIDEO.value ? "视频" : "图片"
                }}大不能超过{{ uploadSizeLimit }}M</span
              >
              <!-- :file-list="fileList" -->
              <el-upload
                name="iFile"
                class="upload-demo"
                multiple
                action="http://124.71.228.186/index.php?s=/store"
                :accept="accept"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :http-request="onUpload"
                :on-change="handleChange"
              >
                <el-button size="small" icon="el-icon-upload" plain
                  >上传</el-button
                >
              </el-upload>
            </div>
          </div>
          <div class="file-list-body" v-loading="loading">
            <!-- 文件列表 -->
            <ul
              v-if="fileList.data && fileList.data.length"
              class="file-list-ul clearfix"
            >
              <li
                class="file-item"
                :class="{ active: selectedIndexs.indexOf(index) > -1 }"
                v-for="(item, index) in fileList.data"
                :key="index"
                @click="onSelectItem(index)"
              >
                <!-- 图片 -->
                <el-image
                  class="img-cover"
                  style="width: 100px; height: 100px"
                  :src="item.preview_url"
                  fit="scale-down"
                />
                <div class="file-name oneline-hide">{{ item.file_name }}</div>
                <div class="select-mask">
                  <i class="el-icon-check"></i>
                </div>
              </li>
            </ul>
            <!-- 无数据时显示空状态 -->
            <!-- <el-empty v-else-if="!loading" description="暂无数据"/> -->
            <!-- 底部操作栏 -->
            <div class="footer-operate clearfix">
              <!-- 如果存在选中文件则显示 -->
              <div class="fl-l" v-if="selectedIndexs.length">
                <span class="footer-desc"
                  >已选择{{ selectedIndexs.length }}项</span
                >
                <el-button-group>
                  <el-button
                    size="mini"
                    plain
                    class="btn-mini"
                    @click="handleDelete()"
                    >删除</el-button
                  >
                  <el-button
                    size="mini"
                    plain
                    class="btn-mini"
                    @click="handleBatchMove()"
                    >移动</el-button
                  >
                </el-button-group>
              </div>
              <!-- 分页组件 -->
              <el-pagination
                class="fl-r"
                background
                layout="prev, pager, next"
                hide-on-single-page
                :total="fileList.total"
                :current-page="fileList.current_page"
                :page-size="15"
                @current-change="handleNextPage"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
      <!-- 新增分组 -->
      <AddGroupForm
        ref="AddGroupForm"
        :groupList="groupList"
        @handleSubmit="getGroupList"
      />
      <!-- 移动分组 -->
      <MoveGroupForm
        ref="MoveGroupForm"
        :groupList="groupListTree"
        @handleSubmit="handleRefresh"
      />
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store";
import { debounce } from "@/utils/util";
import * as FileApi from "@/api/files";
import * as GroupApi from "@/api/files/group";
import * as UploadApi from "@/api/upload";
import FileTypeEnum from "@/common/enum/file/FileType";
import ChannelEnum from "@/common/enum/file/Channel";
import AddGroupForm from "./AddGroupForm";
import MoveGroupForm from "./MoveGroupForm";

export default {
  name: "FilesModal",
  components: { AddGroupForm, MoveGroupForm },
  props: {
    // 多选模式, 如果false为单选
    multiple: { type: Boolean, default: false },
    // 最大选择的数量限制, multiple模式下有效
    maxNum: { type: Number, default: 100 },
    // maxNum: PropTypes.integer.def(100),
    // 已选择的数量
    selectedNum: { type: Number, default: 0 },
    // selectedNum: PropTypes.integer.def(0),
    // 文件类型 (10图片 30视频)
    fileType: { type: Number, default: FileTypeEnum.IMAGE.value },
    // fileType: PropTypes.integer.def(FileTypeEnum.IMAGE.value),
    // 是否为内置遮罩层
    appendToBody: { type: Boolean, default: false },
  },
  data() {
    return {
      title: "",
      // modal(对话框)是否可见
      visible: false,
      // 枚举类
      FileTypeEnum,
      // 后端上传api /upload/image
      uploadUrl: UploadApi.image,
      // 上传文件大小限制
      uploadSizeLimit: 2,
      // 文件上传的格式限制
      accept: "",
      // 配置选项
      defaultProps: {
        // children: 指定子树为节点对象的某个属性值
        children: "children",
        // label: 指定节点标签为节点对象的某个属性值
        label: "label",
      },
      // 查询参数
      queryParam: {
        // 文件类型: 图片
        fileType: FileTypeEnum.IMAGE.value,
        // 上传来源: 商户后台
        channel: ChannelEnum.STORE.value,
        // 当前页码
        page: 1,
        // 文件名称
        fileName: "",
        // 文件分组
        groupId: 0,
      },
      // modal(对话框)确定按钮 loading
      loading: true,
      // 分组列表
      groupList: [],
      // 文件列表
      fileList: [],
      // dialog文件分组列表(树状结构)
      groupListTree: [],
      // 左侧文件分组列表(用于筛选组件)
      groupListTreeSelect: [],
      // 选中的文件
      selectedIndexs: [],
      // 上传中的文件
      uploading: [],
    };
  },
  methods: {
    // 显示对话框
    show() {
      // 显示窗口
      this.visible = true;
      this.selectedIndexs = [];
      // 初始化文件类型
      this.initFileType();
      // 获取分组列表
      this.getGroupList();
      // 获取文件列表
      this.getFileList();
    },
    // 初始化文件类型
    initFileType() {
      if (this.fileType === FileTypeEnum.IMAGE.value) {
        this.title = "图片库";
        this.accept = "image/jpeg,image/png,image/gif,image/webp";
        // 图片的api请求地址
        this.uploadUrl = UploadApi.image;
        this.uploadSizeLimit = 2;
      }
      // 视频文件
      if (this.fileType === FileTypeEnum.VIDEO.value) {
        this.title = "视频库";
        this.accept = ".mp4";
        // 视频文件的api请求地址
        this.uploadUrl = UploadApi.video;
        // 视频最大不能超过10m
        this.uploadSizeLimit = 10;
      }
      this.queryParam.fileType = this.fileType;
    },
    // 获取文件分组列表
    async getGroupList() {
      const { data: result } = await GroupApi.list();
      // 记录列表数据
      const groupList = result.data.list;
      this.groupList = groupList;
      // 格式化分组列表
      const groupListTree = this.formatTreeData(groupList);
      // 记录 groupListTree
      this.groupListTree = groupListTree;
      // 记录 groupListTreeSelect
      this.groupListTreeSelect = [
        {
          label: "全部",
          key: -1,
          value: -1,
        },
        {
          label: "未分组",
          key: 0,
          value: 0,
        },
      ].concat(groupListTree);
    },
    // 获取文件列表
    async getFileList() {
      this.loading = true;
      const { data: result } = await FileApi.list(this.queryParam);
      this.loading = false;
      this.fileList = result.data.list;
    },
    // 格式化分组列表
    formatTreeData(list, disabled = false) {
      const data = [];
      list.forEach((item) => {
        // 新的元素
        const newItem = {
          label: item.name,
          key: item.group_id,
          value: item.group_id,
        };
        // 递归整理子集
        if (item.children && item.children.length) {
          newItem["children"] = this.formatTreeData(
            item["children"],
            newItem.disabled
          );
        } else {
          newItem["isLeaf"] = true;
          newItem["scopedSlots"] = { icon: "meh" };
        }
        data.push(newItem);
      });
      return data;
    },
    // tree节点被点击触发此事件,记录选中的分组
    onSelectGroup(selectedKeys) {
      this.queryParam.groupId = selectedKeys.key;
      this.handleRefresh(true);
    },
    // 记录选中的文件
    onSelectItem(index) {
      // 多选, 最大选中的数量, 选中的文件
      const { multiple, maxNum, selectedIndexs } = this;
      // 记录选中状态,不为多选
      if (!multiple) {
        // 修正选中文件的下标值
        this.selectedIndexs = [index];
        return;
      }
      const key = selectedIndexs.indexOf(index);
      // 存在文件
      const selected = key > -1;
      // 验证数量限制,
      if (!selected && selectedIndexs.length + this.selectedNum >= maxNum) {
        this.$message.warning(`最多可选${maxNum}个文件`);
        return;
      }
      // 如果selectedIndexs选择文件数组中不存在选中文件,
      !selected
        ? this.selectedIndexs.push(index)
        : this.selectedIndexs.splice(key, 1);
    },
    // 新增分组
    handleAddGroup() {
      this.$refs.AddGroupForm.add();
    },
    // 搜索文件
    onSearch() {
      this.handleRefresh(true);
    },
    // 对一次性上传的文件的数量进行限制
    handleChange(file, fileList) {
      // 显示错误提示(防抖处理)
      const showErrorMsg = debounce(this.$message.error, 20);
      // 验证上传文件数量
      if (fileList.length > 10) {
        showErrorMsg(`一次上传的文件数量不能超出10个`);
        return false;
      }
    },
    // 文件上传之前触发
    beforeUpload(file) {
      // 显示错误提示(防抖处理)
      const showErrorMsg = debounce(this.$message.error, 20);
      // 验证文件大小
      const fileSizeMb = file.size / 1024 / 1024;
      if (fileSizeMb > this.uploadSizeLimit) {
        showErrorMsg(`上传的文件大小不能超过${this.uploadSizeLimit}MB`);
        return false;
      }
      return true;
    },
    // 自定义文件上传
    onUpload(info) {
      this.loading = true;
      // 记录上传状态
      this.uploading.push(true);
      // 构建上传参数
      const formData = new FormData();
      formData.append("iFile", info.file);
      formData.append("groupId", this.queryParam.groupId);
      // 开始上传
      this.uploadUrl(formData).finally(() => {
        this.uploading.pop();
        if (this.uploading.length === 0) {
          this.loading = false;
          this.handleRefresh(true);
        }
      });
    },
    // 列表分页事件,页码发生改变
    handleNextPage(page) {
      this.queryParam.page = page;
      this.handleRefresh();
    },
    // 删除选中文件
    handleDelete() {
      const that = this;
      const fileIds = this.getSelectedItemIds();
      this.$confirm("你确定要删除该文件嘛, 删除后不可恢复,请谨慎操作", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data } = await FileApi.deleted({ fileIds });
          that.$notify({
            type: data.status == 200 ? "success" : "error",
            title: "删除文件操作",
            message: data.message,
            showClose: true,
          });
          that.handleRefresh(true);
        })
        .catch(() => {});
    },
    // 将选中的文件进行移动
    handleBatchMove() {
      const fileIds = this.getSelectedItemIds();
      this.$refs.MoveGroupForm.show(fileIds);
    },
    // 获取选中的的文件的id集
    getSelectedItemIds() {
      const selectedItems = this.getSelectedItems();
      return selectedItems.map((item) => item.file_id);
    },
    // 获取选中的文件
    getSelectedItems() {
      const selectedItems = [];
      for (const key in this.selectedIndexs) {
        const index = this.selectedIndexs[key];
        selectedItems.push(this.fileList.data[index]);
      }
      return selectedItems;
    },
    // 确认按钮
    handleSubmit() {
      // 获取选中的文件
      const selectedItems = this.getSelectedItems();
      // 通知父组件提交完成
      this.$emit("handleSubmit", selectedItems);
      // 关闭对话框
      this.handleCancel();
    },
    // 关闭对话框事件
    handleCancel() {
      this.visible = false;
      this.selectedIndexs = [];
    },
    /**
     * 刷新文件列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh(bool = false) {
      bool && (this.queryParam.page = 1);
      // 清空选中
      this.selectedIndexs = [];
      // 获取文件列表
      this.getFileList();
    },
  },
};
</script>

<style lang="scss">
// 分页器
.file-modal-dialog .library-box .file-list .file-list-body .footer-operate .fl-r {
  margin: 0 0 10px 0;
}
.file-modal-dialog {
  .el-dialog__header {
    padding: 10px 10px 10px 30px;
    margin-bottom: 10px;
  }
  .el-dialog__body {
    padding: 0;
  }
  // 文件库
  .library-box {
    user-select: none;
    // 文件分组
    .file-group {
      float: left;
      border-right: 1px solid #e6e6e6;
      // 分组列表
      .group-tree {
        width: 150px;
        height: 440px;
        overflow-y: auto;
        overflow-x: auto;

        .el-tree::v-deep {
          display: inline-block;
          min-width: 100%;
          max-height: 380px;
          width: auto;
        }
        .el-tree-node__content {
          margin-bottom: 5px;
        }
        .el-tree-node__content:hover {
          color: rgb(80, 86, 89);
          background-color: rgba(230, 247, 255);
        }
      }
      // 新增分组
      .group-add {
        color: #1890ff;
        display: block;
        margin-top: 20px;
        font-size: 14px;
        padding: 0 30px;
      }
    }

    // 文件列表
    .file-list {
      float: left;
      width: 630px;
      margin-left: 20px;

      // 头部操作区
      .top-operate {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .search-btn {
          flex: 1;
        }
        .file-upload {
          display: flex;
          align-items: center;
          .upload-desc {
            font-size: 12px;
            padding-right: 10px;
            color: #999;
          }
        }
      }

      // 文件列表
      .file-list-body {
        height: 455px;
        .file-list-ul {
          margin: 0;
          padding: 0;
          height: 417px;
          list-style: none;
        }
        .file-item {
          line-height: 18px;
          width: 110px;
          position: relative;
          cursor: pointer;
          border-radius: 2px;
          padding: 4px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          float: left;
          margin: 8px;
          -webkit-transition: All 0.2s ease-in-out;
          -moz-transition: All 0.2s ease-in-out;
          -o-transition: All 0.2s ease-in-out;
          transition: All 0.2s ease-in-out;
          &:hover {
            border: 1px solid #16bce2;
          }
        }
        .file-item {
          // 文件名称
          .file-name {
            font-size: 12px;
            text-align: center;
            // 文本内容过长时隐藏过长的文字,以...显示
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 0;
          }
          // 预览图
          .img-cover {
            margin: 0 auto;
            width: 95px;
            height: 95px;
            background: no-repeat center center / 100%;
          }
          // 遮罩层(选中时)
          &.active .select-mask {
            display: block;
          }
          .select-mask {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.41);
            text-align: center;
            border-radius: 2px;
            .el-icon-check {
              font-size: 26px;
              color: #fff;
              line-height: 122px;
              text-align: center;
            }
          }
        }

        // 底部操作栏
        .footer-operate {
          height: 28px;
          margin-top: 40px;
          .fl-l {
            float: left;
            .el-button {
              line-height: 1px;
            }
          }
          .fl-r {
            float: right;
          }
          .footer-desc {
            color: #999;
            margin-right: 10px;
          }
          .btn-mini {
            font-size: 14px;
            padding: 0 15px;
            height: 28px;
          }
        }
      }
    }
  }
}
</style>
