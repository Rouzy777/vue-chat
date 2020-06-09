<template>
    <div class='row mx-auto min-vh-100'>
        <div class='m-auto'>
            <h2>Hey, what's your name?</h2>
            <div class="row mx-auto mt-4 justify-content-between">
                <input v-model='username' class='col-8 form-control'>
                <router-link
                    @click.native='inChat'
                    tag='button'
                    :disabled='username.length < 3'
                    to='/chat'
                    class='btn btn-primary col-3'
                >
                    In chat!
                </router-link>
            </div>
            <small v-if='username.length < 3'>Nickname length must be bigger than 3</small>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChatWindow',
    data: () => ({
        username: ''
    }),
    methods: {
        inChat() {
            localStorage.username = this.username
        }
    }
}
</script>
