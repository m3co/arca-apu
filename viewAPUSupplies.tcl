
namespace eval viewAPUSupplies {
  variable frame

  proc open'view { space keynote } {
    set id [regsub -all {[.]} $keynote "_"]

    if { [winfo exists $space] == 1 } {
      destroy $space
    }
    pack [ScrolledWindow $space] -side right -fill both -expand true
    set centerFrame [ScrollableFrame [$space getframe].centerframe -bg blue]
    $space setwidget $centerFrame

    variable frame [$centerFrame getframe].$id
    pack [frame $frame] -fill x -expand true

    array set event [list \
      query select \
      module viewAPUSupplies \
      from viewAPUSupplies \
      keynote $keynote \
    ]

    chan puts $MAIN::chan [array get event]
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
        pack [label $apu_frame.apu_description -text $row(APU_description)] \
          -side top -fill x -expand true
        pack [frame $apu_frame.extras] -side top -fill x
        pack [label $apu_frame.extras.apu_unit -text $row(APU_unit)] -side left
        pack [label $apu_frame.extras.apu_cost -text $row(APU_cost)] -side left
        pack [label $apu_frame.extras.apu_qop -text $row(APU_qop)] -side left

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
        pack [frame $apu_frame.supplies.description.$row(APUSupplies_id)] -side top -fill x
        pack [label $apu_frame.supplies.description.$row(APUSupplies_id).label -text $row(Supplies_description)] -side left

        pack [frame $apu_frame.supplies.unit.$row(APUSupplies_id)] -side top -fill x
        pack [label $apu_frame.supplies.unit.$row(APUSupplies_id).label -text $row(Supplies_unit)] -side left

        pack [frame $apu_frame.supplies.cost.$row(APUSupplies_id)] -side top -fill x
        pack [label $apu_frame.supplies.cost.$row(APUSupplies_id).label -text $row(Supplies_cost)] -side left

        pack [frame $apu_frame.supplies.qop.$row(APUSupplies_id)] -side top -fill x
        pack [label $apu_frame.supplies.qop.$row(APUSupplies_id).label -text $row(APUSupplies_qop)] -side left
      }
    }
  }
}
