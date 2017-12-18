
proc viewAPUSupplies::input'description { e frame } {
  array set entry [deserialize $e]

  set fr $frame.description.$entry(id)
  if { [winfo exists $fr] == 0 } {
    pack [frame $fr] -fill x -expand true
  }
  set label $fr.label
  if { [winfo exists $label] == 0 } {
    if { $entry(id) != "newentry" } {
      pack [label $fr.edit -text "!"] -side left
      bind $fr.edit <1> [list viewAPUSupplies::rename'description \
        %W $fr [array get entry]]
    }
    pack [label $label -text $entry(Supplies_description)] -side left
  }
  $label configure -text [expr {$entry(Supplies_description) == "" ? \
    "-" : $entry(Supplies_description) }]
  bind $label <1> [list viewAPUSupplies::turn'combobox \
    %W $fr [array get entry]]
}

proc viewAPUSupplies::rename'description { path frame e } {

  array set conf [list \
    frame $frame \
    key description \
    from viewAPUSupplies \
    module viewAPUSupplies \
    idkey id \
  ]

  labelentry::'begin'redact $frame.label [array get conf] $e
  set label $frame.label
  bind $label <1> [list viewAPUSupplies::turn'combobox \
    %W $frame $e]
}

proc viewAPUSupplies::turn'combobox { path frame e } {

  array set conf [list \
    frame $frame \
    key description \
    from viewAPUSupplies \
    module viewAPUSupplies \
    idkey id \
  ]

  array set entry [deserialize $e]
  labelentry::'end'redact [array get conf]

  set combo [ttk::combobox $frame.combo]
  $combo insert 0 $entry(Supplies_description)
  bind $combo <KeyRelease> +[list \
    viewAPUSupplies::search'combobox %W %K]
  bind $combo <<ComboboxSelected>> [list \
    viewAPUSupplies::select'combobox %W $frame.label [array get entry]]

  set labelentry::lastEdit(input) $combo
  set labelentry::lastEdit(label) $frame.label

  pack forget $path
  pack $combo -fill x -expand true
  extendcombo::setup $combo
  focus $combo
}

#
# Se espera que la lista mostrada en el combobox tenga al final de cada
# linea el formato { $texto-descriptivo [id] }. Bajo dicho formato es posible
# obtener el id del Supply seleccionado
#
proc viewAPUSupplies::select'combobox { path label e } {
  array set entry [deserialize $e]
  variable lastSearch
  if { [llength [array names lastSearch]] == 0 } {
    #
    # El acto a seguir es, crear el insumo y luego con el insumo creado
    # actualizar la entrada de la APU
    #
    array set event [list \
      query insert \
      module Supplies \
      from Supplies \
      row [list description [$path get]] \
    ]
    chan puts $MAIN::chan [array get event]

    $labelentry::lastEdit(input) configure -values [list "..."]
    $labelentry::lastEdit(input) set "..."
    return
  }
  set id [lindex [regexp -inline {\[(\d+)\]$} [$path get]] end]
  puts "select'combobox $id"
  parray entry

  return

  # Reemplace el insumo con el insumo seleccionado
  foreach param [list description unit cost type] {
    set entry($param) [dict get $lastSearch($id) $param]
    if { $entry($param) == "null" } {
      set entry($param) ""
    }
  }
  set entry(SupplyId) $id

  array set event [list \
    query update \
    module viewAPUSupplies \
    from viewAPUSupplies \
    idkey id \
    id $entry(id) \
    key SupplyId \
    value [dict get $lastSearch($id) id] \
    row [array get entry] \
  ]

  if { $entry(id) == "newentry" } {
    array unset event
    array set event [list \
      query insert \
      module viewAPUSupplies \
      from APUSupplies \
      entry [array get entry] \
      row  [list \
        APUId $entry(APUId) \
        SupplyId $entry(SupplyId) \
        qop 0 \
      ]\
    ]
  }
  chan puts $MAIN::chan [array get event]

  $label configure -text "..."
  pack $label -side left
  destroy $path
}

#
# La lista resultante de la busqueda de insumos mostrarla en el combobox,
# y allende guardar dicho resultado en favor de viewAPUSupplies::select'combobox
#
proc viewAPUSupplies::'do'search { resp } {
  upvar $resp response
  variable lastSearch

  array unset lastSearch
  array set lastSearch {}
  set found [list]

  foreach row $response(rows) {
    array set entry [deserialize $row]
    lappend found "$entry(description) \[$entry(id)]"
    set lastSearch($entry(id)) [array get entry]
  }
  if { [llength $found] == 0 } {
    set r [lindex [regexp -inline {(.+) [[]\d+[]]$} $response(value)] end]
    if { $r == "" } {
      lappend found $response(value)
    }
  }
  $response(combo) configure -values $found
  extendcombo::show'listbox $response(combo) ""
}

proc viewAPUSupplies::search'combobox { path key } {
  if {[string length $key] > 1 && [string tolower $key] != $key} {
    return
  }
  set value [$path get]

  array set event [list \
    query search \
    combo $path \
    module viewAPUSupplies \
    from Supplies \
    key description \
    value $value
  ]
  chan puts $MAIN::chan [array get event]
}
