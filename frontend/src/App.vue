<template>
  <div>
    <button @click="requestNotificationPermission">Click to request Notification Permission</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notification: null,
      interval: null,
      leaveDate: null,
    };
  },
  methods: {
    // Request permission to show notifications
    requestNotificationPermission() {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          this.showNotification();
        } else {
          alert("Notification permission denied");
        }
      });
    },

    // Show a sample notification
    showNotification() {
      if (Notification.permission === "granted") {
        const notification = new Notification("Example Notification", {
          body: "This is more text",
          data: { hello: "world" },
          icon: "./logo.png",
        });

        notification.addEventListener("error", (e) => {
          alert("Error showing notification: " + e.message);
        });
      } else {
        alert("Notification permission not granted.");
      }
    },

    // Track visibility changes and show a notification after being away
    trackVisibility() {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          this.leaveDate = new Date();
          this.interval = setInterval(() => {
            const secondsAway = Math.round((new Date() - this.leaveDate) / 1000);
            this.notification = new Notification("Come back soon", {
              body: `Good Luck! You've been away for ${secondsAway} seconds.`,
              tag: "back soon",
              icon: "./logo.png",
            });
          }, 1000); // Update every second
        } else {
          if (this.interval) clearInterval(this.interval);
          if (this.notification) this.notification.close();
        }
      });
    },
  },
  mounted() {
    this.trackVisibility(); // Start tracking visibility when the app mounts
  },
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
