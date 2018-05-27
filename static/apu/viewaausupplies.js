'use strict';
(() => {

  var SymId = Symbol();
  var lastSTO;
  var blocks = {};
  window.blocks = blocks;

  function dodelete(row) {
    var APU = blocks[row.APU_id];
    if (!APU) return;
    var found = blocks[row.APU_id].APUSupplies
      .find(d => d.APUSupplies_id == row.APUSupplies_id);
    if (found) {
      blocks[row.APU_id].APUSupplies
        .splice(blocks[row.APU_id].APUSupplies
          .findIndex(d => d.APUSupplies_id == row.APUSupplies_id), 1);
    } else {
      // ESTO AUN ESTA POR RESOLVERSE...
      delete blocks[row.APU_id];
    }

    if (lastSTO) {
      clearTimeout(lastSTO);
    }
    lastSTO = setTimeout(() => {
      render();
    }, 300);
  }

  function doinsert(row) {
    if (row.APU_id.indexOf(blocks[SymId]) == 0) {
      doselect(row);
    }
  }

  function doupdate(row) {
    var APU = blocks[row.APU_id];
    if (!APU) return;
    APU.APU_id = row.APU_id;
    APU.APU_qop = row.APU_qop;
    APU.APU_unit = row.APU_unit;
    APU.APU_cost = row.APU_cost;
    APU.APU_is_estimated = row.APU_is_estimated;
    APU.APU_description = row.APU_description;
    APU.APU_information = row.APU_information;

    var found;
    if (blocks[row.APU_id]) {
      found = blocks[row.APU_id].APUSupplies
        .find(d => d.APUSupplies_id == row.APUSupplies_id);

      if (found) {
        found.Supplies_cost = row.Supplies_cost;
        found.Supplies_description = row.Supplies_description;
        found.Supplies_type = row.Supplies_type;
        found.Supplies_unit = row.Supplies_unit;
        found.Supplies_id = row.Supplies_id;
        found.APUSupplies_qop = row.APUSupplies_qop;
        found.APUSupplies_id = row.APUSupplies_id;
        found.APUSupplies_APUId = row.APUSupplies_APUId;
        found.APUSupplies_SupplyId = row.APUSupplies_SupplyId;
      }
    }

    if (lastSTO) {
      clearTimeout(lastSTO);
    }
    lastSTO = setTimeout(() => {
      render();
    }, 300);
  }

  function doselect(row) {
    if (row.APU_expand) return;
    if (!blocks[row.APU_id]) {
      blocks[row.APU_id] = {
        APUSupplies: []
      };
    }
    var APU = blocks[row.APU_id];
    if (!APU.id) {
      APU.id = row.id;
    }
    APU.APU_id = row.APU_id;
    APU.APU_qop = row.APU_qop;
    APU.APU_unit = row.APU_unit;
    APU.APU_cost = row.APU_cost;
    APU.APU_is_estimated = row.APU_is_estimated;
    APU.APU_description = row.APU_description;
    APU.APU_information = row.APU_information;

    var APUSupply = {};
    APUSupply.id = row.id;
    APUSupply.APUSupplies_id = row.APUSupplies_id;
    APUSupply.APUSupplies_qop = row.APUSupplies_qop;
    APUSupply.APUSupplies_APUId = row.APUSupplies_APUId;
    APUSupply.APUSupplies_SupplyId = row.APUSupplies_SupplyId;

    APUSupply.Supplies_id = row.Supplies_id;
    APUSupply.Supplies_cost = row.Supplies_cost;
    APUSupply.Supplies_type = row.Supplies_type;
    APUSupply.Supplies_unit = row.Supplies_unit;
    APUSupply.Supplies_description = row.Supplies_description;

    APUSupply.APU = APU;
    if (APUSupply.APUSupplies_id) {
      APU.APUSupplies.push(APUSupply);
    }

    if (lastSTO) {
      clearTimeout(lastSTO);
    }
    lastSTO = setTimeout(() => {
      render();
    }, 300);
  }

  function setupEntry(idkey, key, module, query = 'update', row = null) {
  return function redact(selection) {
    selection.attr('column', key)
      .append('span').text(d => d[key] ? d[key].toString().trim() : '-')
      .on('click', () => {
        var e = d3.event;
        var span = e.target;
        var form = span.nextElementSibling;
        span.hidden = true;
        form.hidden = false;
      });

    var fr = selection.append('form')
      .attr('hidden', true)
      .on('submit', (d) => {
        var e = d3.event;
        e.preventDefault();
        var form = e.target;
        var fd = new FormData(form);
        var entry = fd.toJSON();

        if (query == 'update') {
          entry.value = [entry.value.toString().trim()];
          entry.key = [entry.key];
          entry.query = query;
          entry.module = module;

          client.emit('data', entry);
        } else if (query == 'insert') {
          row[entry.key] = entry.value;
          console.log('to create', entry, row);
        }

        var span = form.previousElementSibling;
        span.hidden = false;
        form.hidden = true;
      });

    fr.append('input')
      .attr('type', 'text')
      .attr('value', d => d[key])
      .attr('name', 'value');

    fr.append('input')
      .attr('type', 'hidden')
      .attr('value', key)
      .attr('name', 'key');

    fr.append('input')
      .attr('type', 'hidden')
      .attr('value', d => d[idkey])
      .attr('name', 'id');

    fr.append('input')
      .attr('type', 'hidden')
      .attr('value', idkey)
      .attr('name', 'idkey');
  }
  }

  function updateAPUSupplies(tr) {
    tr.select('td[column="Supplies_type"] span')
      .text(d => d.Supplies_type);
    tr.select('td[column="Supplies_description"] span')
      .text(d => d.Supplies_description ? d.Supplies_description : '-');
    tr.select('td[column="Supplies_description"] datalist')
      .attr('id', d => `list-${d.APUSupplies_id}`);
    tr.select('td[column="Supplies_description"] input')
      .attr('list', d => `list-${d.APUSupplies_id}`)
      .attr('value', d => d.APUSupplies_SupplyId);

    tr.select('td[column="Supplies_unit"] span')
      .text(d => d.Supplies_unit ? d.Supplies_unit : '-');
    tr.select('td[column="Supplies_cost"] span')
      .text(d => d.Supplies_cost ? d.Supplies_cost : '-');
    tr.select('td[column="APUSupplies_qop"] span')
      .text(d => d.APUSupplies_qop ? d.APUSupplies_qop : '-');

    tr.select('td[column="Supplies_unit"] input[name="id"]')
      .attr('value', d => d.id);
    tr.select('td[column="Supplies_cost"] input[name="id"]')
      .attr('value', d => d.id);
    tr.select('td[column="APUSupplies_qop"] input[name="id"]')
      .attr('value', d => d.id);
  }

  function insertSupplies(tr) {
    tr.append('td').attr('column', 'Supplies_type')
      .call(function(selection) {
      selection.append('span').text(d => d.Supplies_type)
        .on('click', d => {
          d3.event.target.hidden = true;
          d3.event.target.nextElementSibling.style.display = '';
        });
      selection.append('input').classed('awesomplete', true)
        .attr('list', 'Supplies_type')
        .attr('value', d => d.Supplies_type)
        .each(function() {
          this.style.display = 'none';
        })
        .on('change', d => {
          d3.event.target.style.display = 'none';
          d3.event.target.previousElementSibling.hidden = false;
          client.emit('data', {
            query: 'update',
            module: 'viewAPUSupplies',
            idkey: 'id',
            id: d.id,
            key: ['Supplies_type'],
            value: [d3.event.target.value]
          });
        });
    });
    tr.append('td').attr('column', 'Supplies_description')
      .call(function(selection) {
      selection.append('span').text(d => d.Supplies_description)
        .on('click', d => {
          d3.event.target.hidden = true;
          d3.event.target.nextElementSibling.style.display = '';
        });
      selection.append('input')
        .attr('list', d => `list-${d.APUSupplies_id}`)
        .attr('value', d => d.APUSupplies_SupplyId)
        .on('click', () => {
          d3.event.target.select();
        })
        .each(function() {
          this.style.display = 'none';
        })
        .on('change', d => {
          d3.event.target.style.display = 'none';
          d3.event.target.previousElementSibling.hidden = false;
          client.emit('data', {
            query: 'update',
            module: 'viewAPUSupplies',
            idkey: 'id',
            id: d.id,
            key: ['APUSupplies_SupplyId'],
            value: [d3.event.target.value]
          });
        })
        .on('keyup', d => {
          client.emit('data', {
            query: 'search',
            combo: d3.event.target.getAttribute('list'),
            module: 'Supplies',
            key: 'description',
            value: d3.event.target.value
          });
        });
      var dl = selection.append('datalist')
        .attr('id', d => `list-${d.APUSupplies_id}`);
      dl.append('option')
        .attr('value', d => d.Supplies_id)
        .text(d => d.Supplies_description);
    });
    tr.append('td')
      .call(setupEntry('id', 'Supplies_unit', 'viewAPUSupplies'));
    tr.append('td')
      .call(setupEntry('id', 'Supplies_cost', 'viewAPUSupplies'));
    tr.append('td')
      .call(setupEntry('id', 'APUSupplies_qop', 'viewAPUSupplies'));
    tr.append('td')
      .append('button').text('-')
      .on('click', d => {
        client.emit('data', {
          query: 'delete',
          module: 'APUSupplies',
          id: d.APUSupplies_id,
          idkey: 'id'
        });
      });
  }

  function render() {
    var table;
    var tr;

    var apu = d3.select('div.blocks')
      .selectAll('div.block')
      .data(Object.keys(blocks).map(key => blocks[key]));

    apu.select('td[column="APU_unit"] span').
      text(d => d.APU_unit ? d.APU_unit.toString().trim() : '-');
    apu.select('td[column="APU_cost"] span').
      text(d => d.APU_cost ? d.APU_cost.toString().trim() : '-');
    apu.select('td[column="APU_qop"] span').
      text(d => d.APU_qop ? d.APU_qop.toString().trim() : '-');
    apu.select('td[column="APU_description"] span').
      text(d => d.APU_description ? d.APU_description.toString().trim() : '-');
    apu.select('td[column="APU_information"] span').
      text(d => d.APU_information ? d.APU_information.toString().trim() : '-');

    var tr = apu.selectAll('tr.apusupply')
      .data(d => d.APUSupplies);
    tr.exit().remove();
    tr.call(updateAPUSupplies);
    tr.enter().select('table.apusupplies')
      .append('tr').classed('apusupply', true)
      .call(insertSupplies);

    apu.exit().remove();
    var apu = apu.enter().append('div').classed('block', true);

    table = apu.append('table');
    tr = table.append('tr')
      .classed('first', true);
    tr.append('td').call(setupEntry('id', 'APU_unit', 'viewAPUSupplies'));
    tr.append('td').call(setupEntry('id', 'APU_cost', 'viewAPUSupplies'));
    tr.append('td').call(setupEntry('id', 'APU_qop', 'viewAPUSupplies'));
    tr = table.append('tr')
      .classed('second', true);

    tr.append('td').attr('colspan', 4)
      .call(setupEntry('id', 'APU_description', 'viewAPUSupplies'));

    tr = table.append('tr');
    tr.append('td').attr('colspan', 4)
      .call(setupEntry('id', 'APU_information', 'viewAPUSupplies'));

    table = apu.append('table').classed('apusupplies', true);
    tr = table.selectAll('thead')
      .data(['thead']).enter()
      .append('tr');
    tr.append('th').text('Tipo');
    tr.append('th').text('Descripcion');
    tr.append('th').text('Unidad');
    tr.append('th').text('Costo');
    tr.append('th').text('Rdto');
    tr.append('th').text('');

    tr = table.selectAll('tr.apusupply')
      .data(d => d.APUSupplies);
    tr.exit().remove();
    tr.call(updateAPUSupplies);

    tr = tr.enter().append('tr').classed('apusupply', true);
    tr.call(insertSupplies);

    apu.append('button').text('+').on('click', (d, i, m) => {
      var tr = d3.select(m[i].parentElement)
        .select('table.apusupplies')
        .selectAll('tr.new').data([d])
        .enter().append('tr').classed('new', true);
      tr.append('td').text('-');
      tr.append('td').call(function(selection) {
        var fr = selection.append('form')
          .on('submit', () => {
            var e = d3.event;
            e.preventDefault();
            var form = e.target;
            var fd = new FormData(form);
            var row = fd.toJSON();

            if (row.SupplyId) {
              if (parseInt(row.SupplyId) == row.SupplyId) {
                e.target.closest('tr.new').remove();
                setTimeout(() => {
                  client.emit('data', {
                    query: 'insert',
                    row: row,
                    module: 'APUSupplies'
                  });
                }, 100);
              } else {
                e.target.closest('tr.new').remove();
                setTimeout(() => {
                  client.emit('data', {
                    query: 'insert',
                    row: {
                      type: 'Material',
                      description: row.SupplyId,
                      cost: 0,
                      unit: ''
                    },
                    module: 'Supplies'
                  });
                }, 100);
              }
            } else {
              // do nothing
              e.target.closest('tr.new').remove();
            }
          });

        fr.append('input')
          .attr('name', 'SupplyId')
          .attr('list', d => `list-new`)
          .on('change', d => {
            var v = d3.event.target.value;
            if (parseInt(v) == v) {
              d3.event.target.parentElement.dispatchEvent(new Event('submit'));
            }
          })
          .on('keyup', d => {
            client.emit('data', {
              query: 'search',
              combo: d3.event.target.getAttribute('list'),
              module: 'Supplies',
              key: 'description',
              value: d3.event.target.value
            });
          });

        fr.append('input')
          .attr('type', 'hidden')
          .attr('value', d.APU_id)
          .attr('name', 'APUId');

        var dl = selection.append('datalist')
          .attr('id', d => `list-new`);
        dl.append('option')
          .attr('value', d => d.Supplies_id)
          .text(d => d.Supplies_description);
      });
      tr.append('td').text('-');
      tr.append('td').text('-');
      tr.append('td').text('-');
    });
    apu.append('button').text('Importar')
      .on('click', d => {
        document.querySelector('import-a-u-supplies').setup(d.APU_id).show();
      });

  }

  function request(d) {
    Object.keys(blocks).forEach(key => {
      delete blocks[key];
    });
    d3.select('div.blocks').html('');
    blocks[SymId] = d.id_to_concrete;
    client.emit('data', {
      query: 'select',
      module: 'viewAPUSupplies',
      keynote: d.id_to_concrete
    });
  }

  function dosearch(res) {
    var opts = d3.select(`datalist[id="${res.combo}"]`)
      .selectAll('option').data(res.rows);
    opts.attr('value', d => d.id)
      .text(d => d.description);
    opts.enter().append('option')
      .attr('value', d => d.id)
      .text(d => d.description);
    opts.exit().remove();
  }

  window.viewapusupplies = {
    doinsert: doinsert,
    doselect: doselect,
    doupdate: doupdate,
    dodelete: dodelete,
    dosearch: dosearch,
    request: request
  };
})();
