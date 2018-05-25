'use strict';
(() => {
  const defaultRow = {
    ContractorId: 2
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
      .text('Importar')
      .classed('show', true)
      .on('click', d => {
        document.querySelector('import-a-u-supplies').setup(d.id).show();
      })
    )
  }];

  const viewAPUSupplies_validations = {
    APUSupplies_SupplyId: { required: true }
  };

  const viewAPUSupplies_fields = [
   {
     name: 'APUSupplies_SupplyId',
     show: 'Supplies_description',
     bike: {
       client: client,
       module: 'Supplies',
       key: 'description',
       onblur: function(d, input) {
         if (input._found) {
           if (input._found._row) {
             this.textContent = input._found._row.description;
           }
         }
       }
     }
   }, 'Supplies_unit', {
     name: 'Supplies_cost',
     type: 'number'
   }, {
     name: 'APUSupplies_qop',
     type: 'number'
   }
  ];

  const viewAPUSupplies_header = ['Descripcion', 'Unidad', 'Costo', 'Rdto', '-', 'Ir'];
  const viewAPUSupplies_actions = [{
    select: 'button.delete',
    setup: (selection => selection
      .text('-')
      .classed('delete', true)
      .on('click', d => {
        client.emit('data', {
          query: 'delete',
          module: 'APUSupplies',
          id: d.APUSupplies_id,
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

  function setupViewAPUSupplies(d) {
    client.emit('data', {
      query: 'select',
      module: 'viewAPUSupplies',
      APU_id: d.id
    });

    const viewAPUSupplies_defaultRow = {
      APUSupplies_APUId: d.id
    };
    const filter = { key: 'apuid', value: d.id };
    var _filter = `[${filter.key.toLowerCase()}="${filter.value || ''}"]`;
    window.viewapusupplies[_filter] = setupTable({
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
      // No se por que se estan creando muchas entradas
      // ... es como si enter() se ejecutase muchas veces
    }),
    exit: (function(d, i, m) {
      if (this) {
        if (this.nextElementSibling) {
          this.nextElementSibling.remove();
        }
      }
    }),
    enter: (function(d, i, m) {
      if (this.nextElementSibling) {
        if (this.nextElementSibling.getAttribute('apuid') == d.id) {
          // algo va mal aqui...
        }
      }
      d3.select(
        this.insertAdjacentElement('afterend',
          document.createElement('tr')
        )).append('td')
          .attr('colspan', 6)
          .attr('apuid', d.id)
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
    defaultRow: defaultRow, extraRows: extrarow,
    filter: { key: 'table', value: 'APU' }
  });
})();
