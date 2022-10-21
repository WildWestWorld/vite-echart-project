<template>
  <div>
    <div class="header">
      <h1>可视化</h1>
    </div>
    <div class="content">
      <div class="left-statistics-container">
        <div class="statistics-wrapper">
          <h2>图表</h2>
          <div class="chart" id="oneChart">图表容器</div>
        </div>
        <div class="statistics-wrapper">
          <h2>图表</h2>
          <div class="chart" id="threeChart">图表容器</div>
        </div>
      </div>
      <div class="middle-container">
        地图展示
        <div class="map-container" id="map"></div>
      </div>
      <div class="right-statistics-container">
        <div class="statistics-wrapper">
          <h2>图表</h2>
          <div class="chart" id="twoChart">图表容器</div>
        </div>
        <div class="statistics-wrapper">
          <h2>图表</h2>
          <div class="chart">图表容器</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted, reactive, ref } from 'vue';
import axiosLocal from 'axios';
//inject(你之前provider起得名字)
let echartsApp = inject('echarts');
let axiosRequest = inject('axios');

let chartOneData = ref({});
let xdata = ref([]);
let ydata = ref([]);

let chartThreeData = ref({});

let chartTwoData = ref({});

// console.log(echartsApp);
// console.log(axios);
const request = axiosRequest.create({
  baseURL: '/api', // 注意！！ 这里是全局统一加上了 '/api' 前缀，也就是说所有接口都会加上'/api'前缀在，页面里面写接口的时候就不要加 '/api'了，否则会出现2个'/api'，类似 '/api/api/user'这样的报错，切记！！！
  timeout: 5000,
});

// 请求图表一中的数据
async function fetchData() {
  chartOneData = await request.get('/one/data');
  console.log(chartOneData);
  console.log(chartOneData.data.chartData);
}

// 图表一的请求后获取的数据 进行数据格式化
function setData() {
  xdata = chartOneData.data.chartData.chartData.map((item) => {
    return item.title;
  });
  ydata = chartOneData.data.chartData.chartData.map((item) => {
    return item.num;
  });
  console.log('xdata', xdata);
  console.log('ydata', ydata);
}

//图表三请求后获取的数据
async function fetchDataChartThree() {
  chartThreeData = await request.get('/three/data');
}

//图表二请求后获取的数据
async function fetchDataChartTwo() {
  chartTwoData = await request.get('/two/data');
}

// 中国地图的请求后获取的数据
async function getMapData() {
  let mapData = await axiosLocal.get('http://127.0.0.1:5173/map/china.json');
  return mapData;
}

