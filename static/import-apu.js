'use strict';
(() => {
  var data = [];
  var COLUMNS = ['type', 'description', 'unit', 'cost', 'qop'];
  function spanEmpty(s) {
    return s.append('span')
      .text(d => d.value ? d.value.toString().trim() : '-')
      .on('click', d => {
        var e = d3.event;
        e.target.hidden = true;
        e.target.nextElementSibling.hidden = false;
      });
  }
  function formAndInput(span, s) {
    return s.append('form')
      .attr('hidden', true)
      .on('submit', d => {
        var e = d3.event;
        e.preventDefault();

        d.value = new FormData(e.target).toJSON().value;
        d.original[d.key] = d.value;
        span.text(d =>  d.value);

        e.target.hidden = true;
        e.target.previousElementSibling.hidden = false;
      })
      .append('input')
      .attr('name', 'value')
      .attr('value', d => d.value);
  }
  var createRedactCell = {
    type: s => formAndInput(spanEmpty(s), s).attr('list', 'Supplies_type'),
    description: s => formAndInput(spanEmpty(s), s),
    unit: s => formAndInput(spanEmpty(s), s),
    cost: s => formAndInput(spanEmpty(s), s),
    qop: s => formAndInput(spanEmpty(s), s)
  };
  document.querySelector('#import-apu-close').addEventListener('click', e => {
    e.target.parentElement.style.display = 'none';
  });
  function renderRow(selection) {
    var cols = selection.selectAll('td.col')
      .data((d, i) => Object.keys(d).map(c => ({
        key: c,
        value: d[c],
        original: d,
        i: i
      })));
    cols.select('span').text(d => d.value);
    cols.select('input').attr('value', d => d.value);
    cols.enter().append('td')
      .classed('col', true)
      .each(function(d) {
        createRedactCell[d.key](d3.select(this));
      });
    cols.exit().remove();
  }

  document.querySelector('#import-apu-form').addEventListener('submit', e => {
    e.preventDefault();
    data.map(d => COLUMNS.reduce((acc, key) => {
      acc[key] = (key === 'cost' || key === 'qop') ? Number(d[key]) : d[key];
      return acc;
    }, { APUId: document
      .querySelector('#import-apu-form input[name="APU"]')
      .value
    })).map(d => ({
      query: 'insert',
      module: 'importAPUSupplies',
      from: 'importAPUSupplies',
      row: d
    })).forEach(event => {
      client.emit('data', event);
    });
    document.querySelector('#import-apu').style.display = 'none';
    document.querySelector('#paste-apu tbody').innerHTML = '';
    data.length = 0;
  });
  document.addEventListener('paste', e => {
    data.push(...e.clipboardData.getData('text')
      .split(/[\n\r]/).filter(d => d !== '')
      .map(d => d.split(/[\t]/).reduce((acc, d, i) => {
        acc[COLUMNS[i] ? COLUMNS[i] : `xtra${i}`] = d;
        return acc;
      }, {})));
    var rows = d3.select('table#paste-apu tbody').selectAll('tr.row').data(data);
    rows.call(renderRow);
    rows.enter().append('tr')
      .classed('row', true)
      .call(renderRow);
    rows.exit().remove();
  });
})();
