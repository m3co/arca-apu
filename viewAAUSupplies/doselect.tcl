
namespace eval viewAAUSupplies {

  proc setup'newentry { aau_frame r } {
    upvar $r row
    if { [winfo exists $aau_frame.supplies] == 0 } {
      pack [frame $aau_frame.supplies] -side top -fill x -expand true
      foreach param [list action type description unit cost qop partial] {
        if { $param == "partial" } {
          pack [labelframe $aau_frame.supplies.$param -text "Valor Parcial"] \
            -side left
          continue
        }
        if { $param == "action" } {
          pack [labelframe $aau_frame.supplies.$param -text "-"] -side left
          continue
        }
        if { $param == "type" } {
          pack [labelframe $aau_frame.supplies.$param -text "Tipo"] -side left
          continue
        }
        if { $param == "description" } {
          pack [labelframe $aau_frame.supplies.$param -text "Descripcion"] -side left
          continue
        }
        if { $param == "unit" } {
          pack [labelframe $aau_frame.supplies.$param -text "Unidad"] -side left
          continue
        }
        if { $param == "cost" } {
          pack [labelframe $aau_frame.supplies.$param -text "Costo"] -side left
          continue
        }
        if { $param == "qop" } {
          pack [labelframe $aau_frame.supplies.$param -text "Rdto"] -side left
          continue
        }
        pack [labelframe $aau_frame.supplies.$param -text $param] -side left
          # \ -fill x -expand [expr { $param == "description" }]
          # hace parte de la linea de arriba...
      }
    }

    if { [winfo exist $aau_frame.supplies.type.newentry] == 1 } {
      destroy $aau_frame.supplies.type.newentry
    }
    pack [frame $aau_frame.supplies.type.newentry] -side top -fill x
    pack [label $aau_frame.supplies.type.newentry.label -text " "] \
      -side left

    if { [winfo exist $aau_frame.supplies.description.newentry] == 1 } {
      destroy $aau_frame.supplies.description.newentry
    }
    array set newentry {
      id newentry
      AAUSupplies_id newentry
      AAUSupplies_SupplyId ""
      AAUSupplies_AAUId ""
      AAUSupplies_qop ""
      AAU_cost ""
      AAU_description ""
      AAU_information ""
      AAU_id ""
      AAU_qop ""
      AAU_unit ""
      AAU_estimated ""
      Supplies_cost ""
      Supplies_description ""
      Supplies_id ""
      Supplies_unit ""
      Supplies_type ""
      AAU_expand ""
      AAU_parent ""
    }
    set newentry(AAUSupplies_AAUId) $row(AAUSupplies_AAUId)
    set newentry(AAU_id) $row(AAU_id)
    input'description [array get newentry] $aau_frame.supplies

    if { [winfo exist $aau_frame.supplies.unit.newentry] == 1 } {
      destroy $aau_frame.supplies.unit.newentry
    }
    pack [frame $aau_frame.supplies.unit.newentry] -side top -fill x
    pack [label $aau_frame.supplies.unit.newentry.label -text " "] \
      -side left

    if { [winfo exist $aau_frame.supplies.cost.newentry] == 1 } {
      destroy $aau_frame.supplies.cost.newentry
    }
    pack [frame $aau_frame.supplies.cost.newentry] -side top -fill x
    pack [label $aau_frame.supplies.cost.newentry.label -text " "] \
      -side left

    if { [winfo exist $aau_frame.supplies.qop.newentry] == 1 } {
      destroy $aau_frame.supplies.qop.newentry
    }
    pack [frame $aau_frame.supplies.qop.newentry] -side top -fill x
    pack [label $aau_frame.supplies.qop.newentry.label -text " "] \
      -side left

    if { [winfo exist $aau_frame.supplies.partial.newentry] == 1 } {
      destroy $aau_frame.supplies.partial.newentry
    }
    pack [frame $aau_frame.supplies.partial.newentry] -side top -fill x
    pack [label $aau_frame.supplies.partial.newentry.label -text " "] \
      -side left

