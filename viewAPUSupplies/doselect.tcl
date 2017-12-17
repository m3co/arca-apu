
namespace eval viewAPUSupplies {

  proc 'do'select { resp } {
    upvar $resp response
    array set row [deserialize $response(row)]
    variable frame

    set keynote_frame $frame.[regsub -all {[.]} $row(keynotes_id) "_"]
    if { [winfo exists $keynote_frame] == 0 } {
      pack [labelframe $keynote_frame -text $row(keynotes_id) -bg green] \
        -fill x -expand true
    }
    if { $row(APU_id) != "" } {
      set apu_frame $keynote_frame.apu_$row(APU_id)
      if { [winfo exists $apu_frame] == 0 } {
        pack [frame $apu_frame -bg yellow] -side left
        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APU_description \
          frame [frame $apu_frame.apu_description] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side top -fill x -expand true
        labelentry::setup [array get conf] [array get row]

        pack [frame $apu_frame.extras] -side top -fill x
        pack [label $apu_frame.extras.apu_unit_text -text "Unidad:"] -side left
        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APU_unit \
          frame [frame $apu_frame.extras.apu_unit] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side left
        labelentry::setup [array get conf] [array get row]

        pack [label $apu_frame.extras.apu_cost_text -text "Valor Unitario:"] -side left
        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APU_cost \
          frame [frame $apu_frame.extras.apu_cost] \
          dollar true \
          currency true \
        ]
        pack $conf(frame) -side left
        labelentry::setup [array get conf] [array get row]

        pack [label $apu_frame.extras.apu_qop_text -text "Rdto:"] -side left
        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APU_qop \
          frame [frame $apu_frame.extras.apu_qop] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side left
        labelentry::setup [array get conf] [array get row]

        if { $row(APUSupplies_id) != "" } {
          pack [frame $apu_frame.supplies -bg red] -side top -fill x -expand true
          foreach param [list action type description unit cost partial qop] {
            if { $param == "partial" } {
              pack [labelframe $apu_frame.supplies.$param -text "Valor/Parcial"] -side left
              continue
            }
            if { $param == "action" } {
              pack [labelframe $apu_frame.supplies.$param -text "-"] -side left
              continue
            }
            pack [labelframe $apu_frame.supplies.$param -text $param] -side left
              # \ -fill x -expand [expr { $param == "description" }]
              # hace parte de la linea de arriba...
          }
        }
      }

      if { $row(APUSupplies_id) != "" } {
        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key type \
          frame [frame $apu_frame.supplies.type.$row(APUSupplies_id)] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side top -fill x
        labelentry::setup [array get conf] [array get row]

        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key Supplies_description \
          frame [frame $apu_frame.supplies.description.$row(APUSupplies_id)] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side top -fill x
        labelentry::setup [array get conf] [array get row]

        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key Supplies_unit \
          frame [frame $apu_frame.supplies.unit.$row(APUSupplies_id)] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side top -fill x
        labelentry::setup [array get conf] [array get row]

        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key Supplies_cost \
          frame [frame $apu_frame.supplies.cost.$row(APUSupplies_id)] \
          dollar true \
          currency true \
        ]
        pack $conf(frame) -side top -fill x
        labelentry::setup [array get conf] [array get row]

        array set conf [list \
          from viewAPUSupplies \
          module viewAPUSupplies \
          idkey id \
          key APUSupplies_qop \
          frame [frame $apu_frame.supplies.qop.$row(APUSupplies_id)] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side top -fill x
        labelentry::setup [array get conf] [array get row]
      }
    }
  }

}
