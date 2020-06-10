<template>
    <div class="row py-2 mx-auto">
        <div class='avatar-img'>
            <img class='rounded-circle img-fluid' src="https://dummyimage.com/300x300/000/fff" alt="">
        </div>
        <div class='col'>
            <h6 class='mb-1'><i class="fas fa-user-friends text-muted"></i> Chat</h6>
            <p v-if='lastMsg' class='mb-0 text-muted msg-snippet'><span class='text-primary'>{{lastMsg.user}}:</span> {{lastMsg.message}}</p>
            <p v-else class='mb-0 text-muted'>There's will be last msgs</p>
        </div>
        <div>
            <p v-if='lastMsg' class='mb-1 text-muted'>{{lastMsg.time}}</p>
            <div class="text-center">
                <span v-if='notReadedMsgs !== 0' class="mb-0 badge badge-pill badge-secondary">{{notReadedMsgs}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        lastMsg: Object,
        notReadedMsgs: Number
    }
}
</script>

<style lang="css" scoped>
    .avatar-img {
        width: 45px;
    }

    .msg-snippet {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
