import * as d3 from 'd3';
import { bb } from 'billboard.js';
import _ from 'lodash';

let loadDataFrom = function (filename, row, callback) {
  return d3.csv(`data/${filename}`, row, callback);
};
let buildUserPageUrl = function(prefix, username) {
  return `${prefix}/wiki/User:${username}`
}
loadDataFrom('meta.csv', (d) => {
  return {
    userCount: d.user_count,
    articleCount: d.article_count,
    editathonCode: d.editathon_code,
    editathonDescription: d.editathon_description,
    url: d.url
  };
}, (meta) => {
  loadDataFrom(
      '10-top.csv',
      (d) => {
        return {
          rank: +d.rank_number,
          username: d.user,
          'Submitted Article': +d.article_count,
          code: d.code,
          description: d.description,
          lastSubmittedAt: d.last_submitted_date
        };
      },
      (d) => {
        let data = _.groupBy(d, i => i.code);
        buildSelections(meta);
        meta = _.keyBy(meta, i => i.editathonCode);

        let sel = document.getElementById('campaign-choice');
        sel.value = 'asian-month-2017-en';
        sel.addEventListener("change", () => {
          buildTop10ChartForCampaign(data, sel.value, meta);
        });
        buildTop10ChartForCampaign(data, sel.value, meta);
      });
});

let buildSelections = function(meta) {
  d3.select('#campaign-choice')
    .selectAll("option")
    .data(meta)
    .enter()
    .append("option")
    .attr('value', d => d.editathonCode)
    .text(d => d.editathonDescription);
}

let buildTop10ChartForCampaign = function (data, campaign, meta) {
  let m = meta[campaign];
  data = data[m.editathonCode];
  let failedIdxStart = _.findIndex(data, i => i['Submitted Article'] < 4);
  let chart = bb.generate({
    data: {
      json: data,
      type: 'bar',
      keys: {
        x: 'username',
        value: ['Submitted Article']
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
