'use strict';
(() => {
  const defaultRow = {};
  const validations = {};
  const fields = [
    {
      key: 'id',
      readonly: true
    }, {
      key: 'description',
      readonly: true
    }, {
      key: 'qop',
      readonly: true
    }, {
      key: 'preAPU_qop',
      readonly: true
    }, {
      key: 'unit',
      readonly: true
    }, 'preAPU_cost', {
      key: 'calculated',
      call: selection => {
        selection.text(d => {
          return d.preAPU_cost * d.preAPU_qop;
        });
      }
    }
  ];
  const header = ['', 'Descripcion', 'Cant', '_Cant', 'Unidad', 'Costo', 'Parcial'];
  const actions = [];

  window.viewpreapu = setupTable({
    module: 'viewpreAPU',
    header: header, actions: actions,
    fields: fields, idkey: 'id', validations: validations,
    defaultRow: defaultRow, filter: { key: 'table', value: 'viewpreAPU' },
    preventNewEntry: true
  });
})();
