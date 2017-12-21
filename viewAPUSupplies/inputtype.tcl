
proc viewAPUSupplies::input'type { e frame } {
  array set entry [deserialize $e]

  set fr $frame.type.$entry(APUSupplies_id)
  if { [winfo exists $fr] == 0 } {
    pack [frame $fr] -fill x -expand true
  }
  set label $fr.label
  if { [winfo exists $label] == 0 } {
    pack [label $label -text $entry(Supplies_type)] -side left
  }
  $label configure -text [expr { \
    ($entry(Supplies_type) == "null" || $entry(Supplies_type) == "") ? \
    "-" : $entry(Supplies_type) }]
  bind $label <1> [list viewAPUSupplies::turn'combobox'type \
    %W $fr [array get entry]]
}

proc viewAPUSupplies::turn'combobox'type { path frame e } {

  array set conf [list \
    frame $frame \
    key Supplies_type \
    from viewAPUSupplies \
    module viewAPUSupplies \
    idkey id \
  ]

  array set entry [deserialize $e]
  labelentry::'end'redact [array get conf]

  set combo [ttk::combobox $frame.combo]
  $combo insert 0 $entry(Supplies_type)
  $combo configure -values [list \
    {Material} {Mano de Obra} {Equipo} {Transporte} {Subcontrato}]
  bind $combo <<ComboboxSelected>> [list \
    viewAPUSupplies::select'combobox'type %W $frame.label $e]

  set labelentry::lastEdit(input) $combo
  set labelentry::lastEdit(label) $frame.label

  pack forget $path
  pack $combo -fill x -expand true
  extendcombo::setup $combo
  focus $combo
}

proc viewAPUSupplies::select'combobox'type { path label e } {
  array set entry [deserialize $e]

  array set event [list \
    query update \
    module Supplies \
    from Supplies \
    idkey id \
    id $entry(Supplies_id) \
    key type \
    value "{[$path get]}" \
    entry [array get entry] \
  ]

  chan puts $MAIN::chan [array get event]

  $label configure -text "..."
  pack $label -side left
  destroy $path
}

