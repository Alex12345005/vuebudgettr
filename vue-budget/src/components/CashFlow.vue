<template>
  <div class="container cash-flow">
    <div class="columns is-multiline">
      <div class="column is-1 is-offset-3">
        <div class="select">
          <select v-model="tag">
            <option>🏠 Wohnen</option>
            <option>⚽ Hobby/Freizeit</option>
            <option>🍽️ Leben/Essen</option>
            <option>🪙 Sonstiges</option>
          </select>
        </div>
      </div>

      <div class="column is-2">
        <div class="control has-icons-right">
          <input :class="['input has-text-centered',
            isFilledBalance && !isValidBalance ? 'has-text-danger is-danger' : null
          ]" type="text" placeholder="0,00" v-model="balance">
          <span class="icon is-small is-right">
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="column is-2">
        <div class="control">
          <div class="select">
            <select v-model="type">
              <option value="cost">Cost</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
      </div>

      <div class="column is-1">
        <div class="control has-text-left">
          <button class="button is-primary" :disabled="!isValidBalance" @click="addCashflow()">
            Add</button>
        </div>
      </div>

      <div class="column is-6 is-offset-3">
        <div class="columns">
          <div class="column is-8">
            <h4 class="title is-4">
              <span>Balance: {{ tag }} <span v-html="totalFlow" /></span>
            </h4>
          </div>
        </div>

        <transition name="fade-balance" :duration="150">
          <hr class="divide" v-if="cashFlowIsNotEmpty">
        </transition>
      </div>

      <transition name="fade-balance" :duration="150">
        <div class="column is-6 is-offset-3" v-if="cashFlowIsNotEmpty">
          <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <th class="has-text-centered">Amount</th>
              <th class="has-text-centered">Type</th>
              <th class="has-text-centered">Actions</th>
            </thead>
            <!-- <TableBody :cash-flow="cashFlow" :tagy="tag" :currencyFormat="getCurrencyFormat"
              :removeRow="removeRow"></TableBody> -->
          </table>
        </div>
      </transition>
    </div>

    <Notification v-if="saveNotification" message="Cash flow saved into local storage."
      :closeNotification="() => saveNotification = false" />

    <Notification v-if="flushNotification" type="danger" message="Local storage has been flushed!"
      :closeNotification="() => flushNotification = false" />
  </div>
</template>

<script>
import TableBody from "./TableBody.vue";
import Notification from "./Notification.vue";
import axios from 'axios';


export default {
  name: "CashFlow",
  components: {
    TableBody,
    Notification
  },

  data() {
    return {
      type: "income",
      balance: "",
      tag: '⚽',
      totalBalance: 0.0,
      cashFlow: [],
      saveNotification: false,
      flushNotification: false,
    };
  },

  computed: {
    isValidBalance() {
      return /^(\d*([.,])?\d{1,2})$/.test(this.balance);
    },

    isFilledBalance() {
      return !!this.balance;
    },

    cashFlowIsNotEmpty() {
      return this.cashFlow.length > 0;
    },

    getTagyFormat() {
      return {
        '🏠': 'Wohnen',
        '⚽': 'Hobby/Freizeit',
        '🍽️': 'Leben',
        '🪙': 'Rest',
      }[this.tag];
    },

    totalFlow() {
      let total = 0;

      this.cashFlow.map(({ type, amount }) => {
        total += type === 'cost' ? -amount : amount;
      });

      const className = total >= 0 ? "has-text-success" : "has-text-danger";

      return `<span class="${className}">ttt</span>`
    },
  },

  methods: {
    editBalance() {
      this.cashFlow.push({
        id: Date.now(),
        type: this.type,
        amount: parseFloat(this.balance.toString().replace(',', '.'))
      });

      this.balance = "";
    },

    removeRow(index) {
      this.cashFlow.splice(index, 1);
    },

    addCashflow() {
      console.log("Tag is ", this.tag)

      console.log("Amount is ", this.amount)

      console.log("Type is ", this.type)
      var absolute_amount = this.amount
      if (this.type == "cost") {
        absolute_amount = -absolute_amount
      }
      axios.post('/api/cashflow', {
        amount: absolute_amount,
        date: 
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    flushBalance() {
      localStorage.removeItem('vue-cash-flow-balance');

      this.cashFlow = [];
      this.saveNotification = false;
      this.flushNotification = true;
    },
  },
  mounted() {
    const savedBalance = localStorage.getItem('vue-cash-flow-balance');
  },
};
</script>

<style lang="scss" scoped>
.cash-flow {
  margin-top: 50px;
}

.divide {
  margin-top: 1.2rem;
  margin-bottom: 0.5rem;
}

.fade-balance {
  &-enter {
    opacity: 0;

    &-active {
      transition: opacity 1s;
    }
  }
}

.button {
  width: 100%;
}
</style>