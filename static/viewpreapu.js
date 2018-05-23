'use strict';
(() => {
  const defaultRow = {
    name: ''
  };
  const validations = {
    name: { required: true }
  };

  const fields = [
    'id', 'description', 'unit', 'qop', 'preAPU_cost'
  ];

  const header = ['', 'Descripcion', 'Unidad', 'Cant', 'Costo'];
  const actions = [];

  window.viewpreapu = setupTable({
    module: 'viewpreAPU',
    header: header, actions: actions,
    fields: fields, idkey: 'id', validations: validations,
    defaultRow: defaultRow, filter: { key: 'table', value: 'viewpreAPU' }
  });
})();
