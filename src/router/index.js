import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import User from '@/components/User'
import Jobs from '@/components/Jobs'
import Login from '@/components/Login'
import Favorite from '@/components/Favorite'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Login
        },
        {
            path: '/User',
            name: 'User',
            component: User
        },
        {
            path: '/Jobs',
            name: 'Jobs',
            component: Jobs
        },
        {
            path: '/Login',
            name: 'Login',
            component: Login
        },
        {
            path: '/Favorite',
            name: 'Favorite',
            component: Favorite
        }
    ]
})
