
namespace eval fnConcretizeProject {
  variable rows
  variable frame
  variable project
  array set rows {}

  variable popupmenu [menu .popupmenu -tearoff false]
  variable lastPopupId {}

  $popupmenu add command -label "Agregar" \
    -command fnConcretizeProject::begin'create

  proc open { space id } {
    variable frame $space
    variable project $id
    array set event [list \
      query select \
      module fnConcretizeProject \
      project $id \
      parent NULL
    ]

    if { [winfo exists $space.$id] == 1 } {
      destroy $space.$id
    }
    set fr $space.$id
    pack [frame $fr] -fill both -expand true
    pack [ScrolledWindow $fr.left] -side left -fill both -expand true
    variable tree [Tree [$fr.left getframe].tree \
      -opencmd fnConcretizeProject::open'leaf \
      -showlines true -deltay 18 -bd 0]

    $fr.left setwidget $tree

    # hacer que redactar sea presionando por un rato
    $tree bindText <1> [list fnEstimateProject::open $fr.right]
    #$tree bindText <Double-1> $onedit

    chan puts $MAIN::chan [array get event]
  }

  proc open'popupmenu { x y id } {
    variable popupmenu
    variable tree
    variable lastPopupId $id
    $popupmenu entryconfigure 0 -label "Agregar"
    array set e [deserialize [lindex [$tree itemconfigure $id -data] 4]]
    if { [lindex [$tree itemconfigure $id -open] 4] == 0 && \
         [lindex [array get e expand] 1] == "t" } {
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
         [lindex [array get data expand] 1] == "t" } {
      $tree opentree $lastPopupId 0
      return
    }

    set data(parent_concreted) $data(id_concreted)
    set data(id_concreted) "$data(id_concreted).[ expr { [llength \
      [$tree nodes $lastPopupId]] + 1 }]"
    set data(description_concreted) ""
    array unset data expand

    $tree insert end $data(parent_concreted) $data(id_concreted) \
      -data [array get data] \
      -image [Bitmap::get oplink]

    $tree opentree $data(parent_concreted) 0
    $tree edit $data(id_concreted) "" [list \
      fnConcretizeProject::create'node [array get data]] 1
  }

  proc create'node { data input } {
    variable tree
    variable project
    array set entry [deserialize $data]

    $tree itemconfigure $entry(id_concreted) -text "..."
    set entry(description_concreted) $input

    if { $input == "" } {
      $tree delete $entry(id_concreted)
    } else {
      array set event {
        query insert
        module fnConcretizeProject
        from fnConcretizeProject
      }
      set event(row) [array get entry]
      set event(project) $project
      chan puts $MAIN::chan [array get event]
    }
    return 1
  }

  proc open'leaf { id } {
    variable tree
    variable project

    array set row [deserialize [lindex \
      [$tree itemconfigure $id -data] 4]]

    array set event [list \
      query select \
      module fnConcretizeProject \
      parent $row(id_general) \
      project $project \
    ]
    chan puts $MAIN::chan [array get event]
  }

  proc concretize { path row } {
    variable project
    array set row_ [deserialize $row]
    $path configure -relief raised

    array set event [list \
      query concretize \
      module fnConcretizeProject \
      keynote $row_(id_general) \
      project $project \
    ]
    chan puts $MAIN::chan [array get event]
  }

  proc deconcretize { path row } {
    variable project
    array set row_ [deserialize $row]
    $path configure -relief raised

    array set event [list \
      module fnConcretizeProject \
      query deconcretize \
      keynote $row_(id_concreted) \
      project $project \
    ]
    chan puts $MAIN::chan [array get event]
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
    if { $row(parent_to_concrete) != "" } {
      set root $row(parent_to_concrete)
    }
    set drawcross auto
    if { [lindex [array get row expand] 1] == "t" } {
      set drawcross allways
    }
    if [$tree exists $root] {
      set node [$tree insert end $root \
        $row(id_to_concrete) -text \
          "     $row(id_to_concrete) [ expr { \
          ($row(description_concreted) != "") ? $row(description_concreted) : \
          $row(description_to_concrete) }]" \
          -data $response(row) -drawcross $drawcross]

      set fr [join [list $tree .img \
        [regsub -all {[.]} $row(id_to_concrete) "_"]] ""]
      pack [frame $fr]
      if { $row(id_concreted) == "" } {
        pack [label $fr.concrete -text "o" -relief raised] -side left
        bind $fr.concrete <ButtonRelease-1> [list \
          fnConcretizeProject::concretize %W [array get row]]
      } else {
        pack [label $fr.concrete -text "x" -relief raised] -side left
        bind $fr.concrete <ButtonRelease-1> [list \
          fnConcretizeProject::deconcretize %W [array get row]]
      }
      bind $fr.concrete <ButtonPress-1> [list %W configure -relief sunken]
      pack [label $fr.separator -text " "] -side left

      pack [label $fr.image -image [Bitmap::get oplink]] -side left
      bind $fr.image <1> [list fnConcretizeProject::open'popupmenu \
        %X %Y $row(id_to_concrete)]

      $tree itemconfigure $node -window $fr
    }
  }

  proc update'leaf { resp } {
    variable tree
    upvar $resp response
    array set row [deserialize $response(row)]
    $tree itemconfigure $row(id_to_concrete) \
      -text "     $row(id_to_concrete) [ expr { \
      ($row(description_concreted) != "") ? $row(description_concreted) : \
      $row(description_to_concrete) }]" \
      -data $response(row)
    set fr [join [list $tree .img \
      [regsub -all {[.]} $row(id_to_concrete) "_"]] ""]
    if { $row(id_concreted) == "" } {
      $fr.concrete configure -text "o"
      bind $fr.concrete <ButtonRelease-1> [list \
        fnConcretizeProject::concretize %W [array get row]]
    } else {
      $fr.concrete configure -text "x"
      bind $fr.concrete <ButtonRelease-1> [list \
        fnConcretizeProject::deconcretize %W [array get row]]
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
