<template>
<div class='row mx-auto'>
	<div class="notification m-4">
		<div class="d-flex bg-shadow rounded p-2 mb-2" v-for='msg in info' :key='msg.username'>
			<h6 class='mb-0'><span class='text-primary'>{{msg.username}}</span> {{msg.type}}</h6>
		</div>
	</div>
	<div class='row px-0 col-12 mx-auto'>
		<transition name='fade'>
			<div v-if='isOpen' class="sidebar bg-shadow">
				<a class="closebtn mt-2 c-pointer" @click="isOpen = false">
					<i class="fas fa-times"></i>
				</a>
				<ChatUser
					:lastMsg='messages[messages.length - 1]'
					:notReadedMsgs='0'
					@click.native='chat = "Chat"; isOpen = false'
					class='px-2 hoverable sidebar-chat' />
			</div>
		</transition>
		<div class='col-lg-3 col-md-4 px-0 bg-shadow d-md-block d-none'>
			<ChatUser
				:lastMsg='messages[messages.length - 1]'
				:notReadedMsgs='0'
				@click.native='chat = "Chat"'
				class='px-2 hoverable' />
		</div>
		<div class="col-lg-9 col-md-8 px-0">
			<div class="d-flex min-vh-100">
				<div @click='isOpen = true' class='d-md-none d-block mobile-menu c-pointer m-3'>
					<i class="fas fa-2x fa-bars"></i>
				</div>
				<div v-if='!chat' class='m-auto'>
					<h2 class='text-muted us-none'>Choose dialog</h2>
				</div>
				<div class='d-flex flex-column col-12 px-0' v-else>
					<nav class="navbar navbar-light bg-shadow border-left border-bottom">
						<div class='col-9 pl-0'>
							<h6 class='mb-0'>{{chat}}</h6>
							<p class='mb-0 text-muted'>{{connections}} members online</p>
						</div>
					</nav>
					<section class='flex-grow-1 scroll p-3'>
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
					</section>
					<footer class='writer-absolute'>
						<div class="col px-0 row">
							<div class="col-11">
								<input
									class='col py-3 bg-shadow border-left border-top border-right-0 border-bottom-0 message-input'
									v-model='newMessage'
									v-on:keyup.enter="send"
									placeholder="Write a message...">
							</div>
							<div class="col border-top row px-0 bg-shadow">
								<EmojiPicker class='mt-1 us-none align-self-center'>
									<div slot="emoji-invoker" slot-scope="{ events: { click: clickEvent } }" @click.stop="clickEvent">
										<i class="far fa-smile text-muted emoji"></i>
									</div>
									<div slot="emoji-picker" class='scroll-smile shadow rounded p-2' slot-scope="{ emojis }">
										<transition name='fade' appear>
											<div>
												<div v-for="(emojiGroup, category) in emojis" :key="category">
													<small class='text-uppercase font-weight-bold text-muted'>{{ category }}</small>
													<div class='mb-1'>
														<span v-for="(emoji, emojiName) in emojiGroup" :key="emojiName" class='emoji' @click="append(emoji)" :title="emojiName">
															{{ emoji }}
														</span>
													</div>
												</div>
											</div>
										</transition>
									</div>
								</EmojiPicker>
								<transition name='fade'>
									<button v-if='newMessage' class="col mt-1 px-1 bg-light border-0">
										<span @click='send'>
											<i class="far emoji text-primary fa-arrow-alt-circle-right"></i>
										</span>
									</button>
								</transition>
							</div>
						</div>
					</footer>
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
		isOpen: false,
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
		append(emoji) {
			this.newMessage += emoji
		}
	}
}
</script>

<style>
.us-none {
	user-select: none;
}

.c-pointer {
	cursor: pointer;
}

.bg-shadow {
	background-color: #F7F7F7 !important;
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
	max-height: 88vh !important;
	overflow-y: scroll !important;
}

.writer-absolute {
	position: absolute;
	bottom: 0;
	width: 100%;
}

.scroll-smile {
	max-height: 200px;
	width: 255px;
	overflow-y: scroll;
	position: absolute;
	bottom: 70px;
	right: 25px;
}

.emoji {
	font-size: 22px;
	cursor: pointer;
}

button.bg-light:hover,
button.bg-light:focus {
	background-color: #f8f9fa !important;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity .3s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.mobile-menu {
	position: absolute;
	right: 0;
	z-index: 2;
}

.sidebar {
	height: 100%;
	width: 100%;
	position: fixed;
	z-index: 3;
	top: 0;
	left: 0;
	overflow-x: hidden;
	padding-top: 60px;
}

.sidebar-chat {
	width: 100vw;
}

.sidebar .closebtn {
	position: absolute;
	top: 0;
	right: 25px;
	font-size: 36px;
	margin-left: 50px;
}
</style>
