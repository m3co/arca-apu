
namespace eval fnConcretizeAPU {
  variable rows
  variable frame
  variable project
  array set rows {}

  variable popupmenu [menu .popupmenu -tearoff false]
  variable lastPopupId {}

  $popupmenu add command -label "Agregar" \
    -command fnConcretizeAPU::begin'create
  $popupmenu add separator
  $popupmenu add command -label "Renombrar" \
    -command fnConcretizeAPU::begin'edit

  proc open { space id } {
    variable frame $space
    variable project $id
    set event [list \
      query {"select"} \
      module {"fnConcretizeAPU"} \
      project $id \
      parent null \
    ]

    if { [winfo exists $space.$id] == 1 } {
      destroy $space.$id
    }
    set fr $space.$id
    pack [frame $fr] -fill both -expand true
    pack [ScrolledWindow $fr.left] -side left -fill both -expand true
    variable tree [Tree [$fr.left getframe].tree \
      -opencmd fnConcretizeAPU::open'leaf \
      -showlines true -deltay 18 -bd 0]

    $fr.left setwidget $tree

    # hacer que redactar sea presionando por un rato
    $tree bindText <1> [list viewAPUSupplies::open'view $fr.right]
    #$tree bindText <Double-1> $onedit

    chan puts $MAIN::chan [json::write object {*}$event]
  }

  proc open'popupmenu { x y id } {
    variable popupmenu
    variable tree
    variable lastPopupId $id
    $popupmenu entryconfigure 0 -label "Agregar"
    array set e [deserialize [lindex [$tree itemconfigure $id -data] 4]]
    if { [lindex [$tree itemconfigure $id -open] 4] == 0 && \
         [lindex [array get e expand] 1] == true } {
      $popupmenu entryconfigure 0 -label "Expandir"
    }
    tk_popup $popupmenu $x $y
  }

  proc begin'create { } {
    variable tree
    variable lastPopupId

    array set data [deserialize [lindex \
      [$tree itemconfigure $lastPopupId -data] 4]]
    if { [lindex [$tree itemconfigure $lastPopupId -open] 4] == 0 && \
         [lindex [array get data expand] 1] == "true" } {
      $tree opentree $lastPopupId 0
      return
    }

    ## Cual es el numero a poner aquí? eso me lo debe indicar SQL
    set data(parent_to_concrete) $data(id_to_concrete)
    set data(id_to_concrete) "$data(id_to_concrete).[ expr { [llength \
      [$tree nodes $lastPopupId]] + 1 }]"
    set data(description_to_concrete) ""
    array unset data expand

    set node [$tree insert end $data(parent_to_concrete) \
      $data(id_to_concrete) -data [array get data]]

    $tree opentree $data(parent_to_concrete) 0

    set fr [join [list $tree .img \
      [regsub -all {[.]} $data(id_to_concrete) "_"]] ""]
    pack [frame $fr]
    pack [label $fr.concrete -text "o" -relief raised] -side left
    pack [label $fr.separator -text " "] -side left
    pack [label $fr.image -image [Bitmap::get oplink]] -side left

    $tree itemconfigure $node -window $fr
    $tree edit $data(id_to_concrete) "" [list \
      fnConcretizeAPU::create'node [array get data]] 1
  }

  proc begin'edit { } {
    variable tree
    variable lastPopupId

    array set entry [deserialize [$tree itemcget $lastPopupId -data]]
    $tree edit $lastPopupId [lindex [array get entry description] 1] \
      [list fnConcretizeAPU::finish'edit $lastPopupId] 1
  }

  proc finish'edit { node newText } {
    variable tree
    $tree itemconfigure $node -text "..."
    set event [dict create \
      query [json::write string update] \
      module [json::write string APU] \
      id [json::write string $node] \
      idkey [json::write string id] \
      key [json::write array [json::write string description]] \
      value [json::write array [json::write string $newText]] \
    ]
    chan puts $MAIN::chan [json::write object {*}$event]
    return 1
  }

  proc create'node { data input } {
    variable tree
    variable project
    array set entry [deserialize $data]

    $tree itemconfigure $entry(id_to_concrete) -text "..."
    set entry(description_to_concrete) $input

