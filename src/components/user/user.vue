<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=!dialogVisible">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" @click="editUserShowDialog(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="success" icon="el-icon-delete" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 角色分配 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="info" icon="el-icon-message" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 数据分页的区域 -->
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 6]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主要区域  -->
      <el-form
        :model="editForm"
        status-icon
        :rules="editFormRules"
        ref="editFormRef"
        label-width="90px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户的对话框 -->
    <el-dialog title="用户添加" :visible.sync="dialogVisible" width="50%" @close="addDiaLogClosed">
      <!-- 内容主要区域  -->
      <el-form
        :model="addForm"
        status-icon
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    // 验证邮箱的校验规则
    const checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      }
      callback(new Error("请输入正确的邮箱地址"));
    };
    // 验证手机号码的校验规则
    const checkMobile = (rule, value, callback) => {
      // 验证手机号码的正则表达式
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if (regMobile.test(value)) {
        // 合法的手机号码
        return callback();
      }
      callback(new Error("请输入正确的手机号码"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      editDialogVisible:false,
      // 添加用户的表单对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
       editForm: {
        username: "",
        email: "",
        mobile: ""
      },
      // 添加表单验证规则的对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" }
          // { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" }
          //  { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules:{
         email:[
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    //删除用户
    async removeUserById(id){
    const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
  
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        const {data:res}=await this.$http.delete('users/'+id)
          if(res.meta.status!==200){
            return this.$message.error("删除用户信息失败")
          }
           return this.$message.success("删除用户信息成功")
           this.getUserList()
    },
    //修改用户信息并且提交验证
    editUserInfo(){
       this.$refs.editFormRef.validate(async valid=>{
        
       if(!valid) return 
         //发起修改用户的请求
         const{data:res}=await this.$http.put('/users/'+this.editForm.id,{
             email:this.editForm.email,
             mobile:this.editForm.mobile

         })
        if(res.meta.status!==200){
             return this.$message.error("用户修改信息失败")
        }
          //关闭对话框
        this.$message.error("用户修改信息成功")
        this.editDialogVisible = !this.editDialogVisible
        //从新获取列表数据
        this.getUserList()
       
      })
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户的对话框
    async editUserShowDialog(id){
    
      const{data:res}=await this.$http.get('users/'+id)
      if(res.meta.status!=200){
        return this.$message.error("用户查询信息失败")
      }
      this.editForm=res.data
      this.editDialogVisible=!this.editDialogVisible

    },
    //用户的添加
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        //发起添加用户的网络请求
        const { data: result } = await this.$http.post("users", this.addForm);
        if (result.meta.status != 201) {
          this.$message.error("用户添加失败");
        }
        this.$message.success("用户添加成功");
        //关闭对话框
        this.dialogVisible = !this.dialogVisible;
        //从新获取列表数据
        this.getUserList();
      });
    },
    // 监听添加用户对话框的关闭事件
    addDiaLogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 监听Switch开关状态的改变
    async userStateChange(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      //console.log(userInfo)
      if (res.meta.status !== 200) {
        return this.$message.error("更新用户状态失败");
        userInfo.mg_state = !this.mg_state;
      }
      this.$message.error("更新用户状态成功");
    },
    //监听每页显示数据
    handleSizeChange(newSie) {
      this.queryInfo.pagesize = newSie;
      this.getUserList();
    },
    //当前页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    }
  },
  created() {
    this.getUserList();
  },
  mounted() {}
};
</script>
<style scoped>
.el-table {
  margin-top: 15px;
}
</style>