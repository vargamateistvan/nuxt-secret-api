<template>
  <div class="container">
    <div>
      <h1 class="title">
        Secrets
      </h1>
      Secret:
      <input v-model="secretText" type="text">
      Expire after view
      <input v-model="expireAfterViews" type="number" min="1">
      Expire after
      <input v-model="expireAfter" type="number" min="0">
      <button @click="createSecret">
        Create Secret
      </button>
        <div
          v-for="(currentSecret, index) in secrets"
          :key="index"
          class="secret"
        >
        <span>Hash: {{currentSecret.hash}}</span>
        <span>Expire at: {{currentSecret.expiresAt > 0 ? new Date(currentSecret.expiresAt) : 'No time limit'}}</span>
        <span>Remaing view: {{currentSecret.remainingViews}}</span>
          <button @click="getSecret(currentSecret.hash)">
            Check Secret
          </button>
        </div>
    </div>
  </div>
</template>

<script>
import { get, post } from '../utils/request'

export default {
  data: () => {
    return {
      secretText: '',
      expireAfterViews: 1,
      expireAfter: 0,
      secrets: []
    }
  },
  created() {
    this.getAllSecret()
  },
  methods: {
    async createSecret () {
      const request = {
        secretText: this.secretText,
        expireAfterViews: this.expireAfterViews,
        expireAfter: this.expireAfter
      }
      await post('http://localhost:3000/api/secret', request)
      this.getAllSecret()
    },
    async getSecret (hash) {
      await get(`http://localhost:3000/api/secret/${hash}`)
      this.getAllSecret()

    },
    async getAllSecret () {
      this.secrets = await get('http://localhost:3000/api/secrets')
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
