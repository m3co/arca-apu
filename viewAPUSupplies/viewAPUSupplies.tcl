
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

  proc delete'row { path r } {
    array set row [deserialize $r]
    array set event [list \
      query delete \
      module APUSupplies \
      from APUSupplies \
      id $row(APUSupplies_id) \
      idKey id \
    ]
    chan puts $MAIN::chan [array get event]
    $path configure -relief raised
  }

  proc 'do'insert { resp } {
    upvar $resp response
    'do'select response
  }

  proc 'do'delete { resp } {
    upvar $resp response
    array set row [deserialize $response(row)]
    variable frame

    set keynote_frame $frame.[regsub -all {[.]} $row(Keynotes_id) "_"]
    set apu_frame $keynote_frame.apu_$row(APU_id)

    if { $row(APUSupplies_id) != "" } {
      if { [winfo exists $apu_frame.supplies.type.$row(APUSupplies_id)] == 1 } {
        destroy $apu_frame.supplies.type.$row(APUSupplies_id)
      }
      if { [winfo exists $apu_frame.supplies.description.$row(APUSupplies_id)] == 1 } {
        destroy $apu_frame.supplies.description.$row(APUSupplies_id)
      }
      if { [winfo exists $apu_frame.supplies.unit.$row(APUSupplies_id)] == 1 } {
        destroy $apu_frame.supplies.unit.$row(APUSupplies_id)
      }
      if { [winfo exists $apu_frame.supplies.cost.$row(APUSupplies_id)] == 1 } {
        destroy $apu_frame.supplies.cost.$row(APUSupplies_id)
      }
      if { [winfo exists $apu_frame.supplies.qop.$row(APUSupplies_id)] == 1 } {
        destroy $apu_frame.supplies.qop.$row(APUSupplies_id)
      }
      if { [winfo exists $apu_frame.supplies.action.$row(APUSupplies_id)] == 1 } {
        destroy $apu_frame.supplies.action.$row(APUSupplies_id)
      }
      if { [winfo exists $apu_frame.supplies.partial.$row(APUSupplies_id)] == 1 } {
        destroy $apu_frame.supplies.partial.$row(APUSupplies_id)
      }
      return
    }

    if { $row(APU_id) != "" } {
      if { [winfo exists $apu_frame] == 1 } {
        destroy $apu_frame
      }
    }
    if { [winfo exists $keynote_frame] == 1 } {
      destroy $keynote_frame
    }
  }
}

source [file join [file dirname [info script]] doupdate.tcl]
source [file join [file dirname [info script]] doselect.tcl]
source [file join [file dirname [info script]] inputdescription.tcl]
source [file join [file dirname [info script]] inputtype.tcl]