    if { [winfo exists $aau_frame.supplies.action.newentry] == 1 } {
      destroy $aau_frame.supplies.action.newentry
    }
    pack [label $aau_frame.supplies.action.newentry -text " " \
      -width 1 -relief raised]

  }

  proc 'do'select { resp } {
    variable description
    upvar $resp response
    array set row [deserialize $response(row)]
    variable frame
    if { [info exists frame] != 1 } {
      return
    }

    set keynote_frame $frame.[regsub -all {[.]} $row(AAU_id) "_"]
    if { [winfo exists $keynote_frame] == 0 } {
      pack [labelframe $keynote_frame -text $row(AAU_id)] \
        -fill x -expand true
    }
    if { $row(AAU_expand) == "false" } {
      set aau_frame $keynote_frame.aau_[regsub -all {[.]} $row(AAU_id) "_"]
      if { [winfo exists $aau_frame] == 0 } {
        pack [frame $aau_frame] -side left
        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAU_description \
          frame [frame $aau_frame.aau_description] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side top -fill x -expand true
        labelentry::setup [array get conf] [array get row] [array get description]

        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAU_information \
          frame [frame $aau_frame.aau_information] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side top -fill x -expand true
        labelentry::setup [array get conf] [array get row] [array get description]

        pack [frame $aau_frame.extras] -side top -fill x
        pack [label $aau_frame.extras.aau_unit_text -text "Unidad:"] -side left
        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAU_unit \
          frame [frame $aau_frame.extras.aau_unit] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side left
        labelentry::setup [array get conf] [array get row] [array get description]

        pack [label $aau_frame.extras.aau_cost_text -text "Valor Unitario:"] \
          -side left
        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAU_cost \
          frame [frame $aau_frame.extras.aau_cost] \
          dollar true \
          currency true \
        ]
        pack $conf(frame) -side left
        labelentry::setup [array get conf] [array get row] [array get description]

        pack [label $aau_frame.extras.aau_qop_text -text "Rdto:"] \
          -side left
        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAU_qop \
          frame [frame $aau_frame.extras.aau_qop] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side left
        labelentry::setup [array get conf] [array get row] [array get description]

        if { $row(AAU_qop) != "null" } {
          if { $row(AAU_qop) > 0 } {
            set inverse_qop [ expr { 1.0 / $row(AAU_qop) }]
            pack [label $aau_frame.extras.aau_qop_inverse_text \
              -text ":: 1 / [expr { round($inverse_qop) }]"] \
              -side left
          }
        }

        setup'newentry $aau_frame row
      }

      if { $row(AAUSupplies_id) != "null" } {

        set action $aau_frame.supplies.action.$row(AAUSupplies_id)
        if { [winfo exists $action] == 0 } {
          pack [frame $action]
          pack [label $action.delete -text "-" -width 1 -relief raised]
          bind $action.delete <ButtonPress-1> [list %W configure -relief sunken]
          bind $action.delete <ButtonRelease-1> [list \
            viewAAUSupplies::delete'row %W [array get row]]
        }

        input'type [array get row] $aau_frame.supplies
        input'description [array get row] $aau_frame.supplies

        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key Supplies_unit \
          frame [frame $aau_frame.supplies.unit.$row(AAUSupplies_id)] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side top -fill x
        labelentry::setup [array get conf] [array get row] [array get description]

        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key Supplies_cost \
          frame [frame $aau_frame.supplies.cost.$row(AAUSupplies_id)] \
          dollar true \
          currency true \
        ]
        pack $conf(frame) -side top -fill x
        labelentry::setup [array get conf] [array get row] [array get description]

        array set conf [list \
          from viewAAUSupplies \
          module viewAAUSupplies \
          idkey id \
          key AAUSupplies_qop \
          frame [frame $aau_frame.supplies.qop.$row(AAUSupplies_id)] \
          dollar false \
          currency false \
        ]
        pack $conf(frame) -side top -fill x
        labelentry::setup [array get conf] [array get row] [array get description]

        set partialfr [frame $aau_frame.supplies.partial.$row(AAUSupplies_id)]
        pack $partialfr -side top -fill x
        pack [label $partialfr.label -text \
          "\$[format'currency [ \
          expr { \
            ([isnumeric $row(AAUSupplies_qop)] ? $row(AAUSupplies_qop) : 0) * \
            ([isnumeric $row(Supplies_cost)] ? $row(Supplies_cost) : 0)} \
          ]]"] -side right
        setup'newentry $aau_frame row
      }
    }
  }

}