onMounted(() => {
  //图表二
  fetchDataChartTwo().then(() => {
    console.log(chartTwoData, '折线');

    let myChartTwo = echartsApp.init(document.getElementById('twoChart'));

    myChartTwo.setOption({
      // 设置提示框
      tooltip: {
        trigger: 'axis',
      },
      //   设置选中时的准心
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#e6b600',
        },
      },
      //设置图例
      legend: {
        data: ['服饰', '数码', '家电', '家居', '日化'],
      },
      //   设置图表的位置
      grid: {
        left: '1%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        // 让折线与图标两边没有间隙
        boundaryGap: false,
        data: chartTwoData.data.chartData.chartData.day,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '服饰',
          // 让折线图之间的连线更平滑
          smooth: true,
          //   关闭关键点的实现
          showSymbol: false,
          //   开启数据堆叠,并且起个数据堆叠的名字
          stack: 'Total',
          //   折线图线段的设置，我们的设置的目的 是隐藏掉线段
          lineStyle: {
            width: 0,
          },
          //强调，用于选中高亮
          emphasis: {
            focus: 'series',
          },

          //   堆叠样式设置
          areaStyle: {
            opacity: 0.8,
            color: new echartsApp.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(0, 221, 255)',
              },
              {
                offset: 1,
                color: 'rgb(77, 119, 255)',
              },
            ]),
          },

          type: 'line',
          data: chartTwoData.data.chartData.chartData.num.Clothes,
        },
        {
          name: '数码',
          // 让折线图之间的连线更平滑
          smooth: true,
          type: 'line',

          data: chartTwoData.data.chartData.chartData.num.digit,
        },
        {
          name: '电子',
          // 让折线图之间的连线更平滑
          smooth: true,
          type: 'line',
          data: chartTwoData.data.chartData.chartData.num.Electrical,
        },
        {
          name: '家居',
          // 让折线图之间的连线更平滑
          smooth: true,
          type: 'line',
          data: chartTwoData.data.chartData.chartData.num.gear,
        },
        {
          name: '日化',
          // 让折线图之间的连线更平滑
          smooth: true,
          type: 'line',
          data: chartTwoData.data.chartData.chartData.num.Chemicals,
        },
      ],
    });
  });
  //图表三（饼状图）
  fetchDataChartThree().then(() => {
    console.log('饼状图', chartThreeData);
    let myChartThree = echartsApp.init(document.getElementById('threeChart'));
    myChartThree.setOption({
      // 设置图例
      legend: {
        top: 'bottom',
      },
      //   设置提示框
      tooltip: {
        show: true,
      },
      series: [
        {
          type: 'pie',
          data: chartThreeData.data.chartData.chartData,
          //   设置内外半径
          radius: [10, 100],
          //   center: ['50%', '45%'],
          roseType: 'area',
          // 设置圆角
          itemStyle: {
            borderRadius: 5,
          },
        },
      ],
    });
  });

  //中国地图
  getMapData().then((res) => {
    console.log('map', res);
    // 设置中国地图
    echartsApp.registerMap('china', res.data);
    let myMapChart = echartsApp.init(document.getElementById('map'));
    // 将echart设置成地图类型
    myMapChart.setOption({
      geo: {
        map: 'china',
        ////  设置地图样式
        itemStyle: {
          // 地图区域的样式
          areaColor: '#0099ff',
          //地图区域边界的样式
          borderColor: '#00ffff',
          //阴影的样式(单没啥变化，得再增加阴影模糊度配合使用)
          shadowColor: 'rgba(230,130,70,0.5)',
          //增加阴影的模糊度
          shadowBlur: 30,

          // 强调，意味着我们选中时他会更换我们设置强调的效果
          emphasis: {
            // 强调，意味着移入时，画面就基本只剩我们鼠标移入选中的区域
            focus: 'self',
          },
        },
      },
      //// 在中国地图的基础上添加散点图
      //   提示框
      tooltip: {
        // 选择触发方式
        trigger: 'item',
      },
      //    设置一下标题
      title: {
        text: 'china',
        left: '45%',
        textStyle: {
          color: '#fff',
          fontSize: 20,
          textShadowBlur: 10,
          textSHadowColor: '#33ffff',
        },
      },
      //   视觉映射
      //    开启了一个筛选器,排序是根据的value来的
      visualMap: {
        // 设置为连续类型
        type: 'continuous',
        // 必须设置的属性，最大值最小值
        min: 100,
        max: 10000,
        // 开启滑动效果
        calculable: true,
        inRange: {
          color: ['#50a3ba', '#eac736', '#d94e5d'],
        },
        textStyle: {
          color: '#fff',
        },
      },
      series: [
        {
          type: 'scatter',
          itemStyle: {
            color: 'red',
          },
          //   指定坐标系
          coordinateSystem: 'geo',
          //   此时的data还是地理坐标，而并未坐标系，所以我们得用coordinateSystem 指定一个坐标系
          data: [
            { name: '北京', value: [116.46, 39.92, 4367] },
            { name: '上海', value: [121.48, 31.22, 8675] },
            { name: '深圳', value: [114.07, 22.62, 2461] },
            { name: '广州', value: [113.23, 23.16, 187] },
            { name: '西安', value: [108.45, 34, 3421] },
          ],
        },
      ],
    });
  });

  // 调用请求
  fetchData().then(() => {
    setData();
    let myChart = echartsApp.init(document.getElementById('oneChart'));

    myChart.setOption({
      // 设置图表所在的位置
      grid: {
        top: '3%',
        left: '1%',
        right: '6%',
        bottom: '3%',

        //containLabel 包含坐标轴的文字，不设置会看不见文字
        containLabel: true,
      },

      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: xdata,
      },
      series: [
        {
          data: ydata,
          type: 'bar',
          itemStyle: {
            normal: {
              // 设置圆角
              barBorderRadius: [0, 20, 20, 0],

              // 设置item的颜色
              color: new echartsApp.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#005eaa',
                },
                {
                  offset: 0.5,
                  color: '#339ca8',
                },
                {
                  offset: 1,
                  color: '#cda819',
                },
              ]),
            },
          },
        },
      ],
    });
  });
});
</script>

<style lang="scss" scoped>
.header {
  height: 1rem;
  width: 100%;
  background-color: rgba(0, 0, 255, 0.2);
  //标题的文字样式
  h1 {
    font-size: 0.375rem;
    color: #fff;
    text-align: center;
    line-height: 1rem;
  }
}
.content {
  position: relative;
  display: flex;

  // 设置最大宽度和最小宽度 使用px作为单位 不需要响应式
  min-width: 1200px;
  max-width: 2048px;

  margin: 0 auto;
  border: 1px solid red;
  padding: 0.125rem 0.125rem 0 0;
  //   background-color: gray;
  .left-statistics-container {
    // 设置伸缩的份数
    flex: 3;
    .statistics-wrapper {
      height: 5.125rem;
      border: 1px solid blue;
      margin: 0.25rem;
      background-color: rgba(12, 130, 255, 0.85);
      .chart {
        height: 4.5rem;
      }
      h2 {
        height: 0.6rem;
        color: '#fff';
        line-height: 0.6rem;
        font-size: 0.25rem;
        text-align: center;
      }
    }
  }
  .middle-container {
    height: 10.5rem;
    border: 1px solid blue;
    flex: 5;
    padding: 0.125rem;
    margin: 0.25rem;
    .map-container {
      width: 100%;
      height: 100%;
    }
  }
  .right-statistics-container {
    flex: 3;
    .statistics-wrapper {
      height: 5.125rem;
      border: 1px solid blue;
      margin: 0.25rem;
      background-color: rgba(12, 130, 255, 0.85);

      .chart {
        height: 4.5rem;
      }
      h2 {
        height: 0.6rem;
        color: '#fff';
        line-height: 0.6rem;
        font-size: 0.25rem;
        text-align: center;
      }
    }
  }
}
</style>
