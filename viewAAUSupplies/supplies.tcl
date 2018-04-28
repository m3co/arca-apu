
namespace eval Supplies {

  proc 'do'insert { resp } {
    upvar $resp response
    array set entry [deserialize $response(row)]
    if { $labelentry::lastEdit(input) == "" } {
      return
    }

    set response(rows) [list [array get entry]]
    set response(combo) $labelentry::lastEdit(input)

    viewAAUSupplies::'do'search response
  }

  proc 'do'update { resp } {
    upvar $resp response
  }

  proc 'do'delete { resp } {
    upvar $resp response
  }
}
