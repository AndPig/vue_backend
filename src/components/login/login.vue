<template>
  <div class="login_container">
      <div class="login_box">
          <div class="avatar_box">
              <img src="../../assets/logo.png" alt="登陆图片">
          </div>
          <!-- 登陆表单 -->
          <!-- loginFormRef 表单的实例对象 -->
          <el-form ref="loginFormRef" class="login_form" :rules="loginFormRules" :model="loginForm"> 
              <!-- 用户名 -->
                <el-form-item prop="username">
                   <el-input v-model="loginForm.username"  prefix-icon="iconfont icon-yonghu2"></el-input>
                </el-form-item>
                <!-- 密码 -->
                 <el-form-item prop="password">
                   <el-input v-model="loginForm.password" type="password"  prefix-icon="iconfont icon-mima"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                 <el-form-item class="btn">
                    <el-button type="primary" @click="login">登陆</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
          </el-form>    
      </div>
  </div>
</template>

<script>
import QS from 'qs'
// let token=''
// this.$http.defaults.headers.common['token'] = token;
// import axios from 'axios'
// const instance=axios.create({
//     timeout:5000,
//     baseURL:"http://localhost:8080/",
//     headers: 'application/json;charset=UTF-8'
  
// })
export default {
 
  components:{},
  props:{},
  data(){
    return {
        // 这是登陆表单的数据绑定对象
        loginForm:{
            username:'',
            password:''
        },
        // 登陆表单的验证规则
       loginFormRules:{
            username:[
                 { required: true, message: '请输入用户名称', trigger: 'blur' },
                 { min: 2, max: 10, message: '长度在 3到 10 个字符', trigger: 'blur' }
            ],
            password:[
                  { required: true, message: '请输入用户密码', trigger: 'blur' },
                  { min: 6, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
            ]
        }
    }
  },
  watch:{},
  computed:{},
  
  methods:{
      resetLoginForm(){
        //   console.log(this)
        this.$refs.loginFormRef.resetFields();
      },
      login(){
          this.$refs.loginFormRef.validate(valid=>{
            
            if(!valid){
                return
            }else{
                let data={
                        username:this.loginForm.username,
                        password:this.loginForm.password
                }
            this.$http({
                 method:'post',
                 url:'login',
                 data:data
        
             })
               .then(response=>{
                   console.log(response)
                   if(response.status==200){
                       //上面用到了箭头函数  this.$message才能被注入 为什么
                     this.$message({  
                           message:'登录成功',
                           type:'success'
                       })
                       window.sessionStorage.setItem("token",response.data.data.token)
                       this.$router.push("/home")
                   }
                   
               })
               .catch(error=>{
                     this.$message({
                           message:'登录失败用户名或者密码错误',
                           type:'error'
                       })
               })
            }
             
          })
      }
  },
  created(){},
  mounted(){}
}
</script>
<style scoped>
    el-input{
        width: 400px !important;
        margin-left: 100px !important;
        padding-left: 200px !important;
    }

    form{
       margin-top: -60px !important; 
    }
    form .btn{
        float: right;
        margin-right: 5px;
        border-radius: 0px;
    }
    .login_container{
        background-color: aqua;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top:50%;
        transform: translate(-50%,-50%);

    }
    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        left: 50%;
        transform: translate(100%,-50%);
        background-color: #fff;
        
    }
    img {
            width: 100%;
            height: 100%;
            border-radius:50%;
            background-color: #eee;
        }
</style>