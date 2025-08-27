// import Pusher from 'pusher-js/react-native';

let pusher = null;
let channel = null;

export const initPusher = () => {
  // ✅ Only key and cluster required here
  pusher = new Pusher('be1f9fc2ae4e3399aa72', {
    cluster: 'ap2',
    encrypted: true,
  });

  channel = pusher.subscribe('quiz-join-count');
};

export const bindEvent = (eventName, callback) => {
  if (channel) {
    channel.bind(eventName, callback);
  }
};

export const disconnectPusher = () => {
  if (pusher && channel) {
    channel.unbind_all();
    pusher.unsubscribe('quiz-join-count');
    pusher.disconnect();
    pusher = null;
    channel = null;
  }
};
