import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/Home.vue'
import Welcome from '../components/welcome/welcome.vue'
import User from '../components/user/user.vue'

Vue.use(VueRouter)



const router = new VueRouter({
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {
      path:'/home',
      component:Home,
      redirect:'/welcome',
      children:[
        { 

          path:'/welcome',
          component:Welcome
        },
        {
          path:'/users',
          component:User
        }
      ]
    }

  ]
})
//  挂载路由导航守卫
 router.beforeEach((to, from, next) => {
  
   //to 将要访问的路径
   //from 代表从哪个路径跳转而来
   //next() 放行

   if(to.path==='/login')
   return next()
   //获取token
   const tokenStr=window.sessionStorage.getItem('token')
   if(!tokenStr){
     return next('/login')
   }else{
     return next();
   }
   
 })
export default router
