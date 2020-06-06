<template>
    <div class="d-flex min-vh-100">
        <div v-if='!userName' class='m-auto'>
            <h2 class='text-muted'>Choose dialog</h2>
        </div>
        <div class='d-flex flex-column col-12 px-0 min-vh-100' v-else>
            <nav class="navbar navbar-light bg-shadow border-left border-bottom">
                <div class='col-9 pl-0'>
                    <h6 class='mb-0'>{{userName}}</h6>
                    <p class='mb-0 text-muted'>135 members</p>
                </div>
                <!-- <div class="">
                    <span>123</span>
                </div> -->
            </nav>
            <div class='flex-grow-1'>
                <p>123</p>
                <p>123</p>
                <p>123</p>
                <p>123</p>
            </div>
            <div>
                <div class="col px-0 row">
                    <div class="col-11">
                        <input
                            class='col py-3 bg-shadow border-left border-top border-right-0 border-bottom-0 message-input'
                            v-model='message'
                            placeholder="Write a message...">
                    </div>
                    <div class="col bg-shadow border-top row px-0">
                        <button v-if='message' type="submit" class="col bg-shadow border-top border-left-0 border-right-0 border-bottom-0"><i class="fas fa-long-arrow-alt-right"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        userName: String
    },
    data: () => ({
        message: ''
    })
}
</script>

<style lang="css" scoped>
    .message-input {
        border-radius: 0 !important;
    }

    .message-input:focus, button:focus {
        outline: 0
    }
</style>
