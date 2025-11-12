<template>
  <div class="container">
    <div class="header">
      <div>
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter="handleQuery" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="reset">重置</el-button>
      </div>
      <div>
        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate">修改</el-button>
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDeletes">删除</el-button>
      </div>
    </div>
    <!-- 数据表格 -->
    <div class="table-container">
      <el-table :data="tableData" v-loading="loading" style="width: 100%" @selection-change="handleSelectionChange"
        stripe border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="age" label="年龄" />
        <el-table-column prop="score" label="成绩" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <!-- 添加/修改用户对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '修改用户' : '添加用户'" width="500px" center destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="formData.sex" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="formData.age" placeholder="请输入年龄" />
        </el-form-item>
        <el-form-item label="成绩" prop="score">
          <el-input v-model="formData.score" placeholder="请输入成绩" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            {{ isEdit ? '更新' : '添加' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { addBbb, delBbb, listBbb, updateBbb } from "@/common/apis/bbb/bbb"

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref()
const showSearch = ref(true)
const ids = ref([])
const single = ref(true);
const multiple = ref(true);
const queryParams = ref({
  name: '',
  pageNum: 1,
  pageSize: 10
})
const reset = () => {
  queryParams.value = {
    name: '',
    pageNum: 1,
    pageSize: 10
  }
  fetchTableData(queryParams);
}
// 表单数据
const formData = reactive({
  id: '',
  name: '',
  sex: '',
  age: '',
  score: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2到10个字符', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    {
      type: 'number',
      message: '请输入正确的年龄',
      trigger: 'blur',
      transform: (value) => Number(value)
    },
    {
      type: 'number',
      min: 1,
      max: 150,
      message: '年龄应在1-150之间',
      trigger: 'blur'
    }
  ],
  score: [
    { required: true, message: '请输入成绩', trigger: 'blur' },
    {
      type: 'number',
      message: '请输入正确的成绩',
      trigger: 'blur',
      transform: (value) => Number(value)
    },
    {
      type: 'number',
      min: 0,
      max: 100,
      message: '年龄应在0-100之间',
      trigger: 'blur'
    }
  ],
  sex: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 页面加载时获取数据
onMounted(() => {
  fetchTableData()
})

// 获取表格数据
const fetchTableData = async (params) => {
  loading.value = true
  try {
    listBbb(queryParams.value).then((res) => {
      tableData.value = res.data.rows
      total.value = res.data.total
      console.log(res.data);
    })
  } catch (error) {
    ElMessage.error('获取数据失败: ' + error.message)
  } finally {
    loading.value = false
  }
}
const handleSelectionChange = (selection) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
// 添加用户
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 修改用户
const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除用户
const handleDeletes = () => {
  ElMessageBox.confirm(
    `是否确定要删除编号为 "${ids.value}" 的行？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      delBbb(ids.value).then((res) => {
        ElMessage.success('删除成功')
        fetchTableData()
      })
    } catch (error) {
      ElMessage.error('删除失败: ' + error.message)
    }
  }).catch(() => {
    // 用户取消操作
  })
}
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `是否确定要删除编号为 "${row.id}" 的行？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      delBbb(row.id).then((res) => {
        ElMessage.success('删除成功')
        fetchTableData()
      })
    } catch (error) {
      ElMessage.error('删除失败: ' + error.message)
    }
  }).catch(() => {
    // 用户取消操作
  })
}
// 查询
const handleQuery = () => {
  console.log('刷新列表');
  fetchTableData();
}
// 提交表单
const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (isEdit.value) {
          updateBbb(formData).then((res) => {
            dialogVisible.value = false
            ElMessage.success('更新成功')
            fetchTableData() // 刷新表格
          })
        } else {
          addBbb(formData).then((res) => {
            dialogVisible.value = false
            ElMessage.success('添加成功')

            queryParams.pageNum = Math.ceil(total.value / queryParams.pageSize)
            fetchTableData() // 刷新表格
          })
        }
      } catch (error) {
        ElMessage.error('操作失败: ' + error.message)
      } finally {
        submitting.value = false
      }
    }
  })
}
// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: '',
    name: '',
    sex: '',
    age: '',
    score: ''
  })
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 分页处理
const handleSizeChange = (newSize) => {
  queryParams.pageSize = newSize
  fetchTableData()
}

const handleCurrentChange = (newPage) => {
  queryParams.pageNum = newPage
  fetchTableData()
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 15px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header>div {
  display: flex;
  flex-direction: row;
  margin: 0;
  color: #303133;
  font-size: 24px;
}

.table-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  display: flex;
  justify-content: center;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>