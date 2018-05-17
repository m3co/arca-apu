'use strict';
(() => {
  const defaultRow = {
    description: ''
  };
  const validations = {
    description: { required: true }
  };

  const fields = [
    'description', 'unit', 'qop', 'estimated'
  ];

  const header = ['Descripcion', 'Unidad', 'Rdto', 'Estimado', '-', 'Ir'];
  const actions = [{
    select: 'button.delete',
    setup: (selection => selection
      .text('-')
      .classed('delete', true)
      .on('click', d => {
        client.emit('data', {
          query: 'delete',
          module: 'APU',
          id: d.id,
          idkey: 'id'
        });
      })
  )}, {
    select: 'button.show',
    setup: (selection => selection
      .text('>')
      .classed('show', true)
      .on('click', d => {

      })
    )
  }];

  const viewAPUSupplies_defaultRow = {
    description: ''
  };
  const viewAPUSupplies_validations = {
    description: { required: true }
  };

  const viewAPUSupplies_fields = [
    'Supplies_description', 'Supplies_unit', 'Supplies_cost', 'APUSupplies_qop'
  ];

  const viewAPUSupplies_header = ['Descripcion', 'Unidad', 'Costo', 'Rdto', '-', 'Ir'];
  const viewAPUSupplies_actions = [{
    select: 'button.delete',
    setup: (selection => selection
      .text('-')
      .classed('delete', true)
      .on('click', d => {
        console.log({
          query: 'delete',
          module: 'APUSupplies',
          id: d.APUSupplies_id,
          idkey: 'APUSupplies_id'
        });
        /*
        client.emit('data', {
          query: 'delete',
          module: 'APUSupplies',
          id: d.APUSupplies_id,
          idkey: 'APUSupplies_id'
        });
        */
      })
  )}, {
    select: 'button.show',
    setup: (selection => selection
      .text('>')
      .classed('show', true)
      .on('click', d => {

      })
    )
  }];

  function setupViewAPUSupplies(d) {
    client.emit('data', {
      query: 'select',
      module: 'viewAPUSupplies',
      APU_id: d.id
    });

    const filter = `[apuid="${d.id}"]`;
    window.viewapusupplies[filter] = setupTable({
      module: 'viewAPUSupplies', idkey: 'id', filter: filter,
      header: viewAPUSupplies_header,
      actions: viewAPUSupplies_actions,
      fields: viewAPUSupplies_fields,
      validations: viewAPUSupplies_validations,
      defaultRow: viewAPUSupplies_defaultRow
    });
  }

  const extrarow = [{
    update: (function(d, i, m) {
      d3.select(this.nextElementSibling).select('td')
        .attr('colspan', 6)
        .text(`This is the next info for ${d.description}`);
    }),
    exit: (function(d, i, m) {
      this.nextElementSibling.remove();
    }),
    enter: (function(d, i, m) {
      d3.select(
        this.insertAdjacentElement('afterend',
          document.createElement('tr')
        )).append('td')
          .attr('colspan', 6)
          .each(function() {
            this.appendChild(
              document.importNode(
                document.querySelector(
                  'template#viewAPUSupplies').content, true));
            this.querySelector('table').setAttribute('apuid', d.id);
            setupViewAPUSupplies(d);
          });
    })
  }];

  window.viewapusupplies = {};
  window.apu = setupTable({
    module: 'APU', header: header, actions: actions,
    fields: fields, idkey: 'id', validations: validations,
    defaultRow: defaultRow, extraRows: extrarow
  });
})();
