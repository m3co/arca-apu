
namespace eval Supplies {

  proc 'do'insert { resp } {
    upvar $resp response
    array set entry [deserialize $response(row)]

    set response(rows) [list [array get entry]]
    set response(combo) $labelentry::lastEdit(input)

    fnAPUSupplies::'do'search response
  }

  proc 'do'update { resp } {
    upvar $resp response
    return

    #
    # TODO EL CODIGO DE AQUI PARA ABAJO AUN ESTA SIN REVISAR
    #
    array set supplies [array get fnAPUSupplies::supplies]
    array set row [deserialize $response(row)]

    #
    # Evite actualizar Insumo invisible
    if { [array get supplies $row(id)] == "" } {
      return
    }
    array set entry [deserialize $supplies($row(id))]

    set entry($response(key)) $response(value)
    set fnAPUSupplies($row(id)) [array get entry]

    set response(module) fnAPUSupplies
    set response(entry) [array get entry]
    fnAPUSupplies::'do'update response
  }

  proc 'do'delete { resp } {
    upvar $resp response
  }
}