    if { $input == "" } {
      $tree delete $entry(id_to_concrete)
    } else {
      set event [dict create \
        query [json::write string insert] \
        module [json::write string fnConcretizeAPU] \
        from [json::write string fnConcretizeAPU] \
        project $project \
      ]
      dict set event row [json::write object \
        parent_to_concrete [json::write string \
          $entry(parent_to_concrete)] \
        description_to_concrete [json::write string \
          $entry(description_to_concrete)] \
      ]
      chan puts $MAIN::chan [json::write object {*}$event]
    }
    return 1
  }

  proc open'leaf { id } {
    variable tree
    variable project

    array set row [deserialize [lindex \
      [$tree itemconfigure $id -data] 4]]

    set event [list \
      query {"select"} \
      module {"fnConcretizeAPU"} \
      parent [json::write string $row(id_general)] \
      project $project \
    ]
    chan puts $MAIN::chan [json::write object {*}$event]
  }

  proc concretize { path row } {
    variable project
    array set row_ [deserialize $row]
    $path configure -relief raised

    set event [dict create \
      query [json::write string concretize] \
      module [json::write string fnConcretizeAPU] \
      keynote [json::write string $row_(id_general)] \
      project $project \
    ]
    chan puts $MAIN::chan [json::write object {*}$event]
  }

  proc deconcretize { path row } {
    variable project
    array set row_ [deserialize $row]
    $path configure -relief raised

    set event [dict create \
      module [json::write string fnConcretizeAPU] \
      query [json::write string deconcretize] \
      keynote [json::write string $row_(id_concreted)] \
      project $project \
    ]
    chan puts $MAIN::chan [json::write object {*}$event]
  }

  proc 'do'select { resp } {
    variable tree
    upvar $resp response
    array set row [deserialize $response(row)]
    if [$tree exists $row(id_to_concrete)] {
      $tree itemconfigure $row(id_to_concrete) -data $response(row)
      return
    }
    set root root
    if { $row(parent_to_concrete) != "null" } {
      set root $row(parent_to_concrete)
    }
    set drawcross auto
    if { [lindex [array get row expand] 1] == true } {
      set drawcross allways
    }
    if [$tree exists $root] {
      set bgcolori [regexp -all {[.]} $row(id_to_concrete)]
      set bgc black
      if { $bgcolori == 0 } {
        set bgc brown
      }
      if { $bgcolori == 1 } {
        set bgc red
      }
      if { $bgcolori == 2 } {
        set bgc blue
      }
      if { $bgcolori == 3 } {
        set bgc green4
      }
      if { $row(expand) == false } {
        set bgc black
      }

      set node [$tree insert end $root \
        $row(id_to_concrete) -text \
          "     $row(id_to_concrete) [ expr { \
          ($row(description_concreted) != "null" && $row(description_concreted) != "") ? $row(description_concreted) : \
          $row(description_to_concrete) }]" \
          -data $response(row) -drawcross $drawcross]

      set fr [join [list $tree .img \
        [regsub -all {[.]} $row(id_to_concrete) "_"]] ""]
      pack [frame $fr]
      if { $row(id_concreted) == "null" || $row(id_concreted) == "" } {
        pack [label $fr.concrete -text "o" -relief raised -bg red] -side left
        bind $fr.concrete <ButtonRelease-1> [list \
          fnConcretizeAPU::concretize %W [array get row]]
        $tree itemconfigure $node -fill gray44
      } else {
        pack [label $fr.concrete -text "x" -relief raised] -side left
        bind $fr.concrete <ButtonRelease-1> [list \
          fnConcretizeAPU::deconcretize %W [array get row]]
        $tree itemconfigure $node -fill $bgc
      }
      bind $fr.concrete <ButtonPress-1> [list %W configure -relief sunken]
      pack [label $fr.separator -text " "] -side left

      pack [label $fr.image -image [Bitmap::get oplink]] -side left
      bind $fr.image <1> [list fnConcretizeAPU::open'popupmenu \
        %X %Y $row(id_to_concrete)]

      $tree itemconfigure $node -window $fr
    }
  }

  proc update'leaf { resp } {
    variable tree
    upvar $resp response
    array set row [deserialize $response(row)]
    if [$tree exists $row(id_to_concrete)] {
      set bgcolori [regexp -all {[.]} $row(id_to_concrete)]
      set bgc black
      if { $bgcolori == 0 } {
        set bgc brown
      }
      if { $bgcolori == 1 } {
        set bgc red
      }
      if { $bgcolori == 2 } {
        set bgc blue
      }
      if { $bgcolori == 3 } {
        set bgc green4
      }
      if { $row(expand) == false } {
        set bgc black
      }
      $tree itemconfigure $row(id_to_concrete) \
        -text "     $row(id_to_concrete) [ expr { \
        ($row(description_concreted) != "null" && $row(description_concreted) != "") ? $row(description_concreted) : \
        $row(description_to_concrete) }]" \
        -data $response(row)
      set fr [join [list $tree .img \
        [regsub -all {[.]} $row(id_to_concrete) "_"]] ""]
      if { $row(id_concreted) == "" || $row(id_concreted) == "null" } {
        $fr.concrete configure -text "o" -bg red
        bind $fr.concrete <ButtonRelease-1> [list \
          fnConcretizeAPU::concretize %W [array get row]]
        $tree itemconfigure $row(id_to_concrete) -fill gray44
      } else {
        $fr.concrete configure -text "x" -bg [. cget -background]
        bind $fr.concrete <ButtonRelease-1> [list \
          fnConcretizeAPU::deconcretize %W [array get row]]
        $tree itemconfigure $row(id_to_concrete) -fill $bgc
      }
      bind $fr.image <1> [list fnConcretizeAPU::open'popupmenu \
        %X %Y $row(id_to_concrete)]
    } else {
      'do'select response
    }
  }

  proc 'do'update { resp } {
    upvar $resp response
    update'leaf response
  }

  proc 'do'insert { resp } {
    upvar $resp response
    update'leaf response
  }

  proc 'do'delete { resp } {
    upvar $resp response
    array set row [deserialize $response(row)]

    # cosas como estas dañan el codigo... yo aqui no debo modificar el evento
    set row(id_concreted) ""
    set row(parent_concreted) ""
    set row(description_concreted) ""
    set response(row) [array get row]
    update'leaf response
  }
}
