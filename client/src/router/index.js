import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Auth',
        component: () => import('../views/Auth.vue')
    },
    {
        path: '/chat',
        name: 'Chat',
        component: () => import('../views/Chat.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if(to.path != '/') {
        setTimeout(() => {
            if(localStorage.username) {
                //user has created username
                next();
            } else {
                //user need to sign up
                next('/');
            }
        }, 5)
    } else {
        next(); // This is where it should have been
    }
});

export default router
