<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Relatórios Financeiros</h1>

    <!-- Relatório de Despesas por Categoria -->
    <section class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Despesas por Categoria</h2>
      <form @submit.prevent="fetchDespesasPorCategoria" class="flex items-center gap-2 mb-4">
        <input v-model="mes" type="number" min="1" max="12" placeholder="Mês" class="border p-2 rounded w-20" required />
        <input v-model="ano" type="number" placeholder="Ano" class="border p-2 rounded w-24" required />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
      </form>

      <table v-if="despesasPorCategoria.length" class="min-w-full bg-white mb-4">
        <thead>
          <tr>
            <th class="py-2">Categoria</th>
            <th class="py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="despesa in despesasPorCategoria" :key="despesa.categoria">
            <td class="border px-4 py-2">{{ despesa.categoria }}</td>
            <td class="border px-4 py-2">R$ {{ isNaN(Number(despesa.total)) ? "0.00" : Number(despesa.total).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Gráfico de Pizza para Despesas por Categoria -->
			 <div class=" flex justify-center items-center  ">
				<PizzaChart v-if="despesasPorCategoria.length" :labels="despesasLabels" :dataValues="despesasValues" />
			 </div>
      
    </section>

    <!-- Relatório de Saldo de Contas -->
    <section class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Saldo de Contas</h2>
      <form @submit.prevent="fetchSaldoContas" class="flex items-center gap-2 mb-4">
        <input v-model="mes" type="number" min="1" max="12" placeholder="Mês" class="border p-2 rounded w-20" required />
        <input v-model="ano" type="number" placeholder="Ano" class="border p-2 rounded w-24" required />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
      </form>
      <div v-if="saldoContas" class="bg-gray-100 p-4 rounded">
        <p><strong>Total Receitas:</strong> R$ {{ saldoContas.total_receitas ? Number(saldoContas.total_receitas).toFixed(2) : "0.00" }}</p>
        <p><strong>Total Despesas:</strong> R$ {{ saldoContas.total_despesas ? Number(saldoContas.total_despesas).toFixed(2) : "0.00" }}</p>
        <p><strong>Saldo:</strong> R$ {{ saldoContas.total_receitas && saldoContas.total_despesas ? (Number(saldoContas.total_receitas) - Number(saldoContas.total_despesas)).toFixed(2) : "0.00" }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue';
import PizzaChart from './pizzaChart.vue';

export default {
  name: 'Relatorios',
  components: {
    PizzaChart,
  },
  props: {
    token: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const mes = ref('');
    const ano = ref('');
    const despesasPorCategoria = ref([]);
    const saldoContas = ref(null);

    const despesasLabels = ref([]);
    const despesasValues = ref([]);

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${props.token}`,
    };

    const fetchDespesasPorCategoria = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/relatorio.php?action=despesasPorCategoria&mes=${mes.value}&ano=${ano.value}`,
          { headers }
        );
        const data = await response.json();
        despesasPorCategoria.value = data.data;

        // Extrai labels e valores para o gráfico de pizza
        despesasLabels.value = despesasPorCategoria.value.map((item) => item.categoria);
        despesasValues.value = despesasPorCategoria.value.map((item) => Number(item.total));
      } catch (error) {
        console.error('Erro ao buscar despesas por categoria:', error);
      }
    };

    const fetchSaldoContas = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/relatorio.php?action=saldoContas&mes=${mes.value}&ano=${ano.value}`,
          { headers }
        );
        const data = await response.json();
        saldoContas.value = data.data;
      } catch (error) {
        console.error('Erro ao buscar saldo de contas:', error);
      }
    };

    return {
      mes,
      ano,
      despesasPorCategoria,
      saldoContas,
      fetchDespesasPorCategoria,
      fetchSaldoContas,
      despesasLabels,
      despesasValues,
    };
  },
};
</script>
