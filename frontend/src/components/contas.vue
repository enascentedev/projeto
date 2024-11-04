<template>
  <div class="h-screen flex flex-col gap-5 p-5 md:p-10 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
    <h1 class="text-3xl font-extrabold mb-6 tracking-wide">Transações de Contas</h1>

    <button
      @click="abrirFormulario('adicionar')"
      class="bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl"
    >
      + Adicionar Nova Transação
    </button>

    <button
      @click="navegarParaRelatorios"
      class="bg-green-500 hover:bg-green-600 transition duration-300 ease-in-out text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl"
    >
      + Gerar relatórios
    </button>

    <!-- Modal -->
    <div v-if="exibirModal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 class="text-2xl font-bold mb-4">{{ modoFormulario === 'adicionar' ? 'Adicionar Nova Transação' : 'Editar Transação' }}</h2>

        <form @submit.prevent="submitFormulario">
          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Tipo de Transação:</label>
            <select v-model="formulario.tipo" class="select select-bordered w-full bg-gray-700 text-white" required>
              <option disabled selected>Escolha o tipo</option>
              <option value="Pagar">Conta a Pagar</option>
              <option value="Receber">Conta a Receber</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Descrição:</label>
            <input v-model="formulario.descricao" class="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400" placeholder="Descrição da transação" required />
          </div>

          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Valor:</label>
            <input
              v-model="formulario.valor"
              @input="formatarValor"
              type="text"
              class="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400"
              placeholder="Valor (ex: 0,00)"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Data:</label>
            <input v-model="formulario.data" type="date" class="w-full p-3 rounded bg-gray-700 text-white" required />
          </div>

          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Categoria:</label>
            <input v-model="formulario.categoria" class="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400" placeholder="Categoria" required />
          </div>

          <div class="mb-4">
            <label class="block text-gray-300 mb-2">Status:</label>
            <select v-model="formulario.status" class="w-full p-3 rounded bg-gray-700 text-white" required>
              <option value="pendente">Pendente</option>
              <option value="pago">Pago</option>
              <option value="recebido">Recebido</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="fecharModal" class="bg-red-500 hover:bg-red-600 transition duration-300 ease-in-out text-white px-4 py-2 rounded-lg font-semibold">
              Cancelar
            </button>
            <button type="submit" class="bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out text-white px-4 py-2 rounded-lg font-semibold">
              {{ modoFormulario === 'adicionar' ? 'Salvar' : 'Atualizar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Transacoes',
  props: {
    token: String,
  },
  setup(props) {
    const router = useRouter();
    const transacoes = ref([]);
    const exibirModal = ref(false);
    const modoFormulario = ref('adicionar');
    const formulario = ref({
      id: null,
      tipo: 'Pagar',
      descricao: '',
      valor: '0,00', // Valor inicial com formato de moeda
      data: '',
      categoria: '',
      status: 'pendente',
    });

    const formatarValor = () => {
      let valor = formulario.value.valor.replace(/\D/g, ''); // Remove qualquer caractere que não seja número
      valor = (parseInt(valor) / 100).toFixed(2); // Converte para decimal com duas casas
      formulario.value.valor = valor.replace('.', ','); // Substitui ponto por vírgula
    };

    onMounted(() => {
      carregarTransacoes();
    });

    const carregarTransacoes = async () => {
      try {
        const responsePagar = await fetch('http://localhost:8000/conta/pagar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${props.token}`,
          },
        });
        const contasPagar = await responsePagar.json();
        contasPagar.forEach((conta) => {
          conta.tipo = 'Pagar';
        });

        const responseReceber = await fetch('http://localhost:8000/conta/receber', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${props.token}`,
          },
        });
        const contasReceber = await responseReceber.json();
        contasReceber.forEach((conta) => {
          conta.tipo = 'Receber';
        });

        transacoes.value = [...contasPagar, ...contasReceber];
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
      }
    };

    const abrirFormulario = (modo, transacao = null) => {
      modoFormulario.value = modo;
      if (modo === 'editar' && transacao) {
        formulario.value = { ...transacao };
      } else {
        formulario.value = {
          id: null,
          tipo: 'Pagar',
          descricao: '',
          valor: '0,00',
          data: '',
          categoria: '',
          status: 'pendente',
        };
      }
      exibirModal.value = true;
    };

    const fecharModal = () => {
      exibirModal.value = false;
    };

    const submitFormulario = async () => {
      const transacao = { ...formulario.value };
      try {
        const endpoint = transacao.tipo === 'Pagar' ? 'conta/pagar' : 'conta/receber';
        const url = `http://localhost:8000/${endpoint}`;

        const payload = {
          descricao: transacao.descricao,
          valor: parseFloat(transacao.valor.replace(',', '.')),
          ...(transacao.tipo === 'Pagar' ? { data_vencimento: transacao.data } : { data_recebimento: transacao.data }),
          categoria: transacao.categoria,
          status: transacao.status,
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${props.token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (data.message) {
          alert(data.message);
        }

        if (modoFormulario.value === 'adicionar') {
          data.tipo = transacao.tipo;
          transacoes.value.push(data);
        } else {
          const index = transacoes.value.findIndex((t) => t.id === transacao.id);
          if (index !== -1) {
            transacoes.value.splice(index, 1, transacao);
          }
        }

        fecharModal();
      } catch (error) {
        console.error('Erro ao salvar a transação:', error);
        alert('Erro ao salvar a transação. Por favor, tente novamente.');
      }
    };

    const editarTransacao = (transacao) => {
      abrirFormulario('editar', transacao);
    };

    const excluirTransacao = async (transacao) => {
      if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;
      try {
        const endpoint = transacao.tipo === 'Pagar' ? 'conta/pagar' : 'conta/receber';
        const url = `http://localhost:8000/${endpoint}/${transacao.id}`;

        await fetch(url, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
        });

        transacoes.value = transacoes.value.filter((t) => t.id !== transacao.id);
      } catch (error) {
        console.error('Erro ao excluir a transação:', error);
      }
    };

    const navegarParaRelatorios = () => {
      router.push('/relatorios');
    };

    return {
      transacoes,
      exibirModal,
      modoFormulario,
      formulario,
      formatarValor,
      abrirFormulario,
      fecharModal,
      submitFormulario,
      editarTransacao,
      excluirTransacao,
      navegarParaRelatorios,
    };
  },
};
</script>
