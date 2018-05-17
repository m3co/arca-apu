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
          .text(`This is the next info for ${d.description}`);
    })
  }];

  window.apu = setupTable('APU', header, actions,
    fields, 'id', validations, defaultRow, extrarow);
})();
