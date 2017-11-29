
namespace eval fnAPUSupplies {
  array set rows {}
  array set supplies {}
  array set frames {}
  set frame ""

  proc clean'data { } {
    variable rows
    variable supplies
    variable frames

    array unset rows
    array set rows {}

    array unset supplies
    array set supplies {}

    array unset frames
    array set frames {}
  }

  proc open { fr r } {
    variable frames
    variable rows
    variable supplies
    array set row [deserialize $r]

    variable frame $fr.space
    if { [winfo exists $fr.space] == 1 } {
      return
    }
    set frames($row(APUId)) $frame
    pack [frame $frame] -fill x -expand true

    array set event [list \
      query select \
      from fnAPUSupplies \
      module fnAPUSupplies \
      APUId $row(APUId) \
    ]

    foreach param [list action type description unit cost partial qop] {
      if { $param == "partial" } {
        pack [labelframe $frame.$param -text "Valor/Parcial"] -side left
        continue
      }
      if { $param == "action" } {
        pack [labelframe $frame.$param -text "-"] -side left
        continue
      }
      pack [labelframe $frame.$param -text $param] -side left
        # \ -fill x -expand [expr { $param == "description" }]
        # hace parte de la linea de arriba...

    }
    chan puts $MAIN::chan [array get event]
  }

  proc 'do'delete { resp } {
    variable frames
    upvar $resp response
    array set row [deserialize $response(row)]
    set id $row(id)
    if { [array get frames $row(APUId)] == "" } {
      return
    }
    set frame $frames($row(APUId))
    foreach param [list action type description unit cost qop] {
      set path $frame.$param.$response(id)
      if { [winfo exists $path] == 1 } {
        destroy $path
      }
    }
  }

  proc 'do'update { resp } {
    variable frames
    upvar $resp response
    array set row [deserialize $response(row)]
    set id $row(id)
    if { [array get frames $row(APUId)] == "" } {
      return
    }
    set frame $frames($row(APUId))

    foreach param [list unit cost qop] {
      set label $frame.$param.$id
      if { [winfo exists $label] == 0 } {
        return
      }
      array set conf [list \
        frame $label \
        key $param \
        from fnAPUSupplies \
        module fnAPUSupplies \
        idkey id \
      ]
      set conf(currency) true
      set conf(dollar) true
      if { $param == "unit" } {
        set conf(currency) false
        set conf(dollar) false
      }
      if { $param == "qop" } {
        set conf(dollar) false
      }

      labelentry::setup [array get conf] [array get row]
    }
    input'description row
    input'type row
  }

  proc 'do'insert { resp } {
    upvar $resp response
    #'do'select response
  }

  proc 'do'select { resp } {
    variable frames
    variable rows
    variable supplies
    upvar $resp response
    array set row [deserialize $response(row)]
    set id $row(id)
    set frame $frames($row(APUId))

    foreach param [list unit cost qop] {
      set label $frame.$param.$id
      if { [winfo exists $label] == 0 } {
        pack [frame $label] -expand true -fill x
      }
      if { [winfo exists $frame.$param.newentry] == 1 } {
        destroy $frame.$param.newentry
      }
      pack [label $frame.$param.newentry -text " "] -side bottom
      array set conf [list \
        frame $label \
        key $param \
        from fnAPUSupplies \
        module fnAPUSupplies \
        idkey id \
      ]
      set conf(currency) true
      set conf(dollar) true
      if { $param == "unit" } {
        set conf(currency) false
        set conf(dollar) false
      }
      if { $param == "qop" } {
        set conf(dollar) false
      }

      labelentry::setup [array get conf] [array get row]
    }

    set action $frame.action.$id
    if { [winfo exists $action] == 0 } {
      pack [frame $action]
      pack [label $action.delete -text "-" -width 1 -relief raised]
      bind $action.delete <ButtonPress-1> [list %W configure -relief sunken]
      bind $action.delete <ButtonRelease-1> [list \
        fnAPUSupplies::delete'row %W [array get row]]
    }
    if { [winfo exists $frame.action.newentry] == 1 } {
      destroy $frame.action.newentry
    }
    pack [label $frame.action.newentry -text "+" -width 1 -relief raised]
    input'description row

    if { [winfo exists $frame.description.newentry] == 1 } {
      destroy $frame.description.newentry
    }
    pack [label $frame.description.newentry -text " "] -side bottom \
      -fill x -expand true

    input'type row
    if { [winfo exists $frame.type.newentry] == 1 } {
      destroy $frame.type.newentry
    }
    pack [label $frame.type.newentry -text " "] -side bottom \
      -fill x -expand true

    array set entry {
      id newentry
      SupplyId 0
      cost 0
      description ""
      qop 0
      unit ""
      type ""
    }
    set entry(APUId) $row(APUId)
    input'description entry
  }

  proc delete'row { path r } {
    array set row [deserialize $r]
    array set event [list \
      query delete \
      module APUSupplies \
      from APUSupplies \
      id $row(id) \
      idKey id \
    ]
    chan puts $MAIN::chan [array get event]
    $path configure -relief raised
  }
}

source [file join [file dirname [info script]] inputdescription.tcl]
source [file join [file dirname [info script]] inputtype.tcl]
