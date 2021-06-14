<template>
  <div class="container">
    <div>
      <h1 class="title">
        Secrets
      </h1>
      Secret:
      <input v-model="secret" type="text">
      Expire after view
      <input v-model="expireAfterViews" type="number">
      Expire after
      <input v-model="expireAfter" type="number">
      <button @click="createSecret">
        Create Secret
      </button>
      <ul class="users">
        <li
          v-for="(currentSecret, index) in secrets"
          :key="index"
          class="secret"
        >
          {{
            "hash: " +
              currentSecret.hash +
              " epiresAt: " +
              currentSecret.expiresAt +
              " remainingViews: " +
              currentSecret.remainingViews
          }}
          <button @click="getSecret(currentSecret.hash)">
            Check Secret
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { get, post } from '../utils/request'

export default {
  data: () => {
    return {
      secret: '',
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
        secret: this.secret,
        expireAfterViews: this.expireAfterViews,
        expireAfter: this.expireAfter
      }
      await post('/api/secret', request)
      this.getAllSecret()
    },
    async getSecret (hash) {
      await get(`/api/secret/${hash}`)
      this.getAllSecret()

    },
    async getAllSecret () {
      this.secrets = await get('/api/secrets')
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  /* min-height: 100vh; */
  display: flex;
  justify-content: center;
  align-items: center;
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
