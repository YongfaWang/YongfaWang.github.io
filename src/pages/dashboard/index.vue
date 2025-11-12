<script lang="ts" setup>
import { useUserStore } from "@/pinia/stores/user"

const userStore = useUserStore()

const isAdmin = userStore.roles.includes("admin")
</script>

<template>
  <div style="display: flex; flex-direction: column; justify-content: center;">
    <div style="text-align: center;">
      <el-link type="primary" href="http://ybe645af.natappfree.cc/"
        target="_blank"><h3>http://ybe645af.natappfree.cc/</h3></el-link>
    </div>
    <div style="text-align: center;">
      <el-link type="primary" href="/#/test/echarts"
        target="_blank"><h3>1.首页主画面</h3></el-link>
    </div>
    <div style="text-align: center;">
      <el-link type="primary" href="/#/test/list"
        target="_blank"><h3>2.表格增删修改数据</h3></el-link>
    </div>
  </div>
  <!-- <component :is="isAdmin ? Admin : Editor" /> -->
</template>
