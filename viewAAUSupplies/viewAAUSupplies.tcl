
namespace eval Supplies {
  proc 'do'search { resp } {
    upvar $resp response
    viewAAUSupplies::'do'search response
  }
}

namespace eval viewAAUSupplies {
  variable frame
  variable description

  chan puts $MAIN::chan [json::write object \
    query [json::write string describe] \
    module [json::write string viewAAUSupplies] \
  ]

  proc 'do'describe { resp } {
    upvar $resp response
    variable description
    array set description [list {*}$response(description)]
  }

  proc open'view { space keynote } {
    set id [regsub -all {[.]} $keynote "_"]

    if { [winfo exists $space] == 1 } {
      destroy $space
    }
    pack [ScrolledWindow $space] -side right -fill both -expand true
    set centerFrame [ScrollableFrame [$space getframe].centerframe]
    $space setwidget $centerFrame

    variable frame [$centerFrame getframe].$id
    pack [frame $frame] -fill x -expand true

    set event [list \
      query {"select"} \
      module {"viewAAUSupplies"} \
      from {"viewAAUSupplies"} \
      keynote [json::write string $keynote] \
    ]

    chan puts $MAIN::chan [json::write object {*}$event]
  }

  proc delete'row { path r } {
    array set row [deserialize $r]
    set event [dict create \
      query [json::write string delete] \
      module [json::write string AAUSupplies] \
      id $row(AAUSupplies_id) \
      idkey [json::write string id] \
    ]
    chan puts $MAIN::chan [json::write object {*}$event]
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
    if { [info exists frame] != 1 } {
      return
    }

    set keynote_frame $frame.[regsub -all {[.]} $row(AAU_id) "_"]
    set aau_frame $keynote_frame.aau_[regsub -all {[.]} $row(AAU_id) "_"]

    if { $row(AAUSupplies_id) != "null" } {
      if { [winfo exists $aau_frame.supplies.type.$row(AAUSupplies_id)] == 1 } {
        destroy $aau_frame.supplies.type.$row(AAUSupplies_id)
      }
      if { [winfo exists $aau_frame.supplies.description.$row(AAUSupplies_id)] == 1 } {
        destroy $aau_frame.supplies.description.$row(AAUSupplies_id)
      }
      if { [winfo exists $aau_frame.supplies.unit.$row(AAUSupplies_id)] == 1 } {
        destroy $aau_frame.supplies.unit.$row(AAUSupplies_id)
      }
      if { [winfo exists $aau_frame.supplies.cost.$row(AAUSupplies_id)] == 1 } {
        destroy $aau_frame.supplies.cost.$row(AAUSupplies_id)
      }
      if { [winfo exists $aau_frame.supplies.qop.$row(AAUSupplies_id)] == 1 } {
        destroy $aau_frame.supplies.qop.$row(AAUSupplies_id)
      }
      if { [winfo exists $aau_frame.supplies.action.$row(AAUSupplies_id)] == 1 } {
        destroy $aau_frame.supplies.action.$row(AAUSupplies_id)
      }
      if { [winfo exists $aau_frame.supplies.partial.$row(AAUSupplies_id)] == 1 } {
        destroy $aau_frame.supplies.partial.$row(AAUSupplies_id)
      }
      return
    }

    if { $row(AAU_id) != "null" } {
      if { [winfo exists $aau_frame] == 1 } {
        destroy $aau_frame
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
source [file join [file dirname [info script]] supplies.tcl]
