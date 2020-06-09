<template>
    <div class='row mx-auto min-vh-100'>
        <div class='row px-0 col-12 mx-auto'>
            <div class='col-xl-3 col-lg-4 px-0 bg-shadow'>
                <ChatUser @click.native='chatName = "ChatYES"' class='px-2 hoverable'/>
            </div>
            <div class="col-xl-9 col-lg-8 px-0">
                <ChatMain :chat='chatName'/>
            </div>
        </div>
    </div>
</template>

<script>
import ChatUser from '@/components/ChatUser.vue'
import ChatMain from '@/components/ChatMain.vue'

export default {
    name: 'ChatWindow',
    data: () => ({
        chatName: ''
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
