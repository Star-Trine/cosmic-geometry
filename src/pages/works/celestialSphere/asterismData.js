// src/pages/works/celestialSphere/asterismData.js

export const asterisms = [
  // 夏の大三角
  {
    id: 'summer-triangle',
    name: 'Summer Triangle',
    nameJa: '夏の大三角',
    connections: [
      ['vega', 'deneb'],
      ['deneb', 'altair'],
      ['altair', 'vega'],
    ],
  },

  // 北斗七星
  {
    id: 'big-dipper',
    name: 'Big Dipper',
    nameJa: '北斗七星',
    connections: [
      // ひしゃくの器
      ['dubhe', 'merak'],
      ['merak', 'phecda'],
      ['phecda', 'megrez'],
      ['megrez', 'dubhe'],

      // ひしゃくの柄
      ['megrez', 'alioth'],
      ['alioth', 'mizar'],
      ['mizar', 'alkaid'],
    ],
  },

  // 南斗六星
  {
    id: 'southern-dipper',
    name: 'Southern Dipper',
    nameJa: '南斗六星',
    connections: [
      // 斗の部分
      ['ascella', 'tau-sagittarii'],
      ['tau-sagittarii', 'nunki'],
      ['nunki', 'phi-sagittarii'],
      ['phi-sagittarii', 'ascella'],

      // 柄にあたる部分
      ['phi-sagittarii', 'kaus-borealis'],
      ['kaus-borealis', 'polis'],
    ],
  },

  // 冬の大三角
  {
    id: 'winter-triangle',
    name: 'Winter Triangle',
    nameJa: '冬の大三角',
    connections: [
      ['betelgeuse', 'sirius'],
      ['sirius', 'procyon'],
      ['procyon', 'betelgeuse'],
    ],
  },

  // 冬のダイヤモンド
  {
    id: 'winter-diamond',
    name: 'Winter Hexagon',
    nameJa: '冬のダイヤモンド',
    connections: [
      ['rigel', 'sirius'],
      ['sirius', 'procyon'],
      ['procyon', 'pollux'],
      ['pollux', 'capella'],
      ['capella', 'aldebaran'],
      ['aldebaran', 'rigel'],
    ],
  },

  // オリオン座
  {
    id: 'orion',
    name: 'Orion',
    nameJa: 'オリオン座',
    connections: [
      // 肩
      ['betelgeuse', 'bellatrix'],

      // 左右の輪郭
      ['betelgeuse', 'alnitak'],
      ['alnitak', 'saiph'],
      ['bellatrix', 'mintaka'],
      ['mintaka', 'rigel'],

      // 三つ星
      ['alnitak', 'alnilam'],
      ['alnilam', 'mintaka'],

      // 足
      ['saiph', 'rigel'],
    ],
  },
];