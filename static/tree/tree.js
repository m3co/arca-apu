'use strict';
(() => {

  var Children = Symbol();
  var Ready = Symbol();
  var root = {
    id: '2', parent: null,
    description: '', expand: true
  };
  root[Children] = [];
  root[Ready] = false;

  var tree = {};
  tree[Children] = [root];
  tree[Ready] = false;
  var unsorted = [];

  window.trees = tree;
  window.unsorted = unsorted;

  var lastSTO, skipOnce = true;

  function requestpreAPU(d, i, m) {
    viewpreapu.clear();
    client.emit('data', {
      module: 'viewpreAPU',
      query: 'select',
      ContractorId: d.ContractorId,
      id: d.id
    });
  }

  function doselect(row) {
    if (row.expand) {
      row[Children] = [];
      row[Ready] = false;
    }

    function search(id, tree) {
      var parent;
      if (tree[Children] instanceof Array) {
        parent = tree[Children].find(d => d.id == id);
        if (parent) {
          return parent;
        }
        for (var i = 0; i < tree[Children].length; i++) {
          parent = search(id, tree[Children][i]);
          if (parent) {
            return parent;
          }
        }
      }
    }
    var parent = search(row.parent, tree);
    if (!parent) {
      unsorted.push(row);
    } else {
      var found = parent[Children].find(d => d.id === row.id);
      if (!found) {
        parent[Children].push(row);
        parent[Ready] = true;
      } else {
        Object.keys(row).forEach(key => {
          found[key] = row[key];
        });

        d3.select(`[id="item-${row.id}"]`)
          .text(`${row.id} ${
            row.description ?
              row.description : row.description}`);

        d3.select(`[id="btn-${row.id}"]`)
          .attr('hidden', d => d.expand ? '' : null)
          .text(d => d.preAPUId == null ? 'o' : 'x');
        return;
      }
    }

    if (lastSTO) {
      clearTimeout(lastSTO);
    }
    lastSTO = setTimeout(() => {
      render(d3.select('ol.tree'), tree);
    }, 300);
  }

  function setupConcretize(d) {
    if (!d.parent) return;
    d3.select(this).append('div').classed('concretize', true)
      .append('button')
      .attr('id', d => `btn-${d.id}`)
      .attr('hidden', d => d.expand ? '' : null)
      .text(d => d.preAPUId == null ? 'o' : 'x')
      .on('click', (d) => {
        var req;
        if (d.id == null) {
          req = {
            query: 'concretize',
            module: 'fnConcretizeAAU',
            keynote: d.id_general,
            project: d.id.split('.')[0]
          };
        } else {
          req = {
            query: 'deconcretize',
            module: 'fnConcretizeAAU',
            keynote: d.id,
            project: d.id.split('.')[0]
          };
        }
        client.emit('data', req);
      });
  }

  function render(base, tree) {
    if (!(tree[Children] instanceof Array)) {
      return;
    }
    var tr = base.selectAll('li')
      .data(tree[Children].filter(d => d.expand))
      .enter().append('li');

    tr.append('label')
      .attr('for', d => d.id)
      .attr('id', d => `item-${d.id}`)
      .text(d => `${d.id} ${
        d.description ?
          d.description : d.description}`)
      .on('click', requestpreAPU);
    tr.append('input')
      .attr('type', 'checkbox')
      .attr('for', d => d.id)
      .each(function(d) {
        if (d.parent === null) {
          d3.select(this).attr('checked', '');
        }
      });
    tr.append('ol').attr('root', d => d.id);

    tr.each(setupConcretize);

    var tr = base.selectAll('li.file')
      .data(tree[Children].filter(d => !d.expand))
      .enter().append('li').attr('class', 'file');

    tr.append('a')
      .attr('id', d => `item-${d.id}`)
      .attr('href', '#').text(d => `${d.id} ${
        d.description ?
          d.description : d.description}`)
      .style('color', d =>
        d.status == 'empty' ? 'gray' : (d.status == 'full' ? 'black' : 'blue')
      )
      .on('click', requestpreAPU);

    tr.each(setupConcretize);

    for (var i = 0; i < tree[Children].length; i++) {
      if (tree[Children][i].expand) {
        render(d3.select(`ol[root="${tree[Children][i].id}"]`),
          tree[Children][i]);
      }
    }
  }

  window.tree = {
    doselect: doselect
  };
})();
