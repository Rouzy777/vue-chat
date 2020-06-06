<template>
    <div class='row mx-auto min-vh-100'>
        <div class='col-xl-3 col-lg-4 px-0 bg-shadow'>
            <ChatUser :userName='data' @click.native='username = data' class='px-2 hoverable'/>
        </div>
        <div class="col-xl-9 col-lg-8 px-0">
            <ChatMain :userName='username'/>
        </div>
    </div>
</template>

<script>
import ChatUser from '@/components/ChatUser.vue'
import ChatMain from '@/components/ChatMain.vue'

export default {
    name: 'ChatWindow',
    data: () => ({
        data: 'Chat',
        username: ''
    }),
    components: {
        ChatUser, ChatMain
    }
}
</script>

<style>
    .bg-shadow {
        background-color: rgba(0,0,0,0.03) !important;
    }

    .hoverable:hover {
        cursor: pointer;
        background-color: rgba(0,0,0,0.05);
    }
</style>
