
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

  proc 'do'update { resp } {
    upvar $resp response
    array set row [deserialize $response(row)]
    variable frame

    #set keynote_frame $frame.[regsub -all {[.]} $row(keynotes_id) "_"]
    #set apu_frame $keynote_frame.apu_$row(APU_id)
    #$apu_frame.supplies.description.$row(APUSupplies_id)
  }

}

source [file join [file dirname [info script]] doupdate.tcl]
source [file join [file dirname [info script]] doselect.tcl]
source [file join [file dirname [info script]] inputdescription.tcl]
