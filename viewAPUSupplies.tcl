
namespace eval viewAPUSupplies {
  variable frame

  proc open'view { space keynote } {
    #viewAPUSupplies::clean'data

    variable rows
    array unset rows
    array set rows {}
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
    set rowid "$row(keynotes_id),$row(APUSupplies_id),$row(Supplies_id)"
    variable rows
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

        pack [frame $apu_frame.supplies -bg red] -side top -fill x -expand true
      }

      if { $row(APUSupplies_id) != "" } {
        set apusupply_frame $apu_frame.supplies.apu_$row(APUSupplies_id)
        if { [winfo exists $apusupply_frame] == 0 } {
          pack [frame $apusupply_frame -bg yellow] -side top -fill x
          pack [label $apusupply_frame.supply_description -text $row(Supplies_description)] -side left
          pack [label $apusupply_frame.supply_unit -text $row(Supplies_unit)] -side left
          pack [label $apusupply_frame.supply_cost -text $row(Supplies_cost)] -side left
          pack [label $apusupply_frame.supply_qop -text $row(APUSupplies_qop)] -side left
        }
      }
    }
  }
}
