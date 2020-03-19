<template>
  <div>
      <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {

  components:{},
  props:{},
  data(){
    return {
    }
  },
  watch:{},
  computed:{},
  methods:{
    //退出功能
    logout(){
      window.sessionStorage.clear();
      this.$router.push("/login")
    }
  },
  created(){},
  mounted(){}
}
</script>
<style scoped>
</style>