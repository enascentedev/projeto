<template>
  <div class="chart-container">
    <apexchart type="pie" :options="chartOptions" :series="series" />
  </div>
</template>

<script>
export default {
  name: 'PizzaChart',
  props: {
    labels: {
      type: Array,
      required: true,
    },
    dataValues: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      series: this.dataValues,
      chartOptions: {
        chart: {
          toolbar: {
            show: true, 
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
            },
            export: {
              csv: false,
              svg: true,
              png: true,
            },
          },
        },
        labels: this.labels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 300,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
    };
  },
};
</script>

<style scoped>
.chart-container {
  width: 500px; 
  height: 400px;
  max-width: 100%;
  margin: 0 auto;
}
</style>
