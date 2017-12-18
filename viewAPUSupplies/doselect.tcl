
namespace eval viewAPUSupplies {

  proc setup'newentry { apu_frame } {
    if { [winfo exists $apu_frame.supplies] == 0 } {
      pack [frame $apu_frame.supplies -bg red] -side top -fill x -expand true
      foreach param [list action type description unit cost partial qop] {
        if { $param == "partial" } {
          pack [labelframe $apu_frame.supplies.$param -text "Valor/Parcial"] \
            -side left
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

    if { [winfo exist $apu_frame.supplies.type.newentry] == 1 } {
      destroy $apu_frame.supplies.type.newentry
    }
    pack [frame $apu_frame.supplies.type.newentry] -side top -fill x
    pack [label $apu_frame.supplies.type.newentry.label -text " "] \
      -side left

    if { [winfo exist $apu_frame.supplies.description.newentry] == 1 } {
      destroy $apu_frame.supplies.description.newentry
    }
    array set newentry {
      APUSupplies_id newentry
      APUSupplies_qop ""
      APU_cost ""
      APU_description ""
      APU_id ""
      APU_qop ""
      APU_unit ""
      Supplies_cost ""
      Supplies_description ""
      Supplies_id ""
      Supplies_unit ""
      estimated ""
      expand ""
      id newentry
      keynotes_id ""
      parent ""
      type ""
      upload ""
      Qtakeoff_qop ""
    }
    input'description [array get newentry] $apu_frame.supplies

    if { [winfo exist $apu_frame.supplies.unit.newentry] == 1 } {
      destroy $apu_frame.supplies.unit.newentry
    }
    pack [frame $apu_frame.supplies.unit.newentry] -side top -fill x
    pack [label $apu_frame.supplies.unit.newentry.label -text " "] \
      -side left

    if { [winfo exist $apu_frame.supplies.cost.newentry] == 1 } {
      destroy $apu_frame.supplies.cost.newentry
    }
    pack [frame $apu_frame.supplies.cost.newentry] -side top -fill x
    pack [label $apu_frame.supplies.cost.newentry.label -text " "] \
      -side left

    if { [winfo exist $apu_frame.supplies.qop.newentry] == 1 } {
      destroy $apu_frame.supplies.qop.newentry
    }
    pack [frame $apu_frame.supplies.qop.newentry] -side top -fill x
    pack [label $apu_frame.supplies.qop.newentry.label -text " "] \
      -side left
  }

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

        setup'newentry $apu_frame
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

        input'description [array get row] $apu_frame.supplies

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

        setup'newentry $apu_frame
      }
    }
  }

}
