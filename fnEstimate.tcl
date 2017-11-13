
namespace eval fnEstimateProject {
  array set rows {}
  set frame ""
  array set paramNames {
    description Descripcion
    quantity Cantidad
    unit Unidad
    estimated {Valor Parcial}
  }

  proc open { space keynote } {
    fnAPUSupplies::clean'data

    variable rows
    array unset rows
    array set rows {}
    set id [regsub -all {[.]} $keynote "_"]
    puts "open $keynote"

    if { [winfo exists $space] == 1 } {
      destroy $space
    }
    pack [ScrolledWindow $space] -side right -fill both -expand true
    set centerFrame [ScrollableFrame [$space getframe].centerframe]
    $space setwidget $centerFrame

    variable frame [$centerFrame getframe].$id
    pack [frame $frame] -fill x -expand true

    array set event [list \
      query select \
      module fnEstimateProject \
      keynote $keynote \
    ]

    chan puts $MAIN::chan [array get event]
  }

  proc 'do'delete { resp } {
    upvar $resp response
    puts "delete"
  }

  proc 'do'insert { resp } {
    upvar $resp response
    puts "insert"
  }

  proc 'do'update { resp } {
    variable frame
    variable rows
    upvar $resp response
    if { $frame == "" } {
      return
    }

    array set row [deserialize $response(row)]
    set rows($row(id)) $response(row)
    set id [regsub -all {[.]} $row(id) "_"]
    set parent [regsub -all {[.]} $row(parent) "_"]

    set fr $frame.$id
    set side top
    if { [winfo exists $frame.$parent] == 1 } {
      set fr $frame.$parent.$id
      set side bottom
    }
    if { [winfo exists $fr] == 0 } {
      return
    }
    if { $row(expand) == "t" } {
      $fr configure -text "$row(id) $row(description)"]
    }
    foreach param [list description quantity \
      unit estimated] {
      if { $param == "description" } {
        if { $row(expand) == "t" } {
          return
        }
      }
      array set conf [list \
        from fnEstimateProject \
        module fnEstimateProject \
        idkey id \
        key $param \
        frame $fr.$param \
        dollar false \
        currency false \
      ]
      if { $param == "estimated" } {
        array set conf {
          dollar true
          currency true
        }
        if { $row(isestimated) == "f" } {
          $fr.$param.label configure
            -text \$[format'currency $row($param)]
          return
        }
      }
      if { $param == "quantity" && $row(quantifiable) == "f" } {
        $fr.$param.label configure -text $row($param)
      } else {
        labelentry::setup [array get conf] [array get row]
      }
    }
  }

  proc 'do'select { resp } {
    variable frame
    variable rows
    variable paramNames

    upvar $resp response
    array set row [deserialize $response(row)]
    set rows($row(id)) $response(row)
    set id [regsub -all {[.]} $row(id) "_"]
    set parent [regsub -all {[.]} $row(parent) "_"]

    set fr $frame.$id
    set side top
    if { [winfo exists $frame.$parent] == 1 } {
      set fr $frame.$parent.$id
      set side bottom
    }
    if { $row(expand) == "t" } {
      pack [labelframe $fr -text "$row(id) $row(description)"] \
        -fill x -expand true -side $side
      pack [frame $fr.actions] -side top -expand true -fill x
      pack [label $fr.actions.showapu -text "Agregar APU inexistente dentro de $row(id)" \
        -relief raised] -side left
    } else {
      pack [labelframe $fr -text $row(id)] -fill x -expand true -side $side
    }
    foreach param [list description quantity \
      unit estimated] {
      if { $param == "description" } {
        if { $row(expand) == "t" } {
          return
        }
        pack [labelframe $fr.$param -text $paramNames($param)] \
          -fill x -expand true -side top
        pack [labelframe $fr.apusupplies -text "Insumos de $row(id)"] \
          -fill x -expand true -side bottom
      } else {
        pack [labelframe $fr.$param -text $paramNames($param)] -side left
      }
      array set conf [list \
        from fnEstimateProject \
        module fnEstimateProject \
        idkey id \
        key $param \
        frame $fr.$param \
        dollar false \
        currency false \
      ]
      if { $param == "estimated" } {
        array set conf {
          dollar true
          currency true
        }
        if { $row(isestimated) == "f" } {
          pack [label $fr.$param.label \
            -text \$[format'currency $row($param)]] -side left
          continue
        }
      }
      if { $param == "quantity" && $row(quantifiable) == "f" } {
        pack [label $fr.$param.label -text $row($param)] -side left
      } else {
        labelentry::setup [array get conf] [array get row]
      }
    }
    pack [frame $fr.actions] -side left
    fnAPUSupplies::open $fr.apusupplies [array get row]
  }
}
