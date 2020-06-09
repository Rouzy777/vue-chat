<template>
    <div class="d-flex min-vh-100">
        <div v-if='!chat' class='m-auto'>
            <h2 class='text-muted'>Choose dialog</h2>
        </div>
        <div class='d-flex flex-column col-12 px-0 min-vh-100' v-else>
            <nav class="navbar navbar-light bg-shadow border-left border-bottom">
                <div class='col-9 pl-0'>
                    <h6 class='mb-0'>{{chat}}</h6>
                    <p class='mb-0 text-muted'>{{connections}} members online</p>
                </div>
                <!-- <div class="">
                    <span>123</span>
                </div> -->
            </nav>
            <div class='flex-grow-1 p-3'>
                <div v-for='(msg, i) in messages' :key='`msg.message-${i}`' class='bg-shadow mb-2 rounded px-2 py-1'>
                    <small :class='{"text-primary": msg.user === "Me", "text-muted": msg.user !== "Me"}'>{{msg.user}}</small>
                    <p class='mb-0'>{{msg.message}}</p>
                </div>
                <small class='text-muted' v-if="typing">{{typing}} is typing...</small>
            </div>
            <div>
                <div class="col px-0 row">
                    <div class="col-11">
                        <input
                            class='col py-3 bg-shadow border-left border-top border-right-0 border-bottom-0 message-input'
                            v-model='newMessage'
                            v-on:keyup.enter="send"
                            placeholder="Write a message...">
                    </div>
                    <div class="col bg-shadow border-top row px-0">
                        <button v-if='newMessage' @click='send' class="col bg-shadow border-top border-left-0 border-right-0 border-bottom-0"><i class="fas fa-long-arrow-alt-right"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import io from 'socket.io-client'
let socket = io('http://localhost:4113');

export default {
    data: () => ({
        newMessage: '',
        messages: [],
        typing: false,
        info: [],
        connections: 0,
        username: localStorage.username
    }),
    props: {
        chat: String
    },
    mounted() {
        window.onbeforeunload = () => {
            socket.emit('leave', this.username);
        }

        socket.on('chat-message', (data) => {
            this.messages.push({
                message: data.message,
                type: 1,
                user: data.user,
            });
        });

        socket.on('typing', (data) => {
            this.typing = data;
        });

        socket.on('stopTyping', () => {
            this.typing = false;
        });

        socket.on('joined', (data) => {
            this.info.push({
                username: data,
                type: 'joined'
            });

            setTimeout(() => {
                this.info = [];
            }, 5000);
        });

        socket.on('leave', (data) => {
            this.info.push({
                username: data,
                type: 'left'
            });

            setTimeout(() => {
                this.info = [];
            }, 5000);
        });

        socket.on('connections', (data) => {
            this.connections = data
        });
    },
    watch: {
        newMessage: function(value) {
            value ? socket.emit('typing', this.username) : socket.emit('stopTyping')
            setTimeout(() => {
                socket.emit('stopTyping')
            }, 5000)
        }
    },
    methods: {
        send() {
            this.messages.push({
                message: this.newMessage,
                type: 0,
                user: 'Me',
            });

            socket.emit('chat-message', {
                message: this.newMessage,
                user: this.username
            });
            this.newMessage = null;
        }
    }
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
