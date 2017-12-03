import * as d3 from 'd3';
import { bb } from 'billboard.js';
import _ from 'lodash';
import { setTimeout } from 'timers';
import meta from './public/data/meta.csv';
import daily from './public/data/daily.csv';
import weekly from './public/data/weekly.csv';
import top10 from './public/data/10-top.csv';

let loadDataFrom = function (filename, row, callback) {
  let content;
  if (filename === 'meta.csv') {
    content = meta;
  } else if (filename === 'daily.csv') {
    content = daily;
  } else if (filename === 'weekly.csv') {
    content = weekly;
  } else if (filename === '10-top.csv') {
    content = top10;
  }
  return callback(d3.csvParse(content, row));
};
let buildUserPageUrl = function(prefix, username) {
  return `${prefix}/wiki/User:${username}`
}

let buildSelections = function(meta) {
  d3.select('#campaign-choice')
    .selectAll("option")
    .data(meta)
    .enter()
    .append("option")
    .attr('value', d => d.editathonCode)
    .attr('class', 'dropdown-item')
    .text(d => d.editathonDescription);
}

let buildTop10ChartForCampaign = function (data, campaign, meta) {
  let m = meta[campaign];
  data = data[m.editathonCode];
  let failedIdxStart = _.findIndex(data, i => i['Submitted'] < 4);
  let chart = bb.generate({
    data: {
      json: data,
      type: 'bar',
      keys: {
        x: 'username',
        value: ['Submitted']
      },
      onclick: (d, element) => {
        window.open(buildUserPageUrl(m.url, data[d.x].username))
      }
    },
    axis: {
      x: {
        type: 'category'
      },
      y: {
        tick: {
          format: d3.format('d')
        },
        label: {
          text: 'articles',
          position: 'outer-middle'
        }
      }
    },
    grid: {
      y: {
        lines: [{
          text: 'Average',
          value: m.articleCount / m.userCount,
          position: 'end'
        }]
      }
    },
    legend: {
      show: false
    },
    title: {
      text: `${m.editathonDescription} statistics`
    },
    regions: [{
      axis: "x",
      end: 0.5,
      class: "ambassador"
    }],
    bindto: '#top-10-campaign'
  });
  if (failedIdxStart !== undefined && failedIdxStart > 0) {
    chart.regions.add({
      axis: "x",
      start: failedIdxStart - 0.5,
      class: "ineligible"
    });
  }
  return chart;
};

let buildDailyChartForCampaign = function (data, campaign, meta) {
  let m = meta[campaign];
  let aggreatedTotal = _.map(_.groupBy(data, d => d['Date Added']), (d) => {
    return _.reduce(d, (sum, g) => {
        return sum + g['Submitted'];
      }, 0);
  });
  data = _.groupBy(data, i => i.code);
  data = data[m.editathonCode];
  let leftOutDate = _.difference(_.range(1, 31), _.map(data, i => _.parseInt(i['Date Added'].split('-')[2])));
  _.each(leftOutDate, (l) => {
    data.push({
      'Date Added': `2017-11-${_.padStart(l, 2, '0')}`,
      'Submitted': 0
    });
  });
  data = _.sortBy(data, i => i['Date Added']);
  let idx = 0;
  _.each(data, (i) => {
    i['Total Submitted'] = aggreatedTotal[idx++];
  });
  let chart = bb.generate({
    data: {
      json: data,
      type: 'spline',
      keys: {
        x: 'Date Added',
        value: ['Submitted', 'Total Submitted']
      }
    },
    axis: {
      x: {
        type: 'timeseries'
      },
      y: {
        min: 0,
        tick: {
          format: d3.format('d')
        },
        padding: {
          bottom: 0
        }
      }
    },
    title: {
      text: `${m.editathonDescription} articles submitted by day`
    },
    bindto: '#daily-campaign'
  });
  setTimeout(() => {
    d3.select('#daily-campaign .bb-legend-item-Total-Submitted').dispatch('click');
  }, 2000);
  return chart;
};

let buildWeeklyChartForCampaign = function (data, campaign, meta) {
  let m = meta[campaign];
  let idx = 0;
  let aggreatedTotal = _.map(_.groupBy(data, d => d['Week Added']), (d) => {
    return [`Week ${++idx}`, _.reduce(d, (sum, g) => {
        return sum + g['Submitted'];
      }, 0)];
  });
  data = _.groupBy(data, i => i.code);
  data = data[m.editathonCode];
  _.each(data, (i) => {
    i['Total Submitted'] = aggreatedTotal[idx++];
  });
  let chart = bb.generate({
    data: {
      columns: aggreatedTotal,
      type: 'pie'
    },
    pie: {
      label: {
        format: (value, ratio, id) => {
          return value;
        }
      }
    },
    title: {
      text: 'Wikipedia Asian Month 2017 articles submitted by week'
    },
    bindto: '#weekly-campaign'
  });
  return chart;
};

loadDataFrom('meta.csv', (d) => {
  return {
    userCount: d.user_count,
    articleCount: d.article_count,
    editathonCode: d.editathon_code,
    editathonDescription: d.editathon_description,
    url: d.url
  };
}, (meta) => {
  buildSelections(meta);
  let sel = document.getElementById('campaign-choice');
  sel.value = 'asian-month-2017-en';
  meta = _.keyBy(meta, i => i.editathonCode);

  loadDataFrom(
    '10-top.csv',
    (d) => {
      return {
        rank: +d.rank_number,
        username: d.user,
        'Submitted': +d.article_count,
        code: d.code,
        description: d.description,
        lastSubmittedAt: d.last_submitted_date
      };
    },
    (d) => {
      let data = _.groupBy(d, i => i.code);
      sel.addEventListener("change", () => {
        buildTop10ChartForCampaign(data, sel.value, meta);
      });
      buildTop10ChartForCampaign(data, sel.value, meta);
    });

  loadDataFrom(
    'daily.csv',
    (d) => {
      return {
        'Submitted': +d.count,
        'Date Added': d.date_added,
        code: d.code,
        description: d.description
      };
    },
    (d) => {
      sel.addEventListener("change", () => {
        buildDailyChartForCampaign(d, sel.value, meta);
      });
      buildDailyChartForCampaign(d, sel.value, meta);
    });

  loadDataFrom(
    'weekly.csv',
    (d) => {
      return {
        'Submitted': +d.count,
        'Week Added': d.week_added,
        code: d.code,
        description: d.description
      };
    },
    (d) => {
      sel.addEventListener("change", () => {
        buildWeeklyChartForCampaign(d, sel.value, meta);
      });
      buildWeeklyChartForCampaign(d, sel.value, meta);
    });
});
