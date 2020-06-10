<template>
<div class='row mx-auto'>
	<div class="notification m-4">
		<div class="d-flex bg-shadow rounded p-2 mb-2" v-for='msg in info' :key='msg.username'>
			<h6 class='mb-0'><span class='text-primary'>{{msg.username}}</span> {{msg.type}}</h6>
		</div>
	</div>
	<div class='row px-0 col-12 mx-auto'>
		<div class='col-xl-3 col-lg-4 px-0 bg-shadow'>
			<ChatUser :lastMsg='messages[messages.length - 1]' :notReadedMsgs='0' @click.native='chat = "Chat"' class='px-2 hoverable' />
		</div>
		<div class="col-xl-9 col-lg-8 px-0">
			<div class="d-flex min-vh-100">
				<div v-if='!chat' class='m-auto'>
					<h2 class='text-muted'>Choose dialog</h2>
				</div>
				<div class='d-flex flex-column col-12 px-0' v-else>
					<nav class="navbar navbar-light bg-shadow border-left border-bottom">
						<div class='col-9 pl-0'>
							<h6 class='mb-0'>{{chat}}</h6>
							<p class='mb-0 text-muted'>{{connections}} members online</p>
						</div>
						<!-- <div class="">
                                <span>123</span>
                            </div> -->
					</nav>
					<div class='flex-grow-1 scroll p-3'>
						<div v-for='(msg, i) in messages' :key='`msg.message-${i}`' class='col-7 px-0 mb-2'>
							<div class="d-inline-block bg-shadow rounded px-2 py-1">
								<small :class='{"text-primary": msg.user === "Me", "text-muted": msg.user !== "Me"}'>{{msg.user}}</small>
								<p class='mb-0'>{{msg.message}}</p>
								<div class="text-right">
									<small class='text-muted'>{{msg.time}}</small>
								</div>
							</div>
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
								<EmojiPicker>
									<div slot="emoji-invoker" slot-scope="{ events: { click: clickEvent } }" @click.stop="clickEvent">
										<button type="button">open</button>
									</div>
									<div slot="emoji-picker" slot-scope="{ emojis }">
										<div>
											<div v-for="(emojiGroup, category) in emojis" :key="category">
												<h5>{{ category }}</h5>
												<div>
													<span
                                                        v-for="(emoji, emojiName) in emojiGroup"
                                                        :key="emojiName"
                                                        @click="goFuck(emoji)"
                                                        :title="emojiName">{{ emoji }}
                                                    </span>
												</div>
											</div>
										</div>
									</div>
								</EmojiPicker>
								<button v-if='newMessage' @click='send' class="col bg-shadow border-top border-left-0 border-right-0 border-bottom-0">
									<i class="fas fa-long-arrow-alt-right"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import io from 'socket.io-client'
import ChatUser from '@/components/ChatUser.vue'
import EmojiPicker from 'vue-emoji-picker'

let socket = io('http://localhost:4113');

export default {
	name: 'ChatWindow',
	data: () => ({
		newMessage: '',
		messages: [],
		typing: false,
		info: [],
		connections: 0,
		chat: '',
		username: localStorage.username
	}),
	components: {
		ChatUser,
		EmojiPicker
	},
	mounted() {
		window.onbeforeunload = () => {
			socket.emit('leave', this.username);
		}

		socket.emit('joined', this.username)

		socket.on('chat-message', (data) => {
			this.messages.push({
				message: data.message,
				type: 1,
				user: data.user,
				time: data.time
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
			if (this.newMessage.trim().length) {
				this.messages.push({
					message: this.newMessage,
					type: 0,
					user: 'Me',
					time: new Date().toLocaleTimeString('en-US', {
						hour12: false,
						hour: "numeric",
						minute: "numeric"
					})
				});

				socket.emit('chat-message', {
					message: this.newMessage,
					user: this.username,
					time: new Date().toLocaleTimeString('en-US', {
						hour12: false,
						hour: "numeric",
						minute: "numeric"
					})
				});

				this.newMessage = '';
			}
		},
		goFuck(emoji) {
			this.newMessage += emoji
		}
	}
}
</script>

<style>
.bg-shadow {
	background-color: rgba(0, 0, 0, 0.03) !important;
}

.hoverable:hover {
	cursor: pointer;
	background-color: rgba(0, 0, 0, 0.05);
}

.message-input {
	border-radius: 0 !important;
}

.message-input:focus,
button:focus {
	outline: 0
}

.notification {
	position: absolute;
	right: 0;
}

.notification--item {
	height: 40px;
}

.scroll {
	max-height: 85.8vh !important;
	overflow-y: scroll !important;
}
</style>
